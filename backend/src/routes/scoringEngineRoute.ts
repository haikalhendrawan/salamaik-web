/**
 * Salamaik API
 * Scoring engine routes.
 */

import { Router } from "express";
import * as scoringEngineController from "../controller/scoringEngine.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router = Router();

router.get(
  "/akk/average/:periodId/:peraturanId",
  authenticate,
  authorize([99, 4, 3]),
  scoringEngineController.getAverageAKKScore
);

router.get(
  "/akk/lhps/:periodId/:peraturanId",
  authenticate,
  authorize([99, 4, 3]),
  scoringEngineController.getAKKContributorLHPS
);

router.get(
  "/akk/:kppnId/:periodId/:peraturanId",
  authenticate,
  authorize([99, 4, 3, 2, 1]),
  scoringEngineController.getAKKScore
);

router.get(
  "/spml/period/:periodId",
  authenticate,
  authorize([99, 4, 3]),
  scoringEngineController.getAllKPPNSPMLScoresByPeriod
);

router.get("/spml/:worksheetSPMLId", authenticate, authorize([99, 4, 3, 2, 1]), scoringEngineController.getSPMLScore);

router.get(
  "/ck/:worksheetCKId",
  authenticate,
  authorize([99, 4, 3, 2, 1]),
  scoringEngineController.getCKScore
);

router.get(
  "/pb/:worksheetPBId",
  authenticate,
  authorize([99, 4, 3, 2, 1]),
  scoringEngineController.getPBScore
);

export default router;
