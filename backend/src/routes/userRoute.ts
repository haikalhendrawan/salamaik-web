/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import express from "express";
import * as userController from "../controller/user.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import logActivity from "../middleware/logActivity";

const router = express.Router(); 

router.get("/getUser",  authenticate, authorize([99, 4, 2]), logActivity(64), userController.getUser);
router.post("/addUser", logActivity(65), userController.addUser);
router.post("/editUser", authenticate, authorize([99, 4, 2]), logActivity(66), userController.editUser);
router.post("/deleteUser",  authenticate, authorize([99, 4, 2]), logActivity(67), userController.deleteUser);
router.post("/updateStatus",  authenticate, authorize([99, 4, 2]), logActivity(68), userController.updateStatus);
router.post("/demoteStatus",  authenticate, authorize([99, 4, 2]), logActivity(69), userController.demoteStatus);
router.post("/updateRole",  authenticate, authorize([99, 4, 2]), logActivity(70), userController.updateRole);

export default router