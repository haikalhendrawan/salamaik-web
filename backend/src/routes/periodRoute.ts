/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import express from "express";
import * as periodController from "../controller/period.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import logActivity from "../middleware/logActivity";

const router = express.Router(); 

router.get("/getAllPeriod", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(47), periodController.getAllPeriod);
router.get("/getPeriodById", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(48), periodController.getPeriodById);
router.post("/addPeriod", authenticate, authorize([99, 4]), logActivity(49), periodController.addPeriod);
router.post("/deletePeriodById", authenticate, authorize([99, 4]), logActivity(50), periodController.deletePeriodById);

export default router