/**
 * Salamaik API
 * © Kanwil DJPb Sumbar 2026
 */

import { NextFunction, Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import io from "../config/io";
import { uploadWsSPMLJunctionFile } from "../config/multer";
import ErrorDetail from "../model/error.model";
import worksheet from "../model/worksheet.model";
import wsSPMLJunction, {
  WsSPMLJunctionJoinChecklistSPMLType,
} from "../model/wsSPMLJunction.model";
import { createSPMLChangedEvent, getSPMLWorksheetRoom } from "../utils/wsSPMLSocket.utils";
import { assertWorksheetMutationAllowed, createWorksheetReadState } from "../utils/worksheetPhase.utils";
//-----------------------------------------------------------------------------------------------------------------
const getWsSPMLJunctionByWorksheetForKPPN = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { kppn, period } = req.payload;
    const worksheetData = await worksheet.getWorksheetByPeriodAndKPPN(period, kppn);
    const worksheetId = worksheetData[0]?.id;

    if (!worksheetId) {
      throw new ErrorDetail(404, "Worksheet not found");
    }

    const result: WsSPMLJunctionJoinChecklistSPMLType[] =
      await wsSPMLJunction.getWsSPMLJunctionByWorksheetId(worksheetId);

    if (result.length === 0) {
      throw new ErrorDetail(404, "SPML worksheet not assigned");
    }
    const state = createWorksheetReadState(result, worksheetData[0], Number(req.payload.peraturan), req.payload.role);

    return res.status(200).json({
      success: true,
      message: "Get SPML worksheet junction success",
      ...state,
    });
  } catch (err) {
    next(err);
  }
};

const getWsSPMLJunctionByWorksheetForKanwil = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const kppn = req.query.kppn?.toString() || "";
    const { period } = req.payload;

    if (!kppn) {
      throw new ErrorDetail(400, "KPPN is required");
    }

    const worksheetData = await worksheet.getWorksheetByPeriodAndKPPN(period, kppn);
    const worksheetId = worksheetData[0]?.id;

    if (!worksheetId) {
      throw new ErrorDetail(404, "Worksheet not found");
    }

    const result: WsSPMLJunctionJoinChecklistSPMLType[] =
      await wsSPMLJunction.getWsSPMLJunctionByWorksheetId(worksheetId);

    if (result.length === 0) {
      throw new ErrorDetail(404, "SPML worksheet not assigned");
    }
    const state = createWorksheetReadState(result, worksheetData[0], Number(req.payload.peraturan), req.payload.role);

    return res.status(200).json({
      success: true,
      message: "Get SPML worksheet junction success",
      ...state,
    });
  } catch (err) {
    next(err);
  }
};

const editWsSPMLJunctionFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadWsSPMLJunctionFile(req, res, async (err: unknown) => {
    if (err instanceof multer.MulterError) {
      return next(new ErrorDetail(400, "File too large (Max 20 MB)", err));
    }

    if (err) {
      return next(err);
    }

    if (!req.file) {
      return next(new ErrorDetail(400, "File type is not allowed"));
    }

    try {
      const { name } = req.payload;
      const { worksheetId, junctionId, checklistSpmlId, kppnId } = req.body;
      const parsedJunctionId = Number(junctionId);
      const parsedChecklistSpmlId = Number(checklistSpmlId);

      if (!worksheetId || !kppnId || !Number.isInteger(parsedJunctionId) || !Number.isInteger(parsedChecklistSpmlId)) {
        throw new ErrorDetail(400, "Invalid SPML file upload data");
      }

      const junction = await wsSPMLJunction.getWsSPMLJunctionByJunctionId(parsedJunctionId);
      if (
        !junction ||
        junction.worksheet_id !== worksheetId ||
        junction.checklist_spml_id !== parsedChecklistSpmlId ||
        junction.kppn_id !== kppnId
      ) {
        throw new ErrorDetail(404, "SPML worksheet junction not found");
      }

      const requesterKppn = req.payload.kppn;
      if (requesterKppn?.length !== 5 && requesterKppn !== junction.kppn_id) {
        throw new ErrorDetail(403, "Not authorized to update this SPML worksheet");
      }
      await assertWorksheetMutationAllowed({ worksheetId, peraturan: Number(req.payload.peraturan), kanwilScore: junction.kanwil_score, excluded: junction.excluded });

      if (junction.file_1) {
        throw new ErrorDetail(409, "Hapus file SPML yang lama sebelum mengunggah file baru");
      }

      const fileName = req.file.filename;
      const result = await wsSPMLJunction.editWsSPMLJunctionFile(
        parsedJunctionId,
        worksheetId,
        fileName,
        name
      );

      if (result.length === 0) {
        throw new ErrorDetail(409, "Hapus file SPML yang lama sebelum mengunggah file baru");
      }

      const room = getSPMLWorksheetRoom(worksheetId);
      io.to(room).emit("spmlFileHasUpdated", {
        worksheetId,
        junctionId: parsedJunctionId,
        checklistSpmlId: parsedChecklistSpmlId,
        kppnId,
        fileName,
      });
      io.to(room).emit(
        "spmlWorksheetChanged",
        createSPMLChangedEvent(worksheetId, parsedJunctionId, "file-upload", req.payload.username)
      );

      return res.status(200).json({
        success: true,
        message: "SPML worksheet file uploaded successfully",
        rows: result,
      });
    } catch (err) {
      if (req.file?.filename) {
        const uploadedFilePath = path.join(__dirname, "../uploads/worksheet", path.basename(req.file.filename));
        await fs.promises.unlink(uploadedFilePath).catch(() => undefined);
      }
      next(err);
    }
  });
};

export {
  getWsSPMLJunctionByWorksheetForKPPN,
  getWsSPMLJunctionByWorksheetForKanwil,
  editWsSPMLJunctionFile,
};
