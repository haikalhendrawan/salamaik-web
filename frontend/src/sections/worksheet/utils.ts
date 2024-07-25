import { WsJunctionType  } from "./types";

export function filterKomponen(wsJunction: WsJunctionType, komponenId: number){
  return wsJunction?.komponen_id===komponenId
}

export function filterSubkomponen(wsJunction?: WsJunctionType[], subkomponenId?: number){
  return wsJunction?.filter(item => item.subkomponen_id===subkomponenId)
}