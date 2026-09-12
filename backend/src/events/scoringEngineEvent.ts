import { Socket } from "socket.io";
import worksheet from "../model/worksheet.model";
import { socketError } from "../model/error.model";
import logger from "../config/logger";
import {
  canAccessAKKWorksheet,
  getAKKWorksheetRoom,
} from "../utils/akkSocket.utils";

type SocketCallback = (response: {
  success: boolean;
  message: string | object;
}) => void;

class ScoringEngineEvent {
  async joinWorksheet(socket: Socket, worksheetId: string, callback: SocketCallback) {
    try {
      if (typeof worksheetId !== "string" || !worksheetId.trim()) {
        return socketError(callback, "AKK worksheet ID is required");
      }

      const worksheetRows = await worksheet.getById(worksheetId);
      const selectedWorksheet = worksheetRows[0];
      if (!selectedWorksheet) {
        return socketError(callback, "AKK worksheet not found");
      }
      if (!canAccessAKKWorksheet(
        socket.data.payload.role,
        socket.data.payload.kppn,
        selectedWorksheet.kppn_id
      )) {
        return socketError(callback, "Not authorized to access this AKK worksheet");
      }

      await socket.join(getAKKWorksheetRoom(worksheetId));
      return callback({ success: true, message: "Joined AKK worksheet room" });
    } catch (error: unknown) {
      logger.error(error);
      return socketError(
        callback,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  async leaveWorksheet(socket: Socket, worksheetId: string, callback?: SocketCallback) {
    if (typeof worksheetId === "string" && worksheetId.trim()) {
      await socket.leave(getAKKWorksheetRoom(worksheetId));
    }
    callback?.({ success: true, message: "Left AKK worksheet room" });
  }
}

const scoringEngineEvent = new ScoringEngineEvent();

export default function scoringEngineEventListener(socket: Socket) {
  socket.on("joinAKKWorksheet", (worksheetId, callback) =>
    scoringEngineEvent.joinWorksheet(socket, worksheetId, callback)
  );
  socket.on("leaveAKKWorksheet", (worksheetId, callback) =>
    scoringEngineEvent.leaveWorksheet(socket, worksheetId, callback)
  );
}
