export interface WorksheetType{
  id: string, 
  kppn_id: string,
  name: string, 
  alias: string,
  period: number,
  status: number,
  open_period: string,
  close_period: string,
  created_at: string,
  updated_at: string,
  matrix_status: number,
  open_follow_up: string,
  close_follow_up: string
}