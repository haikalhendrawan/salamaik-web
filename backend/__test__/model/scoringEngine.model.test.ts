import {
  calculateAllKPPNSPMLScoresFromRows,
  calculateAKKContributorLHPSFromUnits,
  calculateAKKScoreFromWorksheetScores,
  calculateAverageAKKScoreFromUnits,
  calculateCKScoreFromRows,
  calculatePBScoreFromRows,
  calculateSPMLScoreFromRows,
  PBScoreResult,
} from "../../src/model/scoringEngine.model";

describe("calculateAKKScoreFromWorksheetScores", () => {
  it("uses the PB score unchanged for regulation 1", () => {
    const result = calculateAKKScoreFromWorksheetScores(
      1,
      { nilaiKPPN: 8.25, nilaiKanwil: 8 }
    );

    expect(result).toMatchObject({
      peraturan: 1,
      nilaiKPPN: 8.25,
      nilaiKanwil: 8,
      detailKPPN: {
        pb: { nilai: 8.25, bobot: 100, kontribusi: 8.25 },
        ck: null,
        spml: null,
      },
      detailKanwil: {
        pb: { nilai: 8, bobot: 100, kontribusi: 8 },
        ck: null,
        spml: null,
      },
    });
  });

  it("calculates regulation 2 independently for KPPN and Kanwil", () => {
    const result = calculateAKKScoreFromWorksheetScores(
      2,
      { nilaiKPPN: 90, nilaiKanwil: 80 },
      { nilaiKPPN: 80, nilaiKanwil: 70 },
      { nilaiKPPN: 70, nilaiKanwil: 60 }
    );

    expect(result.nilaiKPPN).toBe(83.5);
    expect(result.nilaiKanwil).toBe(73.5);
    expect(result.detailKPPN).toEqual({
      pb: { nilai: 90, bobot: 50, kontribusi: 45 },
      ck: { nilai: 80, bobot: 35, kontribusi: 28 },
      spml: { nilai: 70, bobot: 15, kontribusi: 10.5 },
    });
  });

  it("rounds regulation 2 contributions and final scores to four decimals", () => {
    const result = calculateAKKScoreFromWorksheetScores(
      2,
      { nilaiKPPN: 66.6667, nilaiKanwil: 33.3333 },
      { nilaiKPPN: 33.3333, nilaiKanwil: 66.6667 },
      { nilaiKPPN: 66.6667, nilaiKanwil: 66.6667 }
    );

    expect(result.detailKPPN.pb.kontribusi).toBe(33.3334);
    expect(result.detailKPPN.ck?.kontribusi).toBe(11.6667);
    expect(result.detailKPPN.spml?.kontribusi).toBe(10);
    expect(result.nilaiKPPN).toBe(55);
    expect(result.nilaiKanwil).toBe(50);
  });

  it("requires CK and SPML scores for regulation 2", () => {
    expect(() => calculateAKKScoreFromWorksheetScores(
      2,
      { nilaiKPPN: 100, nilaiKanwil: 100 }
    )).toThrow("CK and SPML scores are required for regulation 2");
  });

  it("rejects unsupported regulations", () => {
    expect(() => calculateAKKScoreFromWorksheetScores(
      3 as 1,
      { nilaiKPPN: 100, nilaiKanwil: 100 }
    )).toThrow("AKK regulation must be 1 or 2");
  });
});

describe("calculateAverageAKKScoreFromUnits", () => {
  const createUnitScore = (
    kppnId: string,
    tipe: "A1" | "A2" | "Kh" | "K1" | "K2" | "K3" | null,
    provinsi: number,
    nilaiKPPN: number,
    nilaiKanwil: number
  ) => ({
    worksheetId: `worksheet-${kppnId}`,
    kppnId,
    name: `KPPN ${kppnId}`,
    alias: kppnId,
    tipe,
    provinsi,
    nilaiKPPN,
    nilaiKanwil,
  });

  it("calculates a regular average for regulation 1", () => {
    const result = calculateAverageAKKScoreFromUnits(1, [
      createUnitScore("010", null, 0, 8, 7),
      createUnitScore("011", null, 0, 6, 5),
    ]);

    expect(result).toMatchObject({
      jumlahKPPN: 2,
      nilaiRataRataKPPN: 7,
      nilaiRataRataKanwil: 6,
      detailKategori: [],
    });
  });

  it("averages each category before applying regulation 2 weights", () => {
    const result = calculateAverageAKKScoreFromUnits(2, [
      createUnitScore("010", "A1", 1, 90, 80),
      createUnitScore("011", "A1", 0, 80, 70),
      createUnitScore("012", "A1", 0, 100, 90),
      createUnitScore("013", "A2", 0, 60, 50),
      createUnitScore("014", "A2", 0, 70, 60),
      createUnitScore("015", "A2", 0, 80, 70),
    ]);

    expect(result.nilaiRataRataKPPN).toBe(86);
    expect(result.nilaiRataRataKanwil).toBe(76);
    expect(result.detailKategori).toEqual([
      {
        kategori: "A1_PROVINSI",
        bobot: 45,
        jumlahKPPN: 1,
        rataRataKPPN: 90,
        rataRataKanwil: 80,
        kontribusiKPPN: 40.5,
        kontribusiKanwil: 36,
      },
      {
        kategori: "A1_NON_PROVINSI",
        bobot: 35,
        jumlahKPPN: 2,
        rataRataKPPN: 90,
        rataRataKanwil: 80,
        kontribusiKPPN: 31.5,
        kontribusiKanwil: 28,
      },
      {
        kategori: "A2",
        bobot: 20,
        jumlahKPPN: 3,
        rataRataKPPN: 70,
        rataRataKanwil: 60,
        kontribusiKPPN: 14,
        kontribusiKanwil: 12,
      },
    ]);
  });

  it("rejects an unsupported KPPN type for regulation 2", () => {
    expect(() => calculateAverageAKKScoreFromUnits(2, [
      createUnitScore("010", "Kh", 0, 100, 100),
    ])).toThrow("unsupported tipe Kh");
  });

  it("rejects regulation 2 when a required category is empty", () => {
    expect(() => calculateAverageAKKScoreFromUnits(2, [
      createUnitScore("010", "A1", 1, 100, 100),
      createUnitScore("011", "A1", 0, 100, 100),
    ])).toThrow("these categories have no KPPN: A2");
  });

  it("rejects invalid provinsi metadata for regulation 2", () => {
    expect(() => calculateAverageAKKScoreFromUnits(2, [
      createUnitScore("010", "A1", 2, 100, 100),
    ])).toThrow("invalid provinsi value");
  });
});

describe("calculateAKKContributorLHPSFromUnits", () => {
  const createUnit = (
    kppnId: string,
    tipe: "A1" | "A2" | null,
    provinsi: number,
    nilaiPB: number,
    nilaiSPML: number,
    nilaiCK: number
  ) => {
    const pbScore: PBScoreResult = {
      peraturan: 2,
      nilaiKPPN: nilaiPB,
      nilaiKanwil: nilaiPB,
      detailKPPN: createPBDetail(),
      detailKanwil: createPBDetail(),
    };

    return {
      worksheetId: `worksheet-${kppnId}`,
      kppnId,
      name: `KPPN ${kppnId}`,
      alias: kppnId,
      tipe,
      provinsi,
      periodName: "2026",
      result: calculateAKKScoreFromWorksheetScores(
      2,
      { nilaiKPPN: nilaiPB, nilaiKanwil: nilaiPB },
      { nilaiKPPN: nilaiCK, nilaiKanwil: nilaiCK },
      { nilaiKPPN: nilaiSPML, nilaiKanwil: nilaiSPML }
      ),
      pbScore,
    };
  };

  const createPBDetail = (withComponent = false) => ({
    jumlahChecklist: 1,
    jumlahChecklistDiisi: 1,
    jumlahNA: 0,
    jumlahChecklistPembagi: 1,
    totalSkorKonversi: 10,
    detailKomponen: withComponent ? [{
      komponenId: 1,
      komponenTitle: "Komponen 1",
      komponenBobot: 100,
      jumlahChecklist: 1,
      jumlahNA: 0,
      jumlahChecklistPembagi: 1,
      totalSkorKonversi: 10,
      nilaiRataRata: 10,
      nilaiTerbobot: 10,
    }] : [],
  });

  it("builds the LHPS table details and weighted category totals", () => {
    const result = calculateAKKContributorLHPSFromUnits(2, [
      createUnit("010", "A1", 1, 100, 100, 100),
      createUnit("011", "A1", 0, 100, 98, 100),
      createUnit("090", "A1", 0, 100, 100, 95),
      createUnit("091", "A2", 0, 90, 85, 100),
      createUnit("077", "A2", 0, 90, 85, 100),
      createUnit("142", "A2", 0, 90, 85, 100),
    ]);

    expect(result.jumlahKPPN).toBe(6);
    expect(result.jumlahBobotKPPNYangMemenuhi).toBe(100);
    expect(result.jumlahNilaiAKKSeluruhKPPN).toBe(98.1913);
    expect(result.nilaiAkhirAspekKinerja).toBe(98.1913);
    expect(result.kelompok.map((group) => group.kategori)).toEqual([
      "A1_PROVINSI",
      "A1_NON_PROVINSI",
      "A2",
    ]);
    expect(result.kelompok[1]).toMatchObject({
      bobot: 35,
      jumlahKPPN: 2,
      rataRataAKK: 98.975,
      kontribusiLHPS: 34.6413,
    });
    expect(result.kelompok[1].kppn[0]).toMatchObject({
      nilaiAKK: 99.7,
      bobotKPPN: 35,
      nilaiPenyumbangLHPS: 34.895,
      pb: { nilai: 100, bobot: 50, kontribusi: 50 },
      spml: { nilai: 98, bobot: 15, kontribusi: 14.7 },
      ck: { nilai: 100, bobot: 35, kontribusi: 35 },
    });
  });

  it("uses a single 100 percent group for regulation 1", () => {
    const units = [8, 6].map((nilai, index) => {
      const pbScore: PBScoreResult = {
        peraturan: 1,
        nilaiKPPN: nilai,
        nilaiKanwil: nilai,
        detailKPPN: createPBDetail(true),
        detailKanwil: createPBDetail(true),
      };
      return {
        worksheetId: `worksheet-${index}`,
        kppnId: `01${index}`,
        name: `KPPN 01${index}`,
        alias: `01${index}`,
        tipe: null,
        provinsi: 0,
        periodName: "2023",
        result: calculateAKKScoreFromWorksheetScores(1, pbScore),
        pbScore,
      };
    });

    const result = calculateAKKContributorLHPSFromUnits(1, units);

    expect(result.kelompok).toHaveLength(1);
    expect(result.kelompok[0]).toMatchObject({
      kategori: "SELURUH_KPPN",
      bobot: 100,
      jumlahKPPN: 2,
      rataRataAKK: 7,
      kontribusiLHPS: 7,
    });
    expect(result.nilaiAkhirAspekKinerja).toBe(7);
    expect(result.totalNilaiKPPN).toBe(14);
    expect(result.jumlahPembagi).toBe(2);
    expect(result.jumlahNilaiAKKSeluruhKPPN).toBe(14);
    expect(result.kelompok[0].kppn[0]).toMatchObject({ ck: null, spml: null });
    expect(result.kelompok[0].kppn[0].detailKomponenPB[0]).toMatchObject({
      komponenId: 1,
      komponenTitle: "Komponen 1",
      nilaiTerbobot: 10,
    });
  });

  it("rejects incomplete regulation 2 categories", () => {
    expect(() => calculateAKKContributorLHPSFromUnits(2, [
      createUnit("010", "A1", 1, 100, 100, 100),
    ])).toThrow("these categories have no KPPN: A1_NON_PROVINSI, A2");
  });
});

describe("calculateSPMLScoreFromRows", () => {
  it("returns 100 when every non-NA checklist has score 10", () => {
    const result = calculateSPMLScoreFromRows([
      { kppn_score: 10, kanwil_score: 10, excluded: 0 },
      { kppn_score: 10, kanwil_score: 10, excluded: 0 },
    ]);

    expect(result.nilaiKPPN).toBe(100);
    expect(result.nilaiKanwil).toBe(100);
  });

  it("rounds the converted average to at most four decimal places", () => {
    const result = calculateSPMLScoreFromRows([
      { kppn_score: 10, kanwil_score: 0, excluded: 0 },
      { kppn_score: 10, kanwil_score: 10, excluded: 0 },
      { kppn_score: 0, kanwil_score: 0, excluded: 0 },
    ]);

    expect(result.nilaiKPPN).toBe(66.6667);
    expect(result.nilaiKanwil).toBe(33.3333);
    expect(result.detailKPPN.totalSkorKonversi).toBe(200);
    expect(result.detailKanwil.totalSkorKonversi).toBe(100);
  });

  it("excludes NA checklists from the score and divisor", () => {
    const result = calculateSPMLScoreFromRows([
      { kppn_score: 10, kanwil_score: 10, excluded: 0 },
      { kppn_score: 0, kanwil_score: 0, excluded: 1 },
    ]);

    expect(result.nilaiKPPN).toBe(100);
    expect(result.detailKPPN).toEqual({
      jumlahChecklist: 2,
      jumlahChecklistDiisi: 2,
      jumlahNA: 1,
      jumlahChecklistPembagi: 1,
      totalSkorKonversi: 100,
    });
    expect(result.detailKanwil).toEqual(result.detailKPPN);
  });

  it("treats a null non-NA score as zero and keeps it in the divisor", () => {
    const result = calculateSPMLScoreFromRows([
      { kppn_score: 10, kanwil_score: null, excluded: 0 },
      { kppn_score: null, kanwil_score: 10, excluded: 0 },
    ]);

    expect(result.nilaiKPPN).toBe(50);
    expect(result.nilaiKanwil).toBe(50);
    expect(result.detailKPPN.jumlahChecklistPembagi).toBe(2);
    expect(result.detailKPPN.jumlahChecklistDiisi).toBe(1);
    expect(result.detailKanwil.jumlahChecklistDiisi).toBe(1);
  });

  it("returns zero when every checklist is NA", () => {
    const result = calculateSPMLScoreFromRows([
      { kppn_score: 10, kanwil_score: 10, excluded: 1 },
      { kppn_score: 0, kanwil_score: 0, excluded: 1 },
    ]);

    expect(result.nilaiKPPN).toBe(0);
    expect(result.nilaiKanwil).toBe(0);
    expect(result.detailKPPN.jumlahChecklistPembagi).toBe(0);
  });
});

describe("calculateAllKPPNSPMLScoresFromRows", () => {
  it("groups ordered junction rows by worksheet and calculates each KPPN score", () => {
    const result = calculateAllKPPNSPMLScoresFromRows([
      {
        worksheet_spml_id: "worksheet-010",
        kppn_id: "010",
        name: "KPPN Padang",
        alias: "Padang",
        kppn_score: 10,
        kanwil_score: 0,
        excluded: 0,
      },
      {
        worksheet_spml_id: "worksheet-010",
        kppn_id: "010",
        name: "KPPN Padang",
        alias: "Padang",
        kppn_score: 0,
        kanwil_score: 10,
        excluded: 0,
      },
      {
        worksheet_spml_id: "worksheet-011",
        kppn_id: "011",
        name: "KPPN Bukittinggi",
        alias: "Bukittinggi",
        kppn_score: 10,
        kanwil_score: 10,
        excluded: 0,
      },
      {
        worksheet_spml_id: "worksheet-011",
        kppn_id: "011",
        name: "KPPN Bukittinggi",
        alias: "Bukittinggi",
        kppn_score: 0,
        kanwil_score: 0,
        excluded: 1,
      },
    ]);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      worksheetSPMLId: "worksheet-010",
      kppnId: "010",
      nilaiKPPN: 50,
      nilaiKanwil: 50,
    });
    expect(result[1]).toMatchObject({
      worksheetSPMLId: "worksheet-011",
      kppnId: "011",
      nilaiKPPN: 100,
      nilaiKanwil: 100,
      detailKPPN: {
        jumlahChecklist: 2,
        jumlahChecklistDiisi: 2,
        jumlahNA: 1,
        jumlahChecklistPembagi: 1,
        totalSkorKonversi: 100,
      },
    });
  });

  it("returns an empty array when the period has no SPML worksheet rows", () => {
    expect(calculateAllKPPNSPMLScoresFromRows([])).toEqual([]);
  });
});

describe("calculateCKScoreFromRows", () => {
  it("converts CK scores to scale 100 and averages every checklist", () => {
    const result = calculateCKScoreFromRows([
      { kppn_score: 10, kanwil_score: 5, excluded: 0 },
      { kppn_score: 5, kanwil_score: 0, excluded: 0 },
      { kppn_score: 0, kanwil_score: 10, excluded: 0 },
    ]);

    expect(result.nilaiKPPN).toBe(50);
    expect(result.nilaiKanwil).toBe(50);
    expect(result.detailKPPN.totalSkorKonversi).toBe(150);
    expect(result.detailKPPN.jumlahChecklistPembagi).toBe(3);
  });

  it("counts NA as 100 and keeps it in the CK divisor", () => {
    const result = calculateCKScoreFromRows([
      { kppn_score: 0, kanwil_score: 0, excluded: 1 },
      { kppn_score: 5, kanwil_score: 0, excluded: 0 },
    ]);

    expect(result.nilaiKPPN).toBe(75);
    expect(result.nilaiKanwil).toBe(50);
    expect(result.detailKPPN).toEqual({
      jumlahChecklist: 2,
      jumlahChecklistDiisi: 2,
      jumlahNA: 1,
      jumlahChecklistPembagi: 2,
      totalSkorKonversi: 150,
    });
    expect(result.detailKanwil.totalSkorKonversi).toBe(100);
  });

  it("treats an unanswered CK checklist as zero but keeps it in the divisor", () => {
    const result = calculateCKScoreFromRows([
      { kppn_score: 10, kanwil_score: null, excluded: 0 },
      { kppn_score: null, kanwil_score: 10, excluded: 0 },
    ]);

    expect(result.nilaiKPPN).toBe(50);
    expect(result.nilaiKanwil).toBe(50);
    expect(result.detailKPPN.jumlahChecklistDiisi).toBe(1);
    expect(result.detailKanwil.jumlahChecklistDiisi).toBe(1);
  });

  it("rounds CK averages to four decimal places", () => {
    const result = calculateCKScoreFromRows([
      { kppn_score: 10, kanwil_score: 5, excluded: 0 },
      { kppn_score: 5, kanwil_score: 5, excluded: 0 },
      { kppn_score: 5, kanwil_score: 0, excluded: 0 },
    ]);

    expect(result.nilaiKPPN).toBe(66.6667);
    expect(result.nilaiKanwil).toBe(33.3333);
  });

  it("returns 100 when every CK checklist is NA", () => {
    const result = calculateCKScoreFromRows([
      { kppn_score: 10, kanwil_score: 10, excluded: 1 },
      { kppn_score: 10, kanwil_score: 10, excluded: 1 },
    ]);

    expect(result.nilaiKPPN).toBe(100);
    expect(result.nilaiKanwil).toBe(100);
    expect(result.detailKPPN.jumlahChecklistPembagi).toBe(2);
  });
});

describe("calculatePBScoreFromRows", () => {
  const rows = [
    {
      kppn_score: 10,
      kanwil_score: 5,
      excluded: 0,
      komponen_id: 1,
      komponen_title: "Komponen A",
      komponen_bobot: 60,
      standardisasi: 0,
    },
    {
      kppn_score: 12,
      kanwil_score: 6,
      excluded: 0,
      komponen_id: 1,
      komponen_title: "Komponen A",
      komponen_bobot: 60,
      standardisasi: 1,
    },
    {
      kppn_score: 5,
      kanwil_score: 10,
      excluded: 0,
      komponen_id: 2,
      komponen_title: "Komponen B",
      komponen_bobot: 40,
      standardisasi: 0,
    },
  ];

  it("uses scale 10, standardization, and component weights for regulation 1", () => {
    const result = calculatePBScoreFromRows(rows, 1);

    expect(result.peraturan).toBe(1);
    expect(result.nilaiKPPN).toBe(8);
    expect(result.nilaiKanwil).toBe(7);
    expect(result.detailKPPN.detailKomponen).toEqual([
      expect.objectContaining({
        komponenId: 1,
        totalSkorKonversi: 20,
        nilaiRataRata: 10,
        nilaiTerbobot: 6,
      }),
      expect.objectContaining({
        komponenId: 2,
        totalSkorKonversi: 5,
        nilaiRataRata: 5,
        nilaiTerbobot: 2,
      }),
    ]);
  });

  it("ignores standardization and component weights for regulation 2", () => {
    const regulation2Rows = rows.map((row, index) =>
      index === 1 ? { ...row, kppn_score: 10, kanwil_score: 5 } : row
    );
    const result = calculatePBScoreFromRows(regulation2Rows, 2);

    expect(result.peraturan).toBe(2);
    expect(result.nilaiKPPN).toBe(83.3333);
    expect(result.nilaiKanwil).toBe(66.6667);
    expect(result.detailKPPN.totalSkorKonversi).toBe(250);
    expect(result.detailKPPN.detailKomponen).toEqual([]);
  });

  it("excludes NA and treats an unanswered non-NA checklist as zero", () => {
    const result = calculatePBScoreFromRows([
      {
        kppn_score: 10,
        kanwil_score: 10,
        excluded: 1,
        komponen_id: 1,
        komponen_title: "Komponen A",
        komponen_bobot: 100,
        standardisasi: 0,
      },
      {
        kppn_score: null,
        kanwil_score: 10,
        excluded: 0,
        komponen_id: 1,
        komponen_title: "Komponen A",
        komponen_bobot: 100,
        standardisasi: 0,
      },
    ], 2);

    expect(result.nilaiKPPN).toBe(0);
    expect(result.nilaiKanwil).toBe(100);
    expect(result.detailKPPN).toMatchObject({
      jumlahChecklist: 2,
      jumlahChecklistDiisi: 1,
      jumlahNA: 1,
      jumlahChecklistPembagi: 1,
      totalSkorKonversi: 0,
    });
  });

  it("returns zero when every PB checklist is NA", () => {
    const allNARows = rows.map((row) => ({ ...row, excluded: 1 }));

    const oldRegulation = calculatePBScoreFromRows(allNARows, 1);
    const newRegulation = calculatePBScoreFromRows(allNARows, 2);

    expect(oldRegulation.nilaiKPPN).toBe(0);
    expect(newRegulation.nilaiKPPN).toBe(0);
    expect(oldRegulation.detailKPPN.jumlahChecklistPembagi).toBe(0);
    expect(newRegulation.detailKPPN.jumlahChecklistPembagi).toBe(0);
  });

  it("rounds regulation 2 averages to four decimal places", () => {
    const result = calculatePBScoreFromRows([
      { ...rows[0], kppn_score: 10 },
      { ...rows[0], kppn_score: 10 },
      { ...rows[0], kppn_score: 0 },
    ], 2);

    expect(result.nilaiKPPN).toBe(66.6667);
  });
});
