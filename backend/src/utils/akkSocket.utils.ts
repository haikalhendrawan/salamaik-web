export type AKKScoreSource = "pb" | "spml" | "ck";

export const AKK_KANWIL_ROLES = [99, 4, 3];

export const canAccessAKKWorksheet = (
  requesterRole: number,
  requesterKppn: string | undefined,
  worksheetKppn: string
) => AKK_KANWIL_ROLES.includes(requesterRole) || requesterKppn === worksheetKppn;

export interface AKKScoreChangedEvent {
  worksheetId: string;
  source: AKKScoreSource;
  changedBy?: string;
  timestamp: string;
}

export const getAKKWorksheetRoom = (worksheetId: string) =>
  `akk:worksheet:${worksheetId}`;

export const createAKKScoreChangedEvent = (
  worksheetId: string,
  source: AKKScoreSource,
  changedBy?: string
): AKKScoreChangedEvent => ({
  worksheetId,
  source,
  changedBy,
  timestamp: new Date().toISOString(),
});
