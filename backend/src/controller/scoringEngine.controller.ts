/**
 * Salamaik API
 * HTTP handlers for worksheet scoring.
 */

import { NextFunction, Request, Response } from "express";
import ErrorDetail from "../model/error.model";
import scoringEngine from "../model/scoringEngine.model";
//-----------------------------------------------------------------------------------------------------------------

const canAccessWorksheet = (requesterKppn: string | undefined, worksheetKppn: string) =>
  requesterKppn?.length === 5 || requesterKppn === worksheetKppn;

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

    if (!canAccessWorksheet(req.payload?.kppn, calculation.kppnId)) {
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

export { getSPMLScore };
