/**
 * Salamaik API
 * Live mutations for Worksheet CK
 */

import fs from 'fs';
import path from 'path';
import { Socket } from 'socket.io';
import activity from '../model/activity.model';
import { CkScoreValue } from '../model/ckRef.model';
import { socketError } from '../model/error.model';
import wsCKJunction, { WsCKJunctionWithDetailType } from '../model/wsCKJunction.model';
import logger from '../config/logger';
import nonBlockingCall from '../utils/nonBlockingCall';
import {
  ALL_WORKSHEET_ROLES,
  canAccessCKWorksheet,
  createCKChangedEvent,
  getCKWorksheetRoom,
  KANWIL_ROLES,
  KPPN_SCORE_ROLES,
} from '../utils/wsCKSocket.utils';

type SocketCallback = (response: {
  success: boolean;
  rows?: unknown;
  message: string | object;
}) => void;

interface ScoreEventData {
  worksheetId: string;
  junctionId: number;
  kppnScore?: number;
  kanwilScore?: number;
  excluded: number;
}

interface NoteEventData {
  worksheetId: string;
  junctionId: number;
  kppnNote?: string;
  kanwilNote?: string;
}

interface LinkFileEventData {
  worksheetId: string;
  junctionId: number;
  linkFile: string;
}

interface DeleteFileEventData {
  worksheetId: string;
  junctionId: number;
  fileName: string;
}

const isValidScore = (score: number): score is CkScoreValue =>
  Number.isFinite(score) && (score === 0 || score === 5 || score === 10);

const isValidExcluded = (excluded: number): excluded is 0 | 1 =>
  excluded === 0 || excluded === 1;

class WsCKJunctionEvent {
  private async getAccessibleJunction(
    socket: Socket,
    worksheetId: string,
    junctionId: number
  ): Promise<WsCKJunctionWithDetailType | undefined> {
    if (
      typeof worksheetId !== 'string' ||
      !worksheetId.trim() ||
      !Number.isInteger(junctionId) ||
      junctionId <= 0
    ) {
      return undefined;
    }

    const junction = await wsCKJunction.getByJunctionId(junctionId);
    if (!junction || junction.worksheet_id !== worksheetId) return undefined;

    const { role, kppn } = socket.data.payload;
    return canAccessCKWorksheet(role, kppn, junction.kppn_id) ? junction : undefined;
  }

  async joinWorksheet(socket: Socket, worksheetId: string, callback: SocketCallback) {
    try {
      if (typeof worksheetId !== 'string' || !worksheetId.trim()) {
        return socketError(callback, 'CK worksheet ID is required');
      }

      const junctions = await wsCKJunction.getByWorksheetId(worksheetId);
      const junction = junctions[0];
      if (!junction) return socketError(callback, 'CK worksheet not found');
      if (
        !canAccessCKWorksheet(
          socket.data.payload.role,
          socket.data.payload.kppn,
          junction.kppn_id
        )
      ) {
        return socketError(callback, 'Not authorized to access this CK worksheet');
      }

      await socket.join(getCKWorksheetRoom(worksheetId));
      return callback({ success: true, message: 'Joined CK worksheet room' });
    } catch (error: unknown) {
      logger.error(error);
      return socketError(callback, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async leaveWorksheet(socket: Socket, worksheetId: string, callback?: SocketCallback) {
    if (typeof worksheetId === 'string' && worksheetId.trim()) {
      await socket.leave(getCKWorksheetRoom(worksheetId));
    }
    callback?.({ success: true, message: 'Left CK worksheet room' });
  }

  async updateScore(
    socket: Socket,
    data: ScoreEventData,
    scoreOwner: 'kppn' | 'kanwil',
    callback: SocketCallback
  ) {
    try {
      const { worksheetId, junctionId, excluded } = data;
      const score = scoreOwner === 'kppn' ? data.kppnScore : data.kanwilScore;
      const allowedRoles = scoreOwner === 'kppn' ? KPPN_SCORE_ROLES : KANWIL_ROLES;

      if (!allowedRoles.includes(socket.data.payload.role)) {
        return socketError(callback, `Not authorized to update CK ${scoreOwner} score`);
      }
      if (typeof score !== 'number' || !isValidScore(score)) {
        return socketError(callback, 'CK score must be 0, 5, or 10');
      }
      if (!isValidExcluded(excluded)) {
        return socketError(callback, 'CK excluded must be 0 or 1');
      }

      const junction = await this.getAccessibleJunction(socket, worksheetId, junctionId);
      if (!junction) return socketError(callback, 'CK worksheet junction not found or inaccessible');
      if (excluded === 0 && !junction.opsi.some((option) => option.value === score)) {
        return socketError(callback, 'Nilai tidak tersedia pada opsi checklist CK');
      }

      const updatedBy = socket.data.payload.name;
      const result =
        scoreOwner === 'kppn'
          ? await wsCKJunction.updateKPPNScore(
              junctionId,
              worksheetId,
              score,
              excluded,
              updatedBy
            )
          : await wsCKJunction.updateKanwilScore(
              junctionId,
              worksheetId,
              score,
              excluded,
              updatedBy
            );

      if (!result) return socketError(callback, 'CK worksheet junction not found');

      const room = getCKWorksheetRoom(worksheetId);
      socket.to(room).emit(
        scoreOwner === 'kppn' ? 'ckKPPNScoreHasUpdated' : 'ckKanwilScoreHasUpdated',
        {
          worksheetId,
          junctionId,
          kppnScore: result.kppn_score,
          kanwilScore: result.kanwil_score,
          excluded: result.excluded,
        }
      );
      socket.to(room).emit(
        'ckWorksheetChanged',
        createCKChangedEvent(worksheetId, junctionId, 'score', socket.data.payload.username)
      );

      nonBlockingCall(
        activity.createActivity(
          socket.data.payload.username,
          scoreOwner === 'kppn' ? 91 : 85,
          socket.handshake.address,
          `CK junctionId: ${junctionId}, ${scoreOwner}Score: ${result[`${scoreOwner}_score`]}, excluded: ${excluded}`
        )
      );

      return callback({ success: true, rows: result, message: 'Nilai CK has been updated' });
    } catch (error: unknown) {
      logger.error(error);
      return socketError(callback, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async updateNote(
    socket: Socket,
    data: NoteEventData,
    noteOwner: 'kppn' | 'kanwil',
    callback: SocketCallback
  ) {
    try {
      const { worksheetId, junctionId } = data;
      const note = noteOwner === 'kppn' ? data.kppnNote : data.kanwilNote;
      const allowedRoles = noteOwner === 'kppn' ? KPPN_SCORE_ROLES : KANWIL_ROLES;

      if (!allowedRoles.includes(socket.data.payload.role)) {
        return socketError(callback, `Not authorized to update CK ${noteOwner} note`);
      }
      if (typeof note !== 'string' || note.length > 5000) {
        return socketError(callback, 'CK note must be at most 5000 characters');
      }

      const junction = await this.getAccessibleJunction(socket, worksheetId, junctionId);
      if (!junction) return socketError(callback, 'CK worksheet junction not found or inaccessible');

      const normalizedNote = note.trim() || null;
      const result = await wsCKJunction.updateNote(
        junctionId,
        worksheetId,
        noteOwner === 'kppn' ? 'kppn_note' : 'kanwil_note',
        normalizedNote,
        socket.data.payload.name
      );
      if (!result) return socketError(callback, 'CK worksheet junction not found');

      const room = getCKWorksheetRoom(worksheetId);
      socket.to(room).emit(
        noteOwner === 'kppn' ? 'ckKPPNNoteHasUpdated' : 'ckKanwilNoteHasUpdated',
        { worksheetId, junctionId, note: normalizedNote }
      );
      socket.to(room).emit(
        'ckWorksheetChanged',
        createCKChangedEvent(worksheetId, junctionId, 'note', socket.data.payload.username)
      );

      nonBlockingCall(
        activity.createActivity(
          socket.data.payload.username,
          86,
          socket.handshake.address,
          `CK worksheetId: ${worksheetId}, junctionId: ${junctionId}, noteOwner: ${noteOwner}`
        )
      );

      return callback({ success: true, rows: result, message: 'Catatan CK has been updated' });
    } catch (error: unknown) {
      logger.error(error);
      return socketError(callback, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async updateLinkFile(socket: Socket, data: LinkFileEventData, callback: SocketCallback) {
    try {
      const { worksheetId, junctionId } = data;
      if (!ALL_WORKSHEET_ROLES.includes(socket.data.payload.role)) {
        return socketError(callback, 'Not authorized to update CK link file');
      }
      if (typeof data.linkFile !== 'string' || data.linkFile.length > 2048) {
        return socketError(callback, 'Invalid CK link file data');
      }

      const junction = await this.getAccessibleJunction(socket, worksheetId, junctionId);
      if (!junction) return socketError(callback, 'CK worksheet junction not found or inaccessible');

      const normalizedLink = data.linkFile.trim() || null;
      const result = await wsCKJunction.updateLinkFile(
        junctionId,
        worksheetId,
        normalizedLink,
        socket.data.payload.name
      );
      if (!result) return socketError(callback, 'CK worksheet junction not found');

      const room = getCKWorksheetRoom(worksheetId);
      socket.to(room).emit('ckLinkFileHasUpdated', {
        worksheetId,
        junctionId,
        linkFile: normalizedLink,
      });
      socket.to(room).emit(
        'ckWorksheetChanged',
        createCKChangedEvent(worksheetId, junctionId, 'link', socket.data.payload.username)
      );

      nonBlockingCall(
        activity.createActivity(
          socket.data.payload.username,
          87,
          socket.handshake.address,
          `CK worksheetId: ${worksheetId}, junctionId: ${junctionId}, linkFile: ${normalizedLink ?? ''}`
        )
      );

      return callback({ success: true, rows: result, message: 'Link bukti dukung CK has been updated' });
    } catch (error: unknown) {
      logger.error(error);
      return socketError(callback, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async deleteFile(socket: Socket, data: DeleteFileEventData, callback: SocketCallback) {
    try {
      const { worksheetId, junctionId, fileName } = data;
      if (!ALL_WORKSHEET_ROLES.includes(socket.data.payload.role)) {
        return socketError(callback, 'Not authorized to delete CK file');
      }
      if (typeof fileName !== 'string' || !fileName) {
        return socketError(callback, 'CK file name is required');
      }

      const junction = await this.getAccessibleJunction(socket, worksheetId, junctionId);
      const safeFileName = path.basename(fileName);
      if (!junction || !junction.file_1 || junction.file_1 !== safeFileName) {
        return socketError(callback, 'CK file not found');
      }

      const result = await wsCKJunction.deleteFile(
        junctionId,
        worksheetId,
        socket.data.payload.name
      );
      if (!result) return socketError(callback, 'CK worksheet junction not found');

      const filePath = path.join(__dirname, '../uploads/worksheet', safeFileName);
      try {
        await fs.promises.unlink(filePath);
      } catch (error: unknown) {
        if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
      }

      const room = getCKWorksheetRoom(worksheetId);
      socket.to(room).emit('wsCKJunctionFileHasDeleted', {
        worksheetId,
        junctionId,
        fileName: safeFileName,
      });
      socket.to(room).emit(
        'ckWorksheetChanged',
        createCKChangedEvent(worksheetId, junctionId, 'file-delete', socket.data.payload.username)
      );

      nonBlockingCall(
        activity.createActivity(
          socket.data.payload.username,
          89,
          socket.handshake.address,
          `CK junctionId: ${junctionId}, fileName: ${safeFileName}`
        )
      );

      return callback({ success: true, rows: result, message: 'CK file deleted successfully' });
    } catch (error: unknown) {
      logger.error(error);
      return socketError(callback, error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

const wsCKEvent = new WsCKJunctionEvent();

export default function wsCKJunctionEventListener(socket: Socket) {
  socket.on('joinCKWorksheet', (worksheetId, callback) =>
    wsCKEvent.joinWorksheet(socket, worksheetId, callback)
  );
  socket.on('leaveCKWorksheet', (worksheetId, callback) =>
    wsCKEvent.leaveWorksheet(socket, worksheetId, callback)
  );
  socket.on('updateCKKPPNScore', (data, callback) =>
    wsCKEvent.updateScore(socket, data, 'kppn', callback)
  );
  socket.on('updateCKKanwilScore', (data, callback) =>
    wsCKEvent.updateScore(socket, data, 'kanwil', callback)
  );
  socket.on('updateCKKPPNNote', (data, callback) =>
    wsCKEvent.updateNote(socket, data, 'kppn', callback)
  );
  socket.on('updateCKKanwilNote', (data, callback) =>
    wsCKEvent.updateNote(socket, data, 'kanwil', callback)
  );
  socket.on('updateCKLinkFile', (data, callback) =>
    wsCKEvent.updateLinkFile(socket, data, callback)
  );
  socket.on('deleteWsCKJunctionFile', (data, callback) =>
    wsCKEvent.deleteFile(socket, data, callback)
  );
}
