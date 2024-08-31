import { WsJunctionType } from "../worksheet/types";
import { ChecklistType } from "../admin/worksheetRef/ChecklistRef/useChecklist";
import { OpsiType } from "../worksheet/types";

export interface MatrixType{
  id: number,
  ws_junction_id: number,
  worksheet_id: string,
  checklist_id: number,
  hasil_implementasi: string,
  permasalahan: string, 
  rekomendasi: string,
  peraturan: string,
  uic: string,
  tindak_lanjut: string, 
  is_finding: number
};

export interface MatrixBodyType{
  id?: number,
  worksheetId: string,
  wsJunctionId: number,
  checklistId: number,
  hasilImplementasi: string | null,
  rekomendasi: string | null,
  permasalahan: string | null, 
  peraturan: string | null,
  uic: string | null,
  tindakLanjut: string | null, 
  isFinding: number
}

interface FindingsType{
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
  updated_by: string,
  status: number
};

export interface MatrixWithWsJunctionType{
  id: number,
  worksheet_id: string,
  ws_junction_id: number,
  checklist_id: number,
  hasil_implementasi: string | null,
  permasalahan: string | null,
  rekomendasi: string | null,
  peraturan: string | null,
  uic: string | null,
  tindak_lanjut: string | null,
  is_finding: number,
  komponen_string: string | null,
  subkomponen_string: string | null,
  standardisasi?: number,
  standardisasi_id?: number | null,
  ws_junction: WsJunctionType[],
  checklist: ChecklistType[],
  findings: FindingsType[],
  opsi: OpsiType[]
}

interface ScorePerKomponenType{
  komponenId: number,
  komponenTitle: string,
  komponenBobot: number,
  totalNilai: number,
  bilanganPembagi: number,
  avgPerKomponen: number,
  weightedScore: number,
  wsJunction: WsJunctionType[],
}

export interface MatrixScoreAndProgressType{
  scoreByKanwil : number,
  scoreByKPPN: number,
  isFinal: boolean,
  totalChecklist: number,
  totalProgressKanwil: number,
  totalProgressKPPN: number,
  scorePerKomponen: ScorePerKomponenType[],
  scorePerKomponenKPPN: ScorePerKomponenType[],
}
