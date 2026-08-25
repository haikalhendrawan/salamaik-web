/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import {Socket} from "socket.io";
import disconnectEventListener from "./disconnect";
import worksheetEventListener from "./worksheetEvent";
import wsSPMLJunctionEventListener from "./wsSPMLJunctionEvent";

const connectEvent = (socket: Socket) => {
  console.log("client is connected", socket.id);
  worksheetEventListener(socket);
  wsSPMLJunctionEventListener(socket);
  disconnectEventListener(socket);
};

export default connectEvent
