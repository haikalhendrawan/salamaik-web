export interface WsSPMLJunctionType {
  junction_id: number;
  worksheet_id: string;
  checklist_spml_id: number;
  kanwil_score: number | null;
  kppn_score: number | null;
  file_1: string | null;
  kppn_id: string | null;
  last_update: string | null;
  updated_by: string | null;
  excluded: number;
  link_file: string | null;
  kanwil_note: string | null;
  comment_count: number;
  id: number;
  title: string | null;
  uraian: string;
  dokumen: string | null;
  komponen_spml_id: number;
  subkomponen_spml_id: number;
  aspek_spml_id: number;
  deleted?: Date | string | null;
}

export interface SPMLScoreDetail {
  jumlahChecklist: number;
  jumlahChecklistDiisi: number;
  jumlahNA: number;
  jumlahChecklistPembagi: number;
  totalSkorKonversi: number;
}

export interface SPMLScoreType {
  nilaiKPPN: number;
  nilaiKanwil: number;
  detailKPPN: SPMLScoreDetail;
  detailKanwil: SPMLScoreDetail;
}

export interface AllKPPNSPMLScoreType extends SPMLScoreType {
  worksheetSPMLId: string;
  kppnId: string;
  name: string;
  alias: string;
}

export type SPMLChangeType =
  | 'score'
  | 'note'
  | 'link'
  | 'file-upload'
  | 'file-delete'
  | 'comment-add'
  | 'comment-delete';

export interface SPMLWorksheetChangedEvent {
  worksheetId: string;
  junctionId: number;
  changeType: SPMLChangeType;
  changedBy?: string;
  timestamp: string;
}

export interface SPMLSyncTarget {
  junctionId: number;
  changeType: SPMLChangeType;
}

export interface WsSPMLRefreshOptions {
  showOverlay?: boolean;
  refreshScore?: boolean;
  syncTargets?: SPMLSyncTarget[];
}
