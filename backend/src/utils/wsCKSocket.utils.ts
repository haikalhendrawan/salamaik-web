export type CKChangeType =
  | 'score'
  | 'note'
  | 'link'
  | 'file-upload'
  | 'file-delete'
  | 'comment-add'
  | 'comment-delete';

export interface CKWorksheetChangedEvent {
  worksheetId: string;
  junctionId: number;
  changeType: CKChangeType;
  changedBy?: string;
  timestamp: string;
}

export const KANWIL_ROLES = [99, 4, 3];
export const KPPN_SCORE_ROLES = [99, 4, 2, 1];
export const ALL_WORKSHEET_ROLES = [99, 4, 3, 2, 1];

export const canAccessCKWorksheet = (
  requesterRole: number,
  requesterKppn: string | undefined,
  worksheetKppn: string
) => KANWIL_ROLES.includes(requesterRole) || requesterKppn === worksheetKppn;

export const getCKWorksheetRoom = (worksheetId: string) => `ck:worksheet:${worksheetId}`;

export const createCKChangedEvent = (
  worksheetId: string,
  junctionId: number,
  changeType: CKChangeType,
  changedBy?: string
): CKWorksheetChangedEvent => ({
  worksheetId,
  junctionId,
  changeType,
  changedBy,
  timestamp: new Date().toISOString(),
});
