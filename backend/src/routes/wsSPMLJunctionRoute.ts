/**
 * Salamaik API
 * © Kanwil DJPb Sumbar 2026
 */

import express from "express";
import * as wsSPMLJunctionController from "../controller/wsSPMLJunction.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import logActivity from "../middleware/logActivity";

const router = express.Router();

router.get("/getWsSPMLJunctionByWorksheetForKPPN", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(117), wsSPMLJunctionController.getWsSPMLJunctionByWorksheetForKPPN);
router.get("/getWsSPMLJunctionByWorksheetForKanwil", authenticate, authorize([99, 4, 3]), logActivity(118), wsSPMLJunctionController.getWsSPMLJunctionByWorksheetForKanwil);
router.post("/editWsSPMLJunctionFile", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(87), wsSPMLJunctionController.editWsSPMLJunctionFile);

export default router;
