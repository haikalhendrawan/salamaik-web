import { calculateSPMLScoreFromRows } from "../../src/model/scoringEngine.model";

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
