/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import express from "express";
import * as wsJunctionController from "../controller/worksheetJunction.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";


const router = express.Router();

router.get("/getWsJunctionByWorksheetForKPPN", authenticate, authorize([99, 4, 3, 2, 1]), wsJunctionController.getWsJunctionByWorksheetForKPPN);
router.get("/getWsJunctionByWorksheetForKanwil", authenticate, authorize([99, 4, 3]), wsJunctionController.getWsJunctionByWorksheetForKanwil);
router.get("/getWsJunctionByPeriod", authenticate, authorize([99, 4, 3]), wsJunctionController.getWsJunctionByPeriod);
router.get("/getWsJunctionByKPPN", authenticate, authorize([99, 4, 3]), wsJunctionController.getWsJunctionByKPPN);
router.post("/getWsJunctionScoreAndProgress", authenticate, authorize([99, 4, 3, 2, 1]), wsJunctionController.getWsJunctionScoreAndProgress);
router.get("/getWsJunctionScoreAndProgressAllKPPN", authenticate, authorize([99, 4, 3]), wsJunctionController.getWsJunctionScoreAndProgressAllKPPN);
router.get("/getWsJunctionScoreAllPeriodSingleKPPN", authenticate, authorize([99, 4, 3, 2, 1]), wsJunctionController.getWsJunctionScoreAllPeriodSingleKPPN);
router.get("/getWsJunctionScoreAllPeriod", authenticate, authorize([99, 4, 3]), wsJunctionController.getWsJunctionScoreAllPeriod);
router.post("/editWsJunctionKPPNScore", authenticate, authorize([99, 4, 2, 1]), wsJunctionController.editWsJunctionKPPNScore);
router.post("/editWsJunctionKanwilScore", authenticate, authorize([99, 4, 3]), wsJunctionController.editWsJunctionKanwilScore);
router.post("/editWsJunctionKanwilNote", authenticate, authorize([99, 4, 3]), wsJunctionController.editWsJunctionKanwilNote);
router.post("/editWsJunctionFile", authenticate, authorize([99, 4, 3, 2, 1]), wsJunctionController.editWsJunctionFile);
router.post("/editWsJunctionExclude", authenticate, authorize([99, 4, 3]), wsJunctionController.editWsJunctionExclude);
router.post("/deleteWsJunctionByWorksheetId", authenticate,  authorize([99, 4]), wsJunctionController.deleteWsJunctionByWorksheetId);

export default router

