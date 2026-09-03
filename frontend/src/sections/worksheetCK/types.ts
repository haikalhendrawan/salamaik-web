export type CKScoreValue = 0 | 5 | 10;

export interface OpsiCKType {
  id: number;
  checklist_ck_id: number;
  label: string;
  description: string | null;
  value: CKScoreValue;
  urut: number;
}

export interface WsCKJunctionType {
  junction_id: number;
  worksheet_id: string;
  checklist_ck_id: number;
  kppn_score: CKScoreValue | null;
  kanwil_score: CKScoreValue | null;
  excluded: number;
  file_1: string | null;
  link_file: string | null;
  kppn_note: string | null;
  kanwil_note: string | null;
  last_update: string | null;
  updated_by: string | null;
  created_at: string;
  kppn_id: string;
  period: number;
  open_period: string;
  close_period: string;
  checklist_urut: number;
  materi: string;
  kriteria_penilaian: string;
  bukti_dukung: string | null;
  komponen_ck_id: number;
  komponen_urut: string;
  komponen_title: string;
  komponen_alias: string | null;
  komponen_detail: string | null;
  opsi: OpsiCKType[];
  comment_count: number;
}

export interface CKProgressType {
  worksheetCKId: string;
  kppnId: string;
  name: string;
  alias: string;
  jumlahChecklist: number;
  jumlahChecklistDiisiKPPN: number;
  jumlahChecklistDiisiKanwil: number;
}

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

export interface CKSyncTarget {
  junctionId: number;
  changeType: CKChangeType;
}

export interface WsCKRefreshOptions {
  showOverlay?: boolean;
  syncTargets?: CKSyncTarget[];
}
