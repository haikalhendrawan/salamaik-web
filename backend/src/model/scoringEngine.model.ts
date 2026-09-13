/**
 * Salamaik API
 * Scoring rules for worksheets and coaching results.
 */

import pool from "../config/db";
import { PoolClient } from "pg";
import ErrorDetail from "./error.model";
import type { KPPNTipe } from "./unit.model";
//-----------------------------------------------------------------------------------------------------------------
interface SPMLScoreRow {
  kppn_id: string;
  kppn_score: number | null;
  kanwil_score: number | null;
  excluded: number;
}

interface CKScoreRow {
  kppn_id: string;
  kppn_score: number | null;
  kanwil_score: number | null;
  excluded: number;
}

interface PBScoreRow {
  kppn_id: string;
  kppn_score: number | null;
  kanwil_score: number | null;
  excluded: number;
  komponen_id: number;
  komponen_title: string;
  komponen_bobot: number;
  standardisasi: number;
}

interface PeriodWorksheetRow {
  worksheet_id: string;
  kppn_id: string;
  name: string;
  alias: string;
  tipe: KPPNTipe | null;
  provinsi: number;
  period_name: string;
}

interface PeriodPBScoreRow extends PBScoreRow {
  worksheet_id: string;
}

interface PeriodCKScoreRow extends CKScoreRow {
  worksheet_id: string;
}

interface PeriodSPMLScoreRow extends SPMLScoreRow {
  worksheet_id: string;
}

export type PBRegulation = 1 | 2;

export interface PBComponentScoreDetail {
  komponenId: number;
  komponenTitle: string;
  komponenBobot: number;
  jumlahChecklist: number;
  jumlahNA: number;
  jumlahChecklistPembagi: number;
  totalSkorKonversi: number;
  nilaiRataRata: number;
  nilaiTerbobot: number;
}

export interface PBScoreDetail {
  jumlahChecklist: number;
  jumlahChecklistDiisi: number;
  jumlahNA: number;
  jumlahChecklistPembagi: number;
  totalSkorKonversi: number;
  detailKomponen: PBComponentScoreDetail[];
}

export interface PBScoreResult {
  peraturan: PBRegulation;
  nilaiKPPN: number;
  nilaiKanwil: number;
  detailKPPN: PBScoreDetail;
  detailKanwil: PBScoreDetail;
}

export interface PBScoreCalculation {
  kppnId: string;
  result: PBScoreResult;
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

export interface CKScoreDetail {
  jumlahChecklist: number;
  jumlahChecklistDiisi: number;
  jumlahNA: number;
  jumlahChecklistPembagi: number;
  totalSkorKonversi: number;
}

export interface CKScoreResult {
  nilaiKPPN: number;
  nilaiKanwil: number;
  detailKPPN: CKScoreDetail;
  detailKanwil: CKScoreDetail;
}

export interface CKScoreCalculation {
  kppnId: string;
  result: CKScoreResult;
}

export interface AllKPPNSPMLScoreResult extends SPMLScoreResult {
  worksheetSPMLId: string;
  kppnId: string;
  name: string;
  alias: string;
}

export interface AKKScoreComponentDetail {
  nilai: number;
  bobot: number;
  kontribusi: number;
}

export interface AKKSideDetail {
  pb: AKKScoreComponentDetail;
  ck: AKKScoreComponentDetail | null;
  spml: AKKScoreComponentDetail | null;
}

export interface AKKScoreResult {
  peraturan: PBRegulation;
  nilaiKPPN: number;
  nilaiKanwil: number;
  detailKPPN: AKKSideDetail;
  detailKanwil: AKKSideDetail;
}

export interface AKKScoreCalculation {
  kppnId: string;
  kppnName: string;
  kppnAlias: string;
  periodId: number;
  periodName: string;
  worksheetId: string;
  result: AKKScoreResult;
  pbScore: PBScoreResult;
}

interface AKKWorksheetRow {
  id: string;
  kppn_id: string;
  kppn_name: string;
  kppn_alias: string;
  period_id: number;
  period_name: string;
}

export type AKKCategory = "A1_PROVINSI" | "A1_NON_PROVINSI" | "A2";

export interface AKKUnitScore {
  worksheetId: string;
  kppnId: string;
  name: string;
  alias: string;
  tipe: KPPNTipe | null;
  provinsi: number;
  nilaiKPPN: number;
  nilaiKanwil: number;
}

export interface AverageAKKCategoryDetail {
  kategori: AKKCategory;
  bobot: number;
  jumlahKPPN: number;
  rataRataKPPN: number;
  rataRataKanwil: number;
  kontribusiKPPN: number;
  kontribusiKanwil: number;
}

export interface AverageAKKScoreResult {
  jumlahKPPN: number;
  nilaiRataRataKPPN: number;
  nilaiRataRataKanwil: number;
  detailKategori: AverageAKKCategoryDetail[];
  detailKPPN: AKKUnitScore[];
}

export interface AverageAKKScoreCalculation extends AverageAKKScoreResult {
  periodId: number;
  peraturan: PBRegulation;
}

export type AKKContributorCategory = AKKCategory | "SELURUH_KPPN";

export interface AKKContributorUnit {
  worksheetId: string;
  kppnId: string;
  name: string;
  alias: string;
  tipe: KPPNTipe | null;
  provinsi: number;
  pb: AKKScoreComponentDetail;
  ck: AKKScoreComponentDetail | null;
  spml: AKKScoreComponentDetail | null;
  nilaiAKK: number;
  bobotKPPN: number;
  nilaiPenyumbangLHPS: number;
  detailKomponenPB: PBComponentScoreDetail[];
}

export interface AKKContributorGroup {
  kategori: AKKContributorCategory;
  label: string;
  bobot: number;
  jumlahKPPN: number;
  rataRataAKK: number;
  kontribusiLHPS: number;
  kppn: AKKContributorUnit[];
}

export interface AKKContributorLHPSResult {
  jumlahKPPN: number;
  kelompok: AKKContributorGroup[];
  totalNilaiKPPN: number;
  jumlahPembagi: number;
  jumlahNilaiAKKSeluruhKPPN: number;
  jumlahBobotKPPNYangMemenuhi: number;
  nilaiAkhirAspekKinerja: number;
}

export interface AKKContributorLHPSCalculation extends AKKContributorLHPSResult {
  periodId: number;
  periodName: string;
  peraturan: PBRegulation;
}

export interface PeriodAKKUnitCalculation {
  worksheetId: string;
  kppnId: string;
  name: string;
  alias: string;
  tipe: KPPNTipe | null;
  provinsi: number;
  periodName: string;
  result: AKKScoreResult;
  pbScore: PBScoreResult;
}

type WorksheetScorePair = Pick<PBScoreResult, "nilaiKPPN" | "nilaiKanwil">;

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
export const calculateCKScoreFromRows = (
  rows: Pick<CKScoreRow, "kppn_score" | "kanwil_score" | "excluded">[]
): CKScoreResult => {
  const jumlahChecklist = rows.length;
  const jumlahNA = rows.filter((row) => row.excluded === 1).length;

  const calculateScore = (scoreKey: "kppn_score" | "kanwil_score") => {
    const jumlahChecklistDiisi = rows.filter(
      (row) => row.excluded === 1 || row[scoreKey] !== null
    ).length;
    const totalSkorKonversi = rows.reduce(
      (total, row) => total + (row.excluded === 1 ? 100 : (row[scoreKey] ?? 0) * 10),
      0
    );

    return {
      nilai: jumlahChecklist === 0
        ? 0
        : roundToFourDecimals(totalSkorKonversi / jumlahChecklist),
      detail: {
        jumlahChecklist,
        jumlahChecklistDiisi,
        jumlahNA,
        jumlahChecklistPembagi: jumlahChecklist,
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
type PBScoreCalculationRow = Pick<
  PBScoreRow,
  | "kppn_score"
  | "kanwil_score"
  | "excluded"
  | "komponen_id"
  | "komponen_title"
  | "komponen_bobot"
  | "standardisasi"
>;

type PBScoreKey = "kppn_score" | "kanwil_score";

interface PBSideScoreCalculation {
  nilai: number;
  detail: PBScoreDetail;
}

const getPBScoreStatistics = (rows: PBScoreCalculationRow[], scoreKey: PBScoreKey) => {
  const jumlahChecklist = rows.length;
  const rowsToCalculate = rows.filter((row) => row.excluded !== 1);
  return {
    jumlahChecklist,
    jumlahChecklistDiisi: rows.filter(
      (row) => row.excluded === 1 || row[scoreKey] !== null
    ).length,
    jumlahNA: jumlahChecklist - rowsToCalculate.length,
    jumlahChecklistPembagi: rowsToCalculate.length,
    rowsToCalculate,
  };
};

const buildPBScoreResult = (
  peraturan: PBRegulation,
  kppnCalculation: PBSideScoreCalculation,
  kanwilCalculation: PBSideScoreCalculation
): PBScoreResult => ({
  peraturan,
  nilaiKPPN: kppnCalculation.nilai,
  nilaiKanwil: kanwilCalculation.nilai,
  detailKPPN: kppnCalculation.detail,
  detailKanwil: kanwilCalculation.detail,
});

const calculatePBScorePer1 = (rows: PBScoreCalculationRow[]): PBScoreResult => {
  const componentRows = new Map<number, PBScoreCalculationRow[]>();
  rows.forEach((row) => {
    const groupedRows = componentRows.get(row.komponen_id) || [];
    groupedRows.push(row);
    componentRows.set(row.komponen_id, groupedRows);
  });

  const calculateSide = (scoreKey: PBScoreKey): PBSideScoreCalculation => {
    const statistics = getPBScoreStatistics(rows, scoreKey);
    const componentCalculations = Array.from(componentRows.values()).map((rowsInComponent) => {
      const component = rowsInComponent[0];
      const rowsToCalculate = rowsInComponent.filter((row) => row.excluded !== 1);
      const totalSkorKonversi = rowsToCalculate.reduce((total, row) => {
        const maximumScore = row.standardisasi === 1 ? 12 : 10;
        return total + ((row[scoreKey] ?? 0) / maximumScore) * 10;
      }, 0);
      const jumlahChecklistPembagi = rowsToCalculate.length;
      const nilaiRataRata = jumlahChecklistPembagi === 0
        ? 0
        : totalSkorKonversi / jumlahChecklistPembagi;
      const nilaiTerbobot = nilaiRataRata * (Number(component.komponen_bobot) / 100);

      return {
        totalSkorKonversi,
        nilaiTerbobot,
        detail: {
          komponenId: component.komponen_id,
          komponenTitle: component.komponen_title,
          komponenBobot: Number(component.komponen_bobot),
          jumlahChecklist: rowsInComponent.length,
          jumlahNA: rowsInComponent.length - jumlahChecklistPembagi,
          jumlahChecklistPembagi,
          totalSkorKonversi: roundToFourDecimals(totalSkorKonversi),
          nilaiRataRata: roundToFourDecimals(nilaiRataRata),
          nilaiTerbobot: roundToFourDecimals(nilaiTerbobot),
        },
      };
    });
    const totalSkorKonversi = componentCalculations.reduce(
      (total, component) => total + component.totalSkorKonversi,
      0
    );
    const nilai = componentCalculations.reduce(
      (total, component) => total + component.nilaiTerbobot,
      0
    );

    return {
      nilai: roundToFourDecimals(nilai),
      detail: {
        jumlahChecklist: statistics.jumlahChecklist,
        jumlahChecklistDiisi: statistics.jumlahChecklistDiisi,
        jumlahNA: statistics.jumlahNA,
        jumlahChecklistPembagi: statistics.jumlahChecklistPembagi,
        totalSkorKonversi: roundToFourDecimals(totalSkorKonversi),
        detailKomponen: componentCalculations.map((component) => component.detail),
      },
    };
  };

  return buildPBScoreResult(1, calculateSide("kppn_score"), calculateSide("kanwil_score"));
};

const calculatePBScoreND635 = (rows: PBScoreCalculationRow[]): PBScoreResult => {
  const calculateSide = (scoreKey: PBScoreKey): PBSideScoreCalculation => {
    const statistics = getPBScoreStatistics(rows, scoreKey);
    const totalSkorKonversi = statistics.rowsToCalculate.reduce(
      (total, row) => total + ((row[scoreKey] ?? 0) / 10) * 100,
      0
    );

    return {
      nilai: statistics.jumlahChecklistPembagi === 0
        ? 0
        : roundToFourDecimals(totalSkorKonversi / statistics.jumlahChecklistPembagi),
      detail: {
        jumlahChecklist: statistics.jumlahChecklist,
        jumlahChecklistDiisi: statistics.jumlahChecklistDiisi,
        jumlahNA: statistics.jumlahNA,
        jumlahChecklistPembagi: statistics.jumlahChecklistPembagi,
        totalSkorKonversi: roundToFourDecimals(totalSkorKonversi),
        detailKomponen: [],
      },
    };
  };

  return buildPBScoreResult(2, calculateSide("kppn_score"), calculateSide("kanwil_score"));
};

export const calculatePBScoreFromRows = (
  rows: PBScoreCalculationRow[],
  peraturan: PBRegulation
): PBScoreResult => {
  if (peraturan === 1) {
    return calculatePBScorePer1(rows);
  }

  if (peraturan === 2) {
    return calculatePBScoreND635(rows);
  }

  throw new RangeError("PB regulation must be 1 or 2");
};

//-----------------------------------------------------------------------------------------------------------------
const buildAKKComponentDetail = (
  nilai: number,
  bobot: number
): AKKScoreComponentDetail => ({
  nilai,
  bobot,
  kontribusi: roundToFourDecimals(nilai * (bobot / 100)),
});

export const calculateAKKScoreFromWorksheetScores = (
  peraturan: PBRegulation,
  pbScore: WorksheetScorePair,
  ckScore?: WorksheetScorePair,
  spmlScore?: WorksheetScorePair
): AKKScoreResult => {
  if (peraturan === 1) {
    return {
      peraturan,
      nilaiKPPN: pbScore.nilaiKPPN,
      nilaiKanwil: pbScore.nilaiKanwil,
      detailKPPN: {
        pb: buildAKKComponentDetail(pbScore.nilaiKPPN, 100),
        ck: null,
        spml: null,
      },
      detailKanwil: {
        pb: buildAKKComponentDetail(pbScore.nilaiKanwil, 100),
        ck: null,
        spml: null,
      },
    };
  }

  if (peraturan === 2) {
    if (!ckScore || !spmlScore) {
      throw new Error("CK and SPML scores are required for regulation 2");
    }

    const buildSideDetail = (
      scoreKey: "nilaiKPPN" | "nilaiKanwil"
    ): AKKSideDetail => ({
      pb: buildAKKComponentDetail(pbScore[scoreKey], 50),
      ck: buildAKKComponentDetail(ckScore[scoreKey], 35),
      spml: buildAKKComponentDetail(spmlScore[scoreKey], 15),
    });

    const detailKPPN = buildSideDetail("nilaiKPPN");
    const detailKanwil = buildSideDetail("nilaiKanwil");

    return {
      peraturan,
      nilaiKPPN: roundToFourDecimals(
        (pbScore.nilaiKPPN * 0.5)
        + (ckScore.nilaiKPPN * 0.35)
        + (spmlScore.nilaiKPPN * 0.15)
      ),
      nilaiKanwil: roundToFourDecimals(
        (pbScore.nilaiKanwil * 0.5)
        + (ckScore.nilaiKanwil * 0.35)
        + (spmlScore.nilaiKanwil * 0.15)
      ),
      detailKPPN,
      detailKanwil,
    };
  }

  throw new RangeError("AKK regulation must be 1 or 2");
};

const calculateAverage = (values: number[]) =>
  values.length === 0
    ? 0
    : values.reduce((total, value) => total + value, 0) / values.length;

const AKK_CATEGORY_WEIGHTS: Record<AKKCategory, number> = {
  A1_PROVINSI: 45,
  A1_NON_PROVINSI: 35,
  A2: 20,
};

const getAKKCategory = (
  unit: Pick<AKKUnitScore, "kppnId" | "tipe" | "provinsi">
): AKKCategory => {
  if (unit.provinsi !== 0 && unit.provinsi !== 1) {
    throw new ErrorDetail(
      409,
      `AKK score cannot be calculated because KPPN ${unit.kppnId} has an invalid provinsi value`
    );
  }

  if (unit.tipe === "A1") {
    return unit.provinsi === 1 ? "A1_PROVINSI" : "A1_NON_PROVINSI";
  }

  if (unit.tipe === "A2") {
    return "A2";
  }

  const tipe = unit.tipe ?? "NULL";
  throw new ErrorDetail(
    409,
    `AKK score cannot be calculated because KPPN ${unit.kppnId} has unsupported tipe ${tipe}`
  );
};

export const calculateAverageAKKScoreFromUnits = (
  peraturan: PBRegulation,
  units: AKKUnitScore[]
): AverageAKKScoreResult => {
  if (units.length === 0) {
    throw new ErrorDetail(404, "No KPPN AKK scores were found");
  }

  if (peraturan === 1) {
    return {
      jumlahKPPN: units.length,
      nilaiRataRataKPPN: roundToFourDecimals(
        calculateAverage(units.map((unit) => unit.nilaiKPPN))
      ),
      nilaiRataRataKanwil: roundToFourDecimals(
        calculateAverage(units.map((unit) => unit.nilaiKanwil))
      ),
      detailKategori: [],
      detailKPPN: units,
    };
  }

  if (peraturan === 2) {
    const groupedUnits = new Map<AKKCategory, AKKUnitScore[]>([
      ["A1_PROVINSI", []],
      ["A1_NON_PROVINSI", []],
      ["A2", []],
    ]);

    units.forEach((unit) => {
      groupedUnits.get(getAKKCategory(unit))!.push(unit);
    });

    const emptyCategories = Array.from(groupedUnits.entries())
      .filter(([, categoryUnits]) => categoryUnits.length === 0)
      .map(([category]) => category);

    if (emptyCategories.length > 0) {
      throw new ErrorDetail(
        409,
        `AKK score cannot be calculated because these categories have no KPPN: ${emptyCategories.join(", ")}`
      );
    }

    const categoryCalculations = Array.from(groupedUnits.entries()).map(
      ([kategori, categoryUnits]) => {
        const bobot = AKK_CATEGORY_WEIGHTS[kategori];
        const rawAverageKPPN = calculateAverage(
          categoryUnits.map((unit) => unit.nilaiKPPN)
        );
        const rawAverageKanwil = calculateAverage(
          categoryUnits.map((unit) => unit.nilaiKanwil)
        );

        return {
          rawContributionKPPN: rawAverageKPPN * (bobot / 100),
          rawContributionKanwil: rawAverageKanwil * (bobot / 100),
          detail: {
            kategori,
            bobot,
            jumlahKPPN: categoryUnits.length,
            rataRataKPPN: roundToFourDecimals(rawAverageKPPN),
            rataRataKanwil: roundToFourDecimals(rawAverageKanwil),
            kontribusiKPPN: roundToFourDecimals(rawAverageKPPN * (bobot / 100)),
            kontribusiKanwil: roundToFourDecimals(rawAverageKanwil * (bobot / 100)),
          },
        };
      }
    );

    return {
      jumlahKPPN: units.length,
      nilaiRataRataKPPN: roundToFourDecimals(
        categoryCalculations.reduce(
          (total, category) => total + category.rawContributionKPPN,
          0
        )
      ),
      nilaiRataRataKanwil: roundToFourDecimals(
        categoryCalculations.reduce(
          (total, category) => total + category.rawContributionKanwil,
          0
        )
      ),
      detailKategori: categoryCalculations.map((category) => category.detail),
      detailKPPN: units,
    };
  }

  throw new RangeError("Average AKK regulation must be 1 or 2");
};

const AKK_CATEGORY_LABELS: Record<AKKContributorCategory, string> = {
  A1_PROVINSI: "KPPN Tipe A1 Provinsi",
  A1_NON_PROVINSI: "KPPN Tipe A1 Non Provinsi",
  A2: "KPPN Tipe A2",
  SELURUH_KPPN: "Seluruh KPPN",
};

export const calculateAKKContributorLHPSFromUnits = (
  peraturan: PBRegulation,
  units: PeriodAKKUnitCalculation[]
): AKKContributorLHPSResult => {
  if (units.length === 0) {
    throw new ErrorDetail(404, "No KPPN AKK scores were found");
  }

  if (peraturan !== 1 && peraturan !== 2) {
    throw new RangeError("AKK contributor regulation must be 1 or 2");
  }

  const categoryOrder: AKKContributorCategory[] = peraturan === 1
    ? ["SELURUH_KPPN"]
    : ["A1_PROVINSI", "A1_NON_PROVINSI", "A2"];
  const categoryWeights: Record<AKKContributorCategory, number> = {
    ...AKK_CATEGORY_WEIGHTS,
    SELURUH_KPPN: 100,
  };
  const groupedUnits = new Map<AKKContributorCategory, PeriodAKKUnitCalculation[]>(
    categoryOrder.map((category) => [category, []])
  );

  units.forEach((unit) => {
    if (unit.result.peraturan !== peraturan) {
      throw new ErrorDetail(
        409,
        `AKK contributor cannot be calculated because KPPN ${unit.kppnId} uses a different regulation`
      );
    }

    const category = peraturan === 1 ? "SELURUH_KPPN" : getAKKCategory(unit);
    groupedUnits.get(category)!.push(unit);
  });

  const emptyCategories = categoryOrder.filter(
    (category) => groupedUnits.get(category)?.length === 0
  );
  if (emptyCategories.length > 0) {
    throw new ErrorDetail(
      409,
      `AKK contributor cannot be calculated because these categories have no KPPN: ${emptyCategories.join(", ")}`
    );
  }

  const kelompok = categoryOrder.map((kategori): AKKContributorGroup => {
    const categoryUnits = groupedUnits.get(kategori)!;
    const bobot = categoryWeights[kategori];
    const kppn = categoryUnits.map((unit): AKKContributorUnit => {
      const nilaiAKK = unit.result.nilaiKanwil;
      return {
        worksheetId: unit.worksheetId,
        kppnId: unit.kppnId,
        name: unit.name,
        alias: unit.alias,
        tipe: unit.tipe,
        provinsi: unit.provinsi,
        pb: unit.result.detailKanwil.pb,
        ck: unit.result.detailKanwil.ck,
        spml: unit.result.detailKanwil.spml,
        nilaiAKK,
        bobotKPPN: bobot,
        nilaiPenyumbangLHPS: roundToFourDecimals(nilaiAKK * (bobot / 100)),
        detailKomponenPB: unit.pbScore.detailKanwil.detailKomponen,
      };
    });
    const rataRataAKK = calculateAverage(kppn.map((unit) => unit.nilaiAKK));
    const kontribusiLHPS = calculateAverage(
      kppn.map((unit) => unit.nilaiPenyumbangLHPS)
    );

    return {
      kategori,
      label: AKK_CATEGORY_LABELS[kategori],
      bobot,
      jumlahKPPN: kppn.length,
      rataRataAKK: roundToFourDecimals(rataRataAKK),
      kontribusiLHPS: roundToFourDecimals(kontribusiLHPS),
      kppn,
    };
  });

  const totalNilaiKPPN = units.reduce(
    (total, unit) => total + unit.result.nilaiKanwil,
    0
  );
  const jumlahNilaiAKKSeluruhKPPN = peraturan === 1
    ? totalNilaiKPPN
    : kelompok.reduce((total, group) => total + group.kontribusiLHPS, 0);
  const jumlahBobotKPPNYangMemenuhi = kelompok.reduce(
    (total, group) => total + group.bobot,
    0
  );

  return {
    jumlahKPPN: units.length,
    kelompok,
    totalNilaiKPPN: roundToFourDecimals(totalNilaiKPPN),
    jumlahPembagi: units.length,
    jumlahNilaiAKKSeluruhKPPN: roundToFourDecimals(jumlahNilaiAKKSeluruhKPPN),
    jumlahBobotKPPNYangMemenuhi,
    nilaiAkhirAspekKinerja: peraturan === 1
      ? roundToFourDecimals(totalNilaiKPPN / units.length)
      : roundToFourDecimals(
        jumlahNilaiAKKSeluruhKPPN / (jumlahBobotKPPNYangMemenuhi / 100)
      ),
  };
};

const groupPeriodRowsByWorksheet = <T extends { worksheet_id: string }>(rows: T[]) => {
  const groupedRows = new Map<string, T[]>();

  rows.forEach((row) => {
    const worksheetRows = groupedRows.get(row.worksheet_id) ?? [];
    worksheetRows.push(row);
    groupedRows.set(row.worksheet_id, worksheetRows);
  });

  return groupedRows;
};

const loadPeriodAKKUnitCalculations = async (
  periodId: number,
  peraturan: PBRegulation,
  poolInstance: PoolClient | typeof pool
): Promise<PeriodAKKUnitCalculation[] | undefined> => {
  const worksheetQuery = `SELECT worksheet_ref.id AS worksheet_id,
                                 worksheet_ref.kppn_id,
                                 kppn_ref.name,
                                 kppn_ref.alias,
                                 kppn_ref.tipe,
                                 kppn_ref.provinsi,
                                 period_ref.name AS period_name
                          FROM worksheet_ref
                          INNER JOIN kppn_ref
                            ON kppn_ref.id = worksheet_ref.kppn_id
                           AND kppn_ref.level = 0
                          INNER JOIN period_ref
                            ON period_ref.id = worksheet_ref.period
                          WHERE worksheet_ref.period = $1
                          ORDER BY kppn_ref.col_order ASC`;
  const worksheetResult = await poolInstance.query<PeriodWorksheetRow>(
    worksheetQuery,
    [periodId]
  );

  if (worksheetResult.rows.length === 0) return undefined;

  const pbQuery = `SELECT worksheet_junction.worksheet_id,
                          worksheet_ref.kppn_id,
                          worksheet_junction.kppn_score,
                          worksheet_junction.kanwil_score,
                          worksheet_junction.excluded,
                          checklist_ref.komponen_id,
                          checklist_ref.standardisasi,
                          komponen_ref.title AS komponen_title,
                          komponen_ref.bobot AS komponen_bobot
                   FROM worksheet_junction
                   INNER JOIN worksheet_ref
                     ON worksheet_ref.id = worksheet_junction.worksheet_id
                   INNER JOIN kppn_ref
                     ON kppn_ref.id = worksheet_ref.kppn_id
                    AND kppn_ref.level = 0
                   INNER JOIN checklist_ref
                     ON checklist_ref.id = worksheet_junction.checklist_id
                   INNER JOIN komponen_ref
                     ON komponen_ref.id = checklist_ref.komponen_id
                   WHERE worksheet_ref.period = $1
                   ORDER BY worksheet_junction.worksheet_id,
                            checklist_ref.komponen_id,
                            worksheet_junction.junction_id`;
  const pbResult = await poolInstance.query<PeriodPBScoreRow>(pbQuery, [periodId]);
  const pbRowsByWorksheet = groupPeriodRowsByWorksheet(pbResult.rows);

  let ckRowsByWorksheet = new Map<string, PeriodCKScoreRow[]>();
  let spmlRowsByWorksheet = new Map<string, PeriodSPMLScoreRow[]>();

  if (peraturan === 2) {
    const ckQuery = `SELECT worksheet_ck_junction.worksheet_id,
                            worksheet_ref.kppn_id,
                            worksheet_ck_junction.kppn_score,
                            worksheet_ck_junction.kanwil_score,
                            worksheet_ck_junction.excluded
                     FROM worksheet_ck_junction
                     INNER JOIN worksheet_ref
                       ON worksheet_ref.id = worksheet_ck_junction.worksheet_id
                     INNER JOIN kppn_ref
                       ON kppn_ref.id = worksheet_ref.kppn_id
                      AND kppn_ref.level = 0
                     WHERE worksheet_ref.period = $1
                     ORDER BY worksheet_ck_junction.worksheet_id,
                              worksheet_ck_junction.junction_id`;
    const ckResult = await poolInstance.query<PeriodCKScoreRow>(ckQuery, [periodId]);
    ckRowsByWorksheet = groupPeriodRowsByWorksheet(ckResult.rows);

    const spmlQuery = `SELECT worksheet_spml_junction.worksheet_id,
                              worksheet_ref.kppn_id,
                              worksheet_spml_junction.kppn_score,
                              worksheet_spml_junction.kanwil_score,
                              worksheet_spml_junction.excluded
                       FROM worksheet_spml_junction
                       INNER JOIN worksheet_ref
                         ON worksheet_ref.id = worksheet_spml_junction.worksheet_id
                       INNER JOIN kppn_ref
                         ON kppn_ref.id = worksheet_ref.kppn_id
                        AND kppn_ref.level = 0
                       WHERE worksheet_ref.period = $1
                       ORDER BY worksheet_spml_junction.worksheet_id,
                                worksheet_spml_junction.junction_id`;
    const spmlResult = await poolInstance.query<PeriodSPMLScoreRow>(spmlQuery, [periodId]);
    spmlRowsByWorksheet = groupPeriodRowsByWorksheet(spmlResult.rows);
  }

  return worksheetResult.rows.map((worksheet): PeriodAKKUnitCalculation => {
    const pbRows = pbRowsByWorksheet.get(worksheet.worksheet_id);
    if (!pbRows?.length) {
      throw new ErrorDetail(
        409,
        `AKK cannot be calculated because PB assignment for KPPN ${worksheet.kppn_id} is incomplete`
      );
    }

    const pbScore = calculatePBScoreFromRows(pbRows, peraturan);
    let result: AKKScoreResult;

    if (peraturan === 1) {
      result = calculateAKKScoreFromWorksheetScores(peraturan, pbScore);
    } else {
      const ckRows = ckRowsByWorksheet.get(worksheet.worksheet_id);
      const spmlRows = spmlRowsByWorksheet.get(worksheet.worksheet_id);

      if (!ckRows?.length || !spmlRows?.length) {
        const missingWorksheets = [
          !ckRows?.length ? "CK" : null,
          !spmlRows?.length ? "SPML" : null,
        ].filter(Boolean).join(" and ");
        throw new ErrorDetail(
          409,
          `AKK cannot be calculated because ${missingWorksheets} assignment for KPPN ${worksheet.kppn_id} is incomplete`
        );
      }

      result = calculateAKKScoreFromWorksheetScores(
        peraturan,
        pbScore,
        calculateCKScoreFromRows(ckRows),
        calculateSPMLScoreFromRows(spmlRows)
      );
    }

    return {
      worksheetId: worksheet.worksheet_id,
      kppnId: worksheet.kppn_id,
      name: worksheet.name,
      alias: worksheet.alias,
      tipe: worksheet.tipe,
      provinsi: worksheet.provinsi,
      periodName: worksheet.period_name,
      result,
      pbScore,
    };
  });
};

//-----------------------------------------------------------------------------------------------------------------
class ScoringEngine {
  async calculateAverageAKKScore(
    periodId: number,
    peraturan: PBRegulation,
    poolTrx?: PoolClient
  ): Promise<AverageAKKScoreCalculation | undefined> {
    const poolInstance = poolTrx ?? pool;
    const unitCalculations = await loadPeriodAKKUnitCalculations(
      periodId,
      peraturan,
      poolInstance
    );
    if (!unitCalculations) return undefined;

    const unitScores = unitCalculations.map((unit): AKKUnitScore => ({
      worksheetId: unit.worksheetId,
      kppnId: unit.kppnId,
      name: unit.name,
      alias: unit.alias,
      tipe: unit.tipe,
      provinsi: unit.provinsi,
      nilaiKPPN: unit.result.nilaiKPPN,
      nilaiKanwil: unit.result.nilaiKanwil,
    }));

    return {
      periodId,
      peraturan,
      ...calculateAverageAKKScoreFromUnits(peraturan, unitScores),
    };
  }

  async calculateAKKContributorLHPS(
    periodId: number,
    peraturan: PBRegulation,
    poolTrx?: PoolClient
  ): Promise<AKKContributorLHPSCalculation | undefined> {
    const poolInstance = poolTrx ?? pool;
    const unitCalculations = await loadPeriodAKKUnitCalculations(
      periodId,
      peraturan,
      poolInstance
    );
    if (!unitCalculations) return undefined;

    return {
      periodId,
      periodName: unitCalculations[0].periodName,
      peraturan,
      ...calculateAKKContributorLHPSFromUnits(peraturan, unitCalculations),
    };
  }

  async calculateAKKScore(
    kppnId: string,
    periodId: number,
    peraturan: PBRegulation,
    poolTrx?: PoolClient
  ): Promise<AKKScoreCalculation | undefined> {
    const poolInstance = poolTrx ?? pool;
    const worksheetQuery = `SELECT worksheet_ref.id,
                                   worksheet_ref.kppn_id,
                                   kppn_ref.name AS kppn_name,
                                   kppn_ref.alias AS kppn_alias,
                                   period_ref.id AS period_id,
                                   period_ref.name AS period_name
                            FROM worksheet_ref
                            INNER JOIN kppn_ref
                              ON kppn_ref.id = worksheet_ref.kppn_id
                            INNER JOIN period_ref
                              ON period_ref.id = worksheet_ref.period
                            WHERE worksheet_ref.kppn_id = $1
                              AND worksheet_ref.period = $2
                            LIMIT 1`;
    const worksheetResult = await poolInstance.query<AKKWorksheetRow>(
      worksheetQuery,
      [kppnId, periodId]
    );

    if (worksheetResult.rows.length === 0) return undefined;

    const worksheet = worksheetResult.rows[0];
    const worksheetId = worksheet.id;

    if (peraturan === 1) {
      const pbCalculation = await this.calculatePBScore(worksheetId, peraturan, poolTrx);
      if (!pbCalculation) {
        throw new ErrorDetail(
          409,
          "AKK score cannot be calculated because PB worksheet assignment is incomplete"
        );
      }

      return {
        kppnId,
        kppnName: worksheet.kppn_name,
        kppnAlias: worksheet.kppn_alias,
        periodId,
        periodName: worksheet.period_name,
        worksheetId,
        result: calculateAKKScoreFromWorksheetScores(peraturan, pbCalculation.result),
        pbScore: pbCalculation.result,
      };
    }

    const [pbCalculation, ckCalculation, spmlCalculation] = await Promise.all([
      this.calculatePBScore(worksheetId, peraturan, poolTrx),
      this.calculateCKScore(worksheetId, poolTrx),
      this.calculateSPMLScore(worksheetId, poolTrx),
    ]);

    if (!pbCalculation || !ckCalculation || !spmlCalculation) {
      const missingWorksheets = [
        !pbCalculation ? "PB" : null,
        !ckCalculation ? "CK" : null,
        !spmlCalculation ? "SPML" : null,
      ].filter(Boolean).join(" and ");

      throw new ErrorDetail(
        409,
        `AKK score cannot be calculated because ${missingWorksheets} worksheet assignment is incomplete`
      );
    }

    return {
      kppnId,
      kppnName: worksheet.kppn_name,
      kppnAlias: worksheet.kppn_alias,
      periodId,
      periodName: worksheet.period_name,
      worksheetId,
      result: calculateAKKScoreFromWorksheetScores(
        peraturan,
        pbCalculation.result,
        ckCalculation.result,
        spmlCalculation.result
      ),
      pbScore: pbCalculation.result,
    };
  }

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

  async calculateCKScore(
    worksheetCKId: string,
    poolTrx?: PoolClient
  ): Promise<CKScoreCalculation | undefined> {
    const poolInstance = poolTrx ?? pool;
    const query = `SELECT worksheet_ref.kppn_id,
                          worksheet_ck_junction.kppn_score,
                          worksheet_ck_junction.kanwil_score,
                          worksheet_ck_junction.excluded
                   FROM worksheet_ck_junction
                   INNER JOIN worksheet_ref
                     ON worksheet_ref.id = worksheet_ck_junction.worksheet_id
                   WHERE worksheet_ck_junction.worksheet_id = $1
                   ORDER BY worksheet_ck_junction.junction_id ASC`;
    const queryResult = await poolInstance.query<CKScoreRow>(query, [worksheetCKId]);

    if (queryResult.rows.length === 0) return undefined;

    return {
      kppnId: queryResult.rows[0].kppn_id,
      result: calculateCKScoreFromRows(queryResult.rows),
    };
  }

  async calculatePBScore(
    worksheetPBId: string,
    peraturan: PBRegulation,
    poolTrx?: PoolClient
  ): Promise<PBScoreCalculation | undefined> {
    const poolInstance = poolTrx ?? pool;
    const query = `SELECT worksheet_ref.kppn_id,
                          worksheet_junction.kppn_score,
                          worksheet_junction.kanwil_score,
                          worksheet_junction.excluded,
                          checklist_ref.komponen_id,
                          checklist_ref.standardisasi,
                          komponen_ref.title AS komponen_title,
                          komponen_ref.bobot AS komponen_bobot
                   FROM worksheet_junction
                   INNER JOIN worksheet_ref
                     ON worksheet_ref.id = worksheet_junction.worksheet_id
                   INNER JOIN checklist_ref
                     ON checklist_ref.id = worksheet_junction.checklist_id
                   INNER JOIN komponen_ref
                     ON komponen_ref.id = checklist_ref.komponen_id
                   WHERE worksheet_junction.worksheet_id = $1
                   ORDER BY checklist_ref.komponen_id ASC,
                            worksheet_junction.junction_id ASC`;
    const queryResult = await poolInstance.query<PBScoreRow>(query, [worksheetPBId]);

    if (queryResult.rows.length === 0) return undefined;

    return {
      kppnId: queryResult.rows[0].kppn_id,
      result: calculatePBScoreFromRows(queryResult.rows, peraturan),
    };
  }
}

const scoringEngine = new ScoringEngine();

export default scoringEngine;
