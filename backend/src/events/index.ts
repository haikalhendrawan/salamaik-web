import {Socket} from "socket.io";
import disconnectEvent from "./disconnect";
import worksheetEvent from "./worksheetEvent";
import worksheet from "model/worksheet.model";

const connectEvent = (socket: Socket) => {
  console.log("client is connected", socket.id);
  socket.on("getWorksheetJunction", worksheetEvent.getWorksheetJunction);
  socket.on("updateKanwilScore", worksheetEvent.updateKanwilScore);
  socket.on("updateKPPNScore", worksheetEvent.updateKPPNScore);
  socket.on("updateKanwilNote", worksheetEvent.updateKanwilNote);
  socket.on("deleteWsJunctionFile", worksheetEvent.deleteWsJunctionFile);
  disconnectEvent(socket);
};

export default connectEvent