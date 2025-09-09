/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import express from "express";
import * as standardizationController from "../controller/standardization.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import alterPeriodPayload from "../middleware/alterPeriodPayload";
import logActivity from "../middleware/logActivity";

const router = express.Router(); 

router.get("/getAllStandardization", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(56), standardizationController.getAllStandardization);
router.get("/getStandardizationJunction", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(57), standardizationController.getStandardizationJunction);
router.get("/getStdWorksheet/:kppn/:period?", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(58), alterPeriodPayload, standardizationController.getStdWorksheet);
router.post("/getStdFilePerMonthKPPN", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(59), standardizationController.getStdFilePerMonthKPPN);
router.post("/addStandardizationJunction", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(60), standardizationController.addStandardizationJunction);
router.post("/deleteStandardizationJunction", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(61), standardizationController.deleteStandardizationJunction);

export default router