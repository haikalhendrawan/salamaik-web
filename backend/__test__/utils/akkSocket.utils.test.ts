import {
  canAccessAKKWorksheet,
  createAKKScoreChangedEvent,
  getAKKWorksheetRoom,
} from "../../src/utils/akkSocket.utils";

describe("AKK socket utilities", () => {
  it("allows Kanwil roles to access every KPPN worksheet", () => {
    [3, 4, 99].forEach((role) => {
      expect(canAccessAKKWorksheet(role, "KANWIL", "010")).toBe(true);
    });
  });

  it("restricts KPPN roles to their own worksheet", () => {
    expect(canAccessAKKWorksheet(1, "010", "010")).toBe(true);
    expect(canAccessAKKWorksheet(2, "010", "011")).toBe(false);
  });

  it("creates a worksheet-scoped score event", () => {
    const event = createAKKScoreChangedEvent("worksheet-1", "spml", "tester");

    expect(getAKKWorksheetRoom("worksheet-1")).toBe("akk:worksheet:worksheet-1");
    expect(event).toMatchObject({
      worksheetId: "worksheet-1",
      source: "spml",
      changedBy: "tester",
    });
    expect(Number.isNaN(Date.parse(event.timestamp))).toBe(false);
  });
});
