import { WsJunctionType } from "../worksheet/types"

interface ScorePerKomponenType{
  komponenId: number,
  komponenTitle: string,
  komponenBobot: number,
  wsJunction: WsJunctionType[],
}
export interface WsJunctionScoreAndProgress{
  scoreByKanwil : number,
  scoreByKPPN: number,
  isFinal: boolean,
  totalChecklist: number,
  totalProgressKanwil: number,
  totalProgressKPPN: number,
  scorePerKomponen: ScorePerKomponenType[],
}
export interface KPPNScoreProgressResponseType{
  id: string;
  name: string;
  alias: string;
  kk_name: string;
  kk_nip: string;
  info: string;
  col_order: number;
  level: number;
  scoreProgressDetail: WsJunctionScoreAndProgress
}

export interface HistoricalScoreProgressType{
  id: number;
  name: string; 
  even_period: 0;
  semester: number;
  tahun: number;
  kppn: KPPNScoreProgressResponseType[]
};