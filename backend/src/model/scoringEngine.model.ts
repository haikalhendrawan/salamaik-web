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

export interface AllKPPNSPMLScoreRow extends SPMLScoreRow {
  worksheet_spml_id: string;
  name: string;
  alias: string;
}

export interface SPMLScoreDetail {
  jumlahChecklist: number;
  jumlahChecklistDiisi: number;
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

export interface AllKPPNSPMLScoreResult extends SPMLScoreResult {
  worksheetSPMLId: string;
  kppnId: string;
  name: string;
  alias: string;
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
    const jumlahChecklistDiisi = rows.filter(
      (row) => row[scoreKey] !== null || row.excluded === 1
    ).length;
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
        jumlahChecklistDiisi,
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

export const calculateAllKPPNSPMLScoresFromRows = (
  rows: AllKPPNSPMLScoreRow[]
): AllKPPNSPMLScoreResult[] => {
  const groupedRows = new Map<string, AllKPPNSPMLScoreRow[]>();

  rows.forEach((row) => {
    const worksheetRows = groupedRows.get(row.worksheet_spml_id) || [];
    worksheetRows.push(row);
    groupedRows.set(row.worksheet_spml_id, worksheetRows);
  });

  return Array.from(groupedRows.entries()).map(([worksheetSPMLId, worksheetRows]) => {
    const worksheet = worksheetRows[0];
    return {
      worksheetSPMLId,
      kppnId: worksheet.kppn_id,
      name: worksheet.name,
      alias: worksheet.alias,
      ...calculateSPMLScoreFromRows(worksheetRows),
    };
  });
};

//-----------------------------------------------------------------------------------------------------------------
class ScoringEngine {
  async calculateAllKPPNSPMLScores(
    periodId: number,
    poolTrx?: PoolClient
  ): Promise<AllKPPNSPMLScoreResult[]> {
    const poolInstance = poolTrx ?? pool;
    const query = `SELECT worksheet_ref.id AS worksheet_spml_id,
                          worksheet_ref.kppn_id,
                          kppn_ref.name,
                          kppn_ref.alias,
                          worksheet_spml_junction.kppn_score,
                          worksheet_spml_junction.kanwil_score,
                          worksheet_spml_junction.excluded
                   FROM worksheet_ref
                   INNER JOIN kppn_ref
                     ON kppn_ref.id = worksheet_ref.kppn_id
                    AND kppn_ref.level = 0
                   INNER JOIN worksheet_spml_junction
                     ON worksheet_spml_junction.worksheet_id = worksheet_ref.id
                   WHERE worksheet_ref.period = $1
                   ORDER BY kppn_ref.col_order ASC,
                            worksheet_spml_junction.junction_id ASC`;
    const queryResult = await poolInstance.query<AllKPPNSPMLScoreRow>(query, [periodId]);

    return calculateAllKPPNSPMLScoresFromRows(queryResult.rows);
  }

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
