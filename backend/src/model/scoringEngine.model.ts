/**
 * Salamaik API
 * Scoring rules for worksheets and coaching results.
 */

import pool from "../config/db";
import { PoolClient } from "pg";
//-----------------------------------------------------------------------------------------------------------------
interface SPMLScoreRow {
  kppn_id: string;
  kppn_score: number | null;
  kanwil_score: number | null;
  excluded: number;
}

export interface SPMLScoreDetail {
  jumlahChecklist: number;
  jumlahNA: number;
  jumlahChecklistPembagi: number;
  totalSkorKonversi: number;
}

export interface SPMLScoreResult {
  nilaiKPPN: number;
  nilaiKanwil: number;
  detailKPPN: SPMLScoreDetail;
  detailKanwil: SPMLScoreDetail;
}

export interface SPMLScoreCalculation {
  kppnId: string;
  result: SPMLScoreResult;
}

const roundToFourDecimals = (value: number) =>
  Math.round((value + Number.EPSILON) * 10000) / 10000;

//-----------------------------------------------------------------------------------------------------------------
export const calculateSPMLScoreFromRows = (
  rows: Pick<SPMLScoreRow, "kppn_score" | "kanwil_score" | "excluded">[]
): SPMLScoreResult => {
  const jumlahChecklist = rows.length;
  const rowsToCalculate = rows.filter((row) => row.excluded !== 1);
  const jumlahNA = jumlahChecklist - rowsToCalculate.length;
  const jumlahChecklistPembagi = rowsToCalculate.length;

  const calculateScore = (scoreKey: "kppn_score" | "kanwil_score") => {
    const totalSkorKonversi = rowsToCalculate.reduce(
      (total, row) => total + (row[scoreKey] ?? 0) * 10,
      0
    );

    return {
      nilai: jumlahChecklistPembagi === 0
        ? 0
        : roundToFourDecimals(totalSkorKonversi / jumlahChecklistPembagi),
      detail: {
        jumlahChecklist,
        jumlahNA,
        jumlahChecklistPembagi,
        totalSkorKonversi,
      },
    };
  };

  const kppnCalculation = calculateScore("kppn_score");
  const kanwilCalculation = calculateScore("kanwil_score");

  return {
    nilaiKPPN: kppnCalculation.nilai,
    nilaiKanwil: kanwilCalculation.nilai,
    detailKPPN: kppnCalculation.detail,
    detailKanwil: kanwilCalculation.detail,
  };
};

//-----------------------------------------------------------------------------------------------------------------
class ScoringEngine {
  async calculateSPMLScore(
    worksheetSPMLId: string,
    poolTrx?: PoolClient
  ): Promise<SPMLScoreCalculation | undefined> {
    const poolInstance = poolTrx ?? pool;
    const query = `SELECT worksheet_spml_junction.kppn_id,
                          worksheet_spml_junction.kppn_score,
                          worksheet_spml_junction.kanwil_score,
                          worksheet_spml_junction.excluded
                   FROM worksheet_spml_junction
                   WHERE worksheet_spml_junction.worksheet_id = $1
                   ORDER BY worksheet_spml_junction.junction_id ASC`;
    const queryResult = await poolInstance.query<SPMLScoreRow>(query, [worksheetSPMLId]);

    if (queryResult.rows.length === 0) return undefined;

    return {
      kppnId: queryResult.rows[0].kppn_id,
      result: calculateSPMLScoreFromRows(queryResult.rows),
    };
  }
}

const scoringEngine = new ScoringEngine();

export default scoringEngine;
