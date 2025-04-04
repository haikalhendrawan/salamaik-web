export interface WorksheetJunctionType{
  junction_id: number,
  worksheet_id: string,
  checklist_id: number,
  kanwil_score: number | null,
  kppn_score: number | null,
  file_1: string | null,
  file_2: string | null,
  file_3: string | null,
  kanwil_note: string | null,
  kppn_id: string,
  period: string,
  last_update: string | null,
  updated_by: string | null,
  excluded: number
};