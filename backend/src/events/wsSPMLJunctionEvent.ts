/**
 * Salamaik API
 * © Kanwil DJPb Sumbar 2026
 */

import fs from "fs";
import path from "path";
import { Socket } from "socket.io";
import activity from "../model/activity.model";
import { socketError } from "../model/error.model";
import wsSPMLJunction from "../model/wsSPMLJunction.model";
import logger from "../config/logger";
import nonBlockingCall from "../utils/nonBlockingCall";
import {
  createSPMLChangedEvent,
  getSPMLWorksheetRoom,
} from "../utils/wsSPMLSocket.utils";

type SocketCallback = (response: {
  success: boolean;
  rows?: unknown;
  message: string | object;
}) => void;

interface KanwilScoreEventData {
  worksheetId: string;
  junctionId: number;
  kanwilScore: number;
  excluded: number;
}

interface KPPNScoreEventData {
  worksheetId: string;
  junctionId: number;
  kppnScore: number;
  excluded: number;
}

interface LinkFileEventData {
  worksheetId: string;
  junctionId: number;
  linkFile: string;
}

interface DeleteFileEventData {
  junctionId?: number;
  id?: number;
  fileName: string;
}

const isValidSPMLScore = (score: number) =>
  Number.isFinite(score) && (score === 0 || score === 10);

const isValidExcluded = (excluded: number) => excluded === 0 || excluded === 1;

const canAccessJunction = (requesterKppn: string | undefined, junctionKppn: string | null) =>
  requesterKppn?.length === 5 || requesterKppn === junctionKppn;

class WsSPMLJunctionEvent {
  async joinWorksheet(socket: Socket, worksheetId: string, callback: SocketCallback) {
    try {
      if (typeof worksheetId !== "string" || !worksheetId.trim()) {
        return socketError(callback, "SPML worksheet ID is required");
      }

      const junctions = await wsSPMLJunction.getWsSPMLJunctionByWorksheetId(worksheetId);
      const junction = junctions[0];
      if (!junction) {
        return socketError(callback, "SPML worksheet not found");
      }
      if (!canAccessJunction(socket.data.payload.kppn, junction.kppn_id)) {
        return socketError(callback, "Not authorized to access this SPML worksheet");
      }

      await socket.join(getSPMLWorksheetRoom(worksheetId));
      return callback({ success: true, message: "Joined SPML worksheet room" });
    } catch (err: unknown) {
      logger.error(err);
      return socketError(callback, err instanceof Error ? err.message : "Unknown error");
    }
  }

  async leaveWorksheet(socket: Socket, worksheetId: string, callback?: SocketCallback) {
    if (typeof worksheetId === "string" && worksheetId.trim()) {
      await socket.leave(getSPMLWorksheetRoom(worksheetId));
    }
    callback?.({ success: true, message: "Left SPML worksheet room" });
  }

  async updateKanwilScore(
    socket: Socket,
    data: KanwilScoreEventData,
    callback: SocketCallback
  ) {
    try {
      const { name, username } = socket.data.payload;
      const { worksheetId, junctionId, kanwilScore, excluded } = data;

      if (!isValidSPMLScore(kanwilScore)) {
        return socketError(callback, "SPML score must be 0 or 10");
      }

      if (!isValidExcluded(excluded)) {
        return socketError(callback, "SPML excluded must be 0 or 1");
      }

      const junction = await wsSPMLJunction.getWsSPMLJunctionByJunctionId(junctionId);
      if (!junction || junction.worksheet_id !== worksheetId) {
        return socketError(callback, "SPML worksheet junction not found");
      }
      if (!canAccessJunction(socket.data.payload.kppn, junction.kppn_id)) {
        return socketError(callback, "Not authorized to update this SPML worksheet");
      }

      const result = await wsSPMLJunction.editWsSPMLJunctionKanwilScore(
        junctionId,
        worksheetId,
        kanwilScore,
        excluded,
        name
      );

      if (result.length === 0) {
        return socketError(callback, "SPML worksheet junction not found");
      }

      const room = getSPMLWorksheetRoom(worksheetId);
      socket.to(room).emit("spmlKanwilScoreHasUpdated", {
        worksheetId,
        junctionId,
        kanwilScore,
        excluded,
      });
      socket.to(room).emit(
        "spmlWorksheetChanged",
        createSPMLChangedEvent(worksheetId, junctionId, "score", username)
      );

      nonBlockingCall(
        activity.createActivity(
          username,
          85,
          socket.handshake.address,
          `SPML junctionId: ${junctionId}, kanwilScore: ${kanwilScore}, excluded: ${excluded}`
        )
      );

      return callback({ success: true, rows: result, message: "Nilai Kanwil SPML has been updated" });
    } catch (err: unknown) {
      logger.error(err);
      return socketError(callback, err instanceof Error ? err.message : "Unknown error");
    }
  }

  async updateKPPNScore(
    socket: Socket,
    data: KPPNScoreEventData,
    callback: SocketCallback
  ) {
    try {
      const { name, username } = socket.data.payload;
      const { worksheetId, junctionId, kppnScore, excluded } = data;

      if (!isValidSPMLScore(kppnScore)) {
        return socketError(callback, "SPML score must be 0 or 10");
      }

      if (!isValidExcluded(excluded)) {
        return socketError(callback, "SPML excluded must be 0 or 1");
      }

      const junction = await wsSPMLJunction.getWsSPMLJunctionByJunctionId(junctionId);
      if (!junction || junction.worksheet_id !== worksheetId) {
        return socketError(callback, "SPML worksheet junction not found");
      }
      if (!canAccessJunction(socket.data.payload.kppn, junction.kppn_id)) {
        return socketError(callback, "Not authorized to update this SPML worksheet");
      }

      const result = await wsSPMLJunction.editWsSPMLJunctionKPPNScore(
        junctionId,
        worksheetId,
        kppnScore,
        excluded,
        name
      );

      if (result.length === 0) {
        return socketError(callback, "SPML worksheet junction not found");
      }

      const room = getSPMLWorksheetRoom(worksheetId);
      socket.to(room).emit("spmlKPPNScoreHasUpdated", {
        worksheetId,
        junctionId,
        kppnScore,
        excluded,
      });
      socket.to(room).emit(
        "spmlWorksheetChanged",
        createSPMLChangedEvent(worksheetId, junctionId, "score", username)
      );

      nonBlockingCall(
        activity.createActivity(
          username,
          91,
          socket.handshake.address,
          `SPML junctionId: ${junctionId}, kppnScore: ${kppnScore}, excluded: ${excluded}`
        )
      );

      return callback({ success: true, rows: result, message: "Nilai KPPN SPML has been updated" });
    } catch (err: unknown) {
      logger.error(err);
      return socketError(callback, err instanceof Error ? err.message : "Unknown error");
    }
  }

  async updateLinkFile(
    socket: Socket,
    data: LinkFileEventData,
    callback: SocketCallback
  ) {
    try {
      const { name, username } = socket.data.payload;
      const { worksheetId, junctionId, linkFile } = data;

      if (
        typeof worksheetId !== "string" ||
        !Number.isInteger(junctionId) ||
        typeof linkFile !== "string" ||
        linkFile.length > 2048
      ) {
        return socketError(callback, "Invalid SPML link file data");
      }

      const normalizedLinkFile = linkFile.trim();

      const junction = await wsSPMLJunction.getWsSPMLJunctionByJunctionId(junctionId);
      if (!junction || junction.worksheet_id !== worksheetId) {
        return socketError(callback, "SPML worksheet junction not found");
      }

      if (!canAccessJunction(socket.data.payload.kppn, junction.kppn_id)) {
        return socketError(callback, "Not authorized to update this SPML worksheet");
      }

      const result = await wsSPMLJunction.editWsSPMLJunctionLinkFile(
        junctionId,
        worksheetId,
        normalizedLinkFile,
        name
      );

      if (!result) {
        return socketError(callback, "SPML worksheet junction not found");
      }

      const room = getSPMLWorksheetRoom(worksheetId);
      socket.to(room).emit("spmlLinkFileHasUpdated", {
        worksheetId,
        junctionId,
        linkFile: normalizedLinkFile,
      });
      socket.to(room).emit(
        "spmlWorksheetChanged",
        createSPMLChangedEvent(worksheetId, junctionId, "link", username)
      );

      nonBlockingCall(
        activity.createActivity(
          username,
          87,
          socket.handshake.address,
          `SPML worksheetId: ${worksheetId}, junctionId: ${junctionId}, linkFile: ${normalizedLinkFile}`
        )
      );

      return callback({ success: true, rows: result, message: "Link bukti dukung SPML has been updated" });
    } catch (err: unknown) {
      logger.error(err);
      return socketError(callback, err instanceof Error ? err.message : "Unknown error");
    }
  }

  async deleteFile(
    socket: Socket,
    data: DeleteFileEventData,
    callback: SocketCallback
  ) {
    try {
      const { name, username } = socket.data.payload;
      const junctionId = data.junctionId ?? data.id;
      const { fileName } = data;

      if (!junctionId) {
        return socketError(callback, "SPML junction ID is required");
      }
      if (typeof fileName !== "string" || !fileName) {
        return socketError(callback, "SPML file name is required");
      }
      const junction = await wsSPMLJunction.getWsSPMLJunctionByJunctionId(junctionId);
      const safeFileName = path.basename(fileName);

      if (!junction || !junction.file_1 || junction.file_1 !== safeFileName) {
        return socketError(callback, "SPML file not found");
      }

      if (!canAccessJunction(socket.data.payload.kppn, junction.kppn_id)) {
        return socketError(callback, "Not authorized to update this SPML worksheet");
      }

      const result = await wsSPMLJunction.deleteWsSPMLJunctionFile(junctionId, name);
      const filePath = path.join(__dirname, "../uploads/worksheet", safeFileName);

      try {
        await fs.promises.unlink(filePath);
      } catch (err: unknown) {
        if (!(err instanceof Error && "code" in err && err.code === "ENOENT")) {
          throw err;
        }
      }

      const room = getSPMLWorksheetRoom(junction.worksheet_id);
      socket.to(room).emit("wsSPMLJunctionFileHasDeleted", {
        junctionId,
        fileName: safeFileName,
      });
      socket.to(room).emit(
        "spmlWorksheetChanged",
        createSPMLChangedEvent(junction.worksheet_id, junctionId, "file-delete", username)
      );

      nonBlockingCall(
        activity.createActivity(
          username,
          89,
          socket.handshake.address,
          `SPML junctionId: ${junctionId}, fileName: ${safeFileName}`
        )
      );

      return callback({ success: true, rows: result, message: "SPML file deleted successfully" });
    } catch (err: unknown) {
      logger.error(err);
      return socketError(callback, err instanceof Error ? err.message : "Unknown error");
    }
  }
}

const wsSPMLEvent = new WsSPMLJunctionEvent();

export default function wsSPMLJunctionEventListener(socket: Socket) {
  socket.on("joinSPMLWorksheet", (worksheetId, callback) =>
    wsSPMLEvent.joinWorksheet(socket, worksheetId, callback)
  );
  socket.on("leaveSPMLWorksheet", (worksheetId, callback) =>
    wsSPMLEvent.leaveWorksheet(socket, worksheetId, callback)
  );
  socket.on("updateSPMLKanwilScore", (data, callback) =>
    wsSPMLEvent.updateKanwilScore(socket, data, callback)
  );
  socket.on("updateSPMLKPPNScore", (data, callback) =>
    wsSPMLEvent.updateKPPNScore(socket, data, callback)
  );
  socket.on("updateSPMLLinkFile", (data, callback) =>
    wsSPMLEvent.updateLinkFile(socket, data, callback)
  );
  socket.on("deleteWsSPMLJunctionFile", (data, callback) =>
    wsSPMLEvent.deleteFile(socket, data, callback)
  );
}
