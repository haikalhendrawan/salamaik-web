/**
 * Salamaik API
 * Worksheet CK junction controller
 */

import fs from 'fs';
import path from 'path';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import io from '../config/io';
import { uploadWsCKJunctionFile } from '../config/multer';
import ErrorDetail from '../model/error.model';
import worksheet from '../model/worksheet.model';
import wsCKJunction from '../model/wsCKJunction.model';
import {
  canAccessCKWorksheet,
  createCKChangedEvent,
  getCKWorksheetRoom,
} from '../utils/wsCKSocket.utils';

const getWsCKJunctionByWorksheetForKPPN = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { kppn, period } = req.payload;
    const worksheetData = await worksheet.getWorksheetByPeriodAndKPPN(period, kppn);
    const worksheetId = worksheetData[0]?.id;

    if (!worksheetId) throw new ErrorDetail(404, 'Worksheet not found');

    const result = await wsCKJunction.getByWorksheetId(worksheetId);
    if (result.length === 0) throw new ErrorDetail(404, 'CK worksheet not assigned');

    return res.status(200).json({
      success: true,
      message: 'Get CK worksheet junction success',
      rows: result,
    });
  } catch (error) {
    next(error);
  }
};

const getWsCKJunctionByWorksheetForKanwil = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const kppn = req.query.kppn?.toString().trim() || '';
    const { period } = req.payload;

    if (!kppn) throw new ErrorDetail(400, 'KPPN is required');

    const worksheetData = await worksheet.getWorksheetByPeriodAndKPPN(period, kppn);
    const worksheetId = worksheetData[0]?.id;

    if (!worksheetId) throw new ErrorDetail(404, 'Worksheet not found');

    const result = await wsCKJunction.getByWorksheetId(worksheetId);
    if (result.length === 0) throw new ErrorDetail(404, 'CK worksheet not assigned');

    return res.status(200).json({
      success: true,
      message: 'Get CK worksheet junction success',
      rows: result,
    });
  } catch (error) {
    next(error);
  }
};

const editWsCKJunctionFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadWsCKJunctionFile(req, res, async (uploadError: unknown) => {
    if (uploadError instanceof multer.MulterError) {
      return next(new ErrorDetail(400, 'File too large (Max 20 MB)', uploadError));
    }
    if (uploadError) return next(uploadError);
    if (!req.file) return next(new ErrorDetail(400, 'File type is not allowed'));

    try {
      const { worksheetId, junctionId, checklistCkId, kppnId } = req.body;
      const parsedJunctionId = Number(junctionId);
      const parsedChecklistCkId = Number(checklistCkId);

      if (
        typeof worksheetId !== 'string' ||
        !worksheetId.trim() ||
        typeof kppnId !== 'string' ||
        !kppnId.trim() ||
        !Number.isInteger(parsedJunctionId) ||
        parsedJunctionId <= 0 ||
        !Number.isInteger(parsedChecklistCkId) ||
        parsedChecklistCkId <= 0
      ) {
        throw new ErrorDetail(400, 'Invalid CK file upload data');
      }

      const junction = await wsCKJunction.getByJunctionId(parsedJunctionId);
      if (
        !junction ||
        junction.worksheet_id !== worksheetId ||
        junction.checklist_ck_id !== parsedChecklistCkId ||
        junction.kppn_id !== kppnId
      ) {
        throw new ErrorDetail(404, 'CK worksheet junction not found');
      }

      if (!canAccessCKWorksheet(req.payload.role, req.payload.kppn, junction.kppn_id)) {
        throw new ErrorDetail(403, 'Not authorized to update this CK worksheet');
      }
      if (junction.file_1) {
        throw new ErrorDetail(409, 'Hapus file CK yang lama sebelum mengunggah file baru');
      }

      const result = await wsCKJunction.addFile(
        parsedJunctionId,
        worksheetId,
        req.file.filename,
        req.payload.name
      );
      if (!result) {
        throw new ErrorDetail(409, 'Hapus file CK yang lama sebelum mengunggah file baru');
      }

      const room = getCKWorksheetRoom(worksheetId);
      io.to(room).emit('ckFileHasUpdated', {
        worksheetId,
        junctionId: parsedJunctionId,
        checklistCkId: parsedChecklistCkId,
        fileName: req.file.filename,
      });
      io.to(room).emit(
        'ckWorksheetChanged',
        createCKChangedEvent(
          worksheetId,
          parsedJunctionId,
          'file-upload',
          req.payload.username
        )
      );

      return res.status(200).json({
        success: true,
        message: 'CK worksheet file uploaded successfully',
        rows: result,
      });
    } catch (error) {
      if (req.file?.filename) {
        const uploadedFilePath = path.join(
          __dirname,
          '../uploads/worksheet',
          path.basename(req.file.filename)
        );
        await fs.promises.unlink(uploadedFilePath).catch(() => undefined);
      }
      next(error);
    }
  });
};

const getProgressAllKPPN = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await wsCKJunction.getProgressAllByPeriod(req.payload.period);
    return res.status(200).json({
      success: true,
      message: 'Get CK worksheet progress success',
      rows: result,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getWsCKJunctionByWorksheetForKPPN,
  getWsCKJunctionByWorksheetForKanwil,
  getProgressAllKPPN,
  editWsCKJunctionFile,
};
