/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import express from "express";
import * as komponenController from "../controller/komponen.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import logActivity from "../middleware/logActivity";

const router = express.Router(); 

router.get("/getAllKomponen", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(29), komponenController.getAllKomponen);
router.get("/getAllSubKomponen", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(30), komponenController.getAllSubKomponen);
router.get("/getAllSubSubKomponen", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(31), komponenController.getAllSubSubKomponen);

export default router