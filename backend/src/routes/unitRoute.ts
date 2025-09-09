/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import express from "express";
import * as unitController from "../controller/unit.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import logActivity from "../middleware/logActivity";

const router = express.Router(); 

router.get("/getAllUnit", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(62), unitController.getAllUnit);
router.get("/getUnitById", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(63), unitController.getUnitById);

export default router