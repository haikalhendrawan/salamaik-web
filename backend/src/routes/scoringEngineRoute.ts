/**
 * Salamaik API
 * Scoring engine routes.
 */

import { Router } from "express";
import * as scoringEngineController from "../controller/scoringEngine.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router = Router();

router.get("/spml/:worksheetSPMLId", authenticate, authorize([99, 4, 3, 2, 1]), scoringEngineController.getSPMLScore);

export default router;
