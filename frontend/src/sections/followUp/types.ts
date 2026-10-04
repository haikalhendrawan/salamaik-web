/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { MatrixWithWsJunctionType } from "../matrix/types"
import { WorksheetType } from "../worksheet/types";

export interface FindingsResponseType{
  id: number,
  ws_junction_id: number,
  worksheet_id: string,
  checklist_id: number,
  matrix_id: number | null,
  matrix_peraturan_2_id?: number | null,
  worksheet_type?: 'PB' | 'CK' | 'SPML',
  worksheet?: WorksheetType,
  finding_description?: string | null,
  rekomendasi_snapshot?: string | null,
  peraturan_snapshot?: string | null,
  uic_snapshot?: string | null,
  follow_up_file?: string | null,
  follow_up_link_file?: string | null,
  kppn_response: string,
  kanwil_response: string,
  score_before: number,
  score_after: number,
  last_update: string,
  updated_by: string,
  status: number,
  matrixDetail: MatrixWithWsJunctionType[],
};
