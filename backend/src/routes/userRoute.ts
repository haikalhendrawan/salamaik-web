/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import express from "express";
import * as userController from "../controller/user.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router = express.Router(); 

router.get("/getUser",  authenticate, authorize([99, 4, 2]), userController.getUser);
router.post("/addUser", userController.addUser);
router.post("/editUser", authenticate, authorize([99, 4, 2]), userController.editUser);
router.post("/deleteUser",  authenticate, authorize([99, 4, 2]), userController.deleteUser);
router.post("/updateStatus",  authenticate, authorize([99, 4, 2]), userController.updateStatus);
router.post("/demoteStatus",  authenticate, authorize([99, 4, 2]), userController.demoteStatus);
router.post("/updateRole",  authenticate, authorize([99, 4, 2]), userController.updateRole);

export default router