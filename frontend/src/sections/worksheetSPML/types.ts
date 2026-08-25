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
  id: number;
  title: string | null;
  uraian: string;
  dokumen: string | null;
  komponen_spml_id: number;
  subkomponen_spml_id: number;
  aspek_spml_id: number;
  deleted?: Date | string | null;
}
