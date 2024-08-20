import { KomponenWithSubKomponen } from "model/komponen.model";
import { WsJunctionWithKomponenType } from "model/worksheetJunction.model";
// -------------------------------------------------------------------------------------------------------------------------------------------------

export function getScoreForMatrix(komponenAll: KomponenWithSubKomponen[], wsJunctionDetail: WsJunctionWithKomponenType[], isKanwil: boolean){ 
  return komponenAll?.map((item) => {
    const totalNilai = (wsJunctionDetail
                          ?.filter((ws) => (ws?.checklist[0]?.komponen_id === item.id) && (ws.excluded !== 1))
                          .reduce((acc, item) => {
                            const scoreToGet = isKanwil? (item?.kanwil_score || 0) : (item?.kppn_score || 0);
                            const isStandardisasi = item.checklist[0]?.standardisasi === 1;
                            const score = (isStandardisasi ? (scoreToGet/12) : (scoreToGet/10)) * 10;
                            return acc+(score || 0)
                          }, 0));
    const bilanganPembagi = wsJunctionDetail.filter((ws) =>(ws?.checklist[0]?.komponen_id === item.id) && (ws.excluded !== 1)).length;
    const avgPerKomponen = totalNilai/bilanganPembagi;
    const weightedScore = avgPerKomponen*(item.bobot/100);

    return{
      komponenId: item.id,
      komponenTitle: item.title,
      komponenBobot: item.bobot,
      totalNilai,
      bilanganPembagi,
      avgPerKomponen,
      weightedScore,
      wsJunction: wsJunctionDetail.filter((ws) => ws?.checklist[0]?.komponen_id === item.id),
    }

  })
}