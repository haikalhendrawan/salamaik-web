/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import express from "express";
import * as wsJunctionController from "../controller/worksheetJunction.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import logActivity from "../middleware/logActivity";


const router = express.Router();

router.get("/getWsJunctionByWorksheetForKPPN", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(77), wsJunctionController.getWsJunctionByWorksheetForKPPN);
router.get("/getWsJunctionByWorksheetForKanwil", authenticate, authorize([99, 4, 3]), logActivity(78), wsJunctionController.getWsJunctionByWorksheetForKanwil);
router.get("/getWsJunctionByPeriod", authenticate, authorize([99, 4, 3]), logActivity(79), wsJunctionController.getWsJunctionByPeriod);
router.get("/getWsJunctionByKPPN", authenticate, authorize([99, 4, 3]), logActivity(80), wsJunctionController.getWsJunctionByKPPN);
router.get("/getByPeriodAndKPPN", authenticate, authorize([99, 4, 3]), logActivity(78), wsJunctionController.getByPeriodAndKPPN);
router.post("/getWsJunctionScoreAndProgress", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(81), wsJunctionController.getWsJunctionScoreAndProgress);
router.get("/getWsJunctionScoreAndProgressAllKPPN", authenticate, authorize([99, 4, 3]), logActivity(82), wsJunctionController.getWsJunctionScoreAndProgressAllKPPN);
router.get("/getWsJunctionScoreAllPeriodSingleKPPN", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(84), wsJunctionController.getWsJunctionScoreAllPeriodSingleKPPN);
router.get("/getWsJunctionScoreAllPeriod", authenticate, authorize([99, 4, 3]), logActivity(83), wsJunctionController.getWsJunctionScoreAllPeriod);
router.post("/editWsJunctionKPPNScore", authenticate, authorize([99, 4, 2, 1]), logActivity(91), wsJunctionController.editWsJunctionKPPNScore);
router.post("/editWsJunctionKanwilScore", authenticate, authorize([99, 4, 3]), logActivity(85), wsJunctionController.editWsJunctionKanwilScore);
router.post("/editWsJunctionKanwilNote", authenticate, authorize([99, 4, 3]), logActivity(86), wsJunctionController.editWsJunctionKanwilNote);
router.post("/editWsJunctionFile", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(87), wsJunctionController.editWsJunctionFile);
router.post("/editWsJunctionExclude", authenticate, authorize([99, 4, 3]), logActivity(88), wsJunctionController.editWsJunctionExclude);
router.post("/deleteWsJunctionByWorksheetId", authenticate,  authorize([99, 4]), logActivity(90), wsJunctionController.deleteWsJunctionByWorksheetId);

export default router

