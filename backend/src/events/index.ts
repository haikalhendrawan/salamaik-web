/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import {Socket} from "socket.io";
import disconnectEventListener from "./disconnect";
import worksheetEventListener from "./worksheetEvent";

const connectEvent = (socket: Socket) => {
  console.log("client is connected", socket.id);
  worksheetEventListener(socket);
  disconnectEventListener(socket);
};

export default connectEvent