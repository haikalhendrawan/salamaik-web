import { WorksheetType } from "./worksheet.type";
import { WorksheetJunctionType } from "./wsJunction.type";
import { ChecklistType } from "./checklist.type";
import { MatrixType } from "./matrix.type";
import { KomponenType, SubKomponenType } from "./komponen.type";
import { OpsiType } from "./opsi.type";

export interface DerivedFindingsType {
  id: number,
  ws_junction_id: number,
  worksheet_id: string,
  checklist_id: number,
  matrix_id: number, 
  kppn_reponse: string,
  kanwil_response: string,
  score_before: number,
  score_after: number,
  last_update: string,
  status: number,
  updated_by: string,
  worksheet: WorksheetType,
  ws_junction: WorksheetJunctionType,
  checklist: ChecklistType,
  matrix: MatrixType,
  komponen: KomponenType,
  subkomponen: SubKomponenType,
  opsi: OpsiType[] | null
}