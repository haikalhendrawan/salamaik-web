export type SPMLChangeType =
  | "score"
  | "link"
  | "file-upload"
  | "file-delete"
  | "comment-add"
  | "comment-delete";

export interface SPMLWorksheetChangedEvent {
  worksheetId: string;
  junctionId: number;
  changeType: SPMLChangeType;
  changedBy?: string;
  timestamp: string;
}

export const getSPMLWorksheetRoom = (worksheetId: string) =>
  `spml:worksheet:${worksheetId}`;

export const createSPMLChangedEvent = (
  worksheetId: string,
  junctionId: number,
  changeType: SPMLChangeType,
  changedBy?: string
): SPMLWorksheetChangedEvent => ({
  worksheetId,
  junctionId,
  changeType,
  changedBy,
  timestamp: new Date().toISOString(),
});
