/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { MatrixWithWsJunctionType } from "../matrix/types"

export interface FindingsResponseType{
  id: number,
  ws_junction_id: number,
  worksheet_id: string,
  checklist_id: number,
  matrix_id: number, 
  kppn_response: string,
  kanwil_response: string,
  score_before: number,
  score_after: number,
  last_update: string,
  updated_by: string,
  status: number,
  matrixDetail: MatrixWithWsJunctionType[],
};