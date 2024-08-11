import express from "express";
import * as wsJunctionController from "../controller/worksheetJunction.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";


const router = express.Router();

router.get("/getWsJunctionByWorksheetForKPPN", authenticate,  wsJunctionController.getWsJunctionByWorksheetForKPPN);
router.get("/getWsJunctionByWorksheetForKanwil", authenticate,  wsJunctionController.getWsJunctionByWorksheetForKanwil);
router.get("/getWsJunctionByPeriod", authenticate,  wsJunctionController.getWsJunctionByPeriod);
router.get("/getWsJunctionByKPPN", authenticate,  wsJunctionController.getWsJunctionByKPPN);
router.post("/getWsJunctionScoreAndProgress", authenticate,  wsJunctionController.getWsJunctionScoreAndProgress);
router.post("/editWsJunctionKPPNScore", authenticate,  wsJunctionController.editWsJunctionKPPNScore);
router.post("/editWsJunctionKanwilScore", authenticate,  wsJunctionController.editWsJunctionKanwilScore);
router.post("/editWsJunctionKanwilNote", authenticate,  wsJunctionController.editWsJunctionKanwilNote);
router.post("/editWsJunctionFile", authenticate,  wsJunctionController.editWsJunctionFile);
router.post("/deleteWsJunctionByWorksheetId", authenticate,  wsJunctionController.deleteWsJunctionByWorksheetId);

export default router

