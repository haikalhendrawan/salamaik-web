/**
 * Salamaik API
 * HTTP handlers for worksheet scoring.
 */

import { NextFunction, Request, Response } from "express";
import ErrorDetail from "../model/error.model";
import scoringEngine, { PBRegulation } from "../model/scoringEngine.model";
import { canAccessAKKWorksheet } from "../utils/akkSocket.utils";
//-----------------------------------------------------------------------------------------------------------------

const getAverageAKKScore = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const periodId = Number(req.params.periodId);
    const peraturan = Number(req.params.peraturanId);

    if (!Number.isInteger(periodId) || periodId <= 0) {
      throw new ErrorDetail(400, "periodId must be a positive integer");
    }
    if (peraturan !== 1 && peraturan !== 2) {
      throw new ErrorDetail(400, "peraturanId must be 1 or 2");
    }

    const calculation = await scoringEngine.calculateAverageAKKScore(
      periodId,
      peraturan as PBRegulation
    );

    if (!calculation) {
      throw new ErrorDetail(404, "No worksheets were found for this period");
    }

    return res.status(200).json({
      success: true,
      message: "Average AKK score calculated successfully",
      rows: calculation,
    });
  } catch (err) {
    next(err);
  }
};

const getAKKScore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const kppnId = req.params.kppnId?.trim();
    const periodId = Number(req.params.periodId);
    const peraturan = Number(req.params.peraturanId);

    if (!kppnId) {
      throw new ErrorDetail(400, "kppnId is required");
    }
    if (!Number.isInteger(periodId) || periodId <= 0) {
      throw new ErrorDetail(400, "periodId must be a positive integer");
    }
    if (peraturan !== 1 && peraturan !== 2) {
      throw new ErrorDetail(400, "peraturanId must be 1 or 2");
    }
    if (!canAccessAKKWorksheet(req.payload.role, req.payload.kppn, kppnId)) {
      throw new ErrorDetail(403, "Not authorized to access this KPPN AKK score");
    }

    const calculation = await scoringEngine.calculateAKKScore(
      kppnId,
      periodId,
      peraturan as PBRegulation
    );

    if (!calculation) {
      throw new ErrorDetail(404, "Worksheet for this KPPN and period was not found");
    }

    return res.status(200).json({
      success: true,
      message: "AKK score calculated successfully",
      rows: {
        kppnId: calculation.kppnId,
        kppnName: calculation.kppnName,
        kppnAlias: calculation.kppnAlias,
        periodId: calculation.periodId,
        periodName: calculation.periodName,
        peraturan: calculation.result.peraturan,
        worksheetId: calculation.worksheetId,
        nilaiKPPN: calculation.result.nilaiKPPN,
        nilaiKanwil: calculation.result.nilaiKanwil,
        detailKPPN: calculation.result.detailKPPN,
        detailKanwil: calculation.result.detailKanwil,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getSPMLScore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const worksheetSPMLId = req.params.worksheetSPMLId?.trim();

    if (!worksheetSPMLId) {
      throw new ErrorDetail(400, "worksheetSPMLId is required");
    }

    const calculation = await scoringEngine.calculateSPMLScore(worksheetSPMLId);
    if (!calculation) {
      throw new ErrorDetail(404, "SPML worksheet not found");
    }

    if (!canAccessAKKWorksheet(req.payload.role, req.payload.kppn, calculation.kppnId)) {
      throw new ErrorDetail(403, "Not authorized to access this SPML worksheet score");
    }

    return res.status(200).json({
      success: true,
      message: "SPML worksheet score calculated successfully",
      rows: calculation.result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllKPPNSPMLScoresByPeriod = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const periodId = Number(req.params.periodId);
    if (!Number.isInteger(periodId) || periodId <= 0) {
      throw new ErrorDetail(400, "periodId must be a positive integer");
    }

    const result = await scoringEngine.calculateAllKPPNSPMLScores(periodId);
    return res.status(200).json({
      success: true,
      message: "All KPPN SPML worksheet scores calculated successfully",
      rows: result,
    });
  } catch (err) {
    next(err);
  }
};

const getCKScore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const worksheetCKId = req.params.worksheetCKId?.trim();

    if (!worksheetCKId) {
      throw new ErrorDetail(400, "worksheetCKId is required");
    }

    const calculation = await scoringEngine.calculateCKScore(worksheetCKId);
    if (!calculation) {
      throw new ErrorDetail(404, "CK worksheet not found");
    }

    if (!canAccessAKKWorksheet(req.payload.role, req.payload.kppn, calculation.kppnId)) {
      throw new ErrorDetail(403, "Not authorized to access this CK worksheet score");
    }

    return res.status(200).json({
      success: true,
      message: "CK worksheet score calculated successfully",
      rows: calculation.result,
    });
  } catch (err) {
    next(err);
  }
};

const getPBScore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const worksheetPBId = req.params.worksheetPBId?.trim();
    const peraturan = Number(req.query.peraturan);

    if (!worksheetPBId) {
      throw new ErrorDetail(400, "worksheetPBId is required");
    }
    if (peraturan !== 1 && peraturan !== 2) {
      throw new ErrorDetail(400, "peraturan must be 1 or 2");
    }

    const calculation = await scoringEngine.calculatePBScore(
      worksheetPBId,
      peraturan as PBRegulation
    );
    if (!calculation) {
      throw new ErrorDetail(404, "PB worksheet not found");
    }

    if (!canAccessAKKWorksheet(req.payload.role, req.payload.kppn, calculation.kppnId)) {
      throw new ErrorDetail(403, "Not authorized to access this PB worksheet score");
    }

    return res.status(200).json({
      success: true,
      message: "PB worksheet score calculated successfully",
      rows: calculation.result,
    });
  } catch (err) {
    next(err);
  }
};

export {
  getAverageAKKScore,
  getAKKScore,
  getSPMLScore,
  getAllKPPNSPMLScoresByPeriod,
  getCKScore,
  getPBScore,
};
