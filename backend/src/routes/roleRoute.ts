/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import express from "express";
import * as roleController from "../controller/role.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import logActivity from "../middleware/logActivity";

const router = express.Router(); 

router.get("/getAllRole", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(54), roleController.getAllRole);
router.get("/getRoleById", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(55), roleController.getRoleById);

export default router