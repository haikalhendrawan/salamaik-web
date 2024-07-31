import {Socket} from "socket.io";
import disconnectEvent from "./disconnect";
import worksheetEvent from "./worksheetEvent";
import worksheet from "model/worksheet.model";

const connectEvent = (socket: Socket) => {
  console.log("client is connected", socket.id);
  worksheetEvent.getWorksheetJunction(socket);
  worksheetEvent.updateKanwilScore(socket);
  worksheetEvent.updateKPPNScore(socket);
  disconnectEvent(socket);
};

export default connectEvent