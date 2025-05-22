/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import express from "express";
import * as authController from "../controller/auth.controller";
import authenticate from "../middleware/authenticate";
import logActivity from "../middleware/logActivity";

const router = express.Router(); 

router.post("/login", logActivity(1), authController.login);
router.get("/refresh", authController.refresh);
router.get("/logout", authenticate, logActivity(2), authController.logout);
router.get("/updateToken", authenticate, logActivity(10), authController.updateToken);
router.post("/getForgotPassToken", logActivity(11), authController.getForgotPasswordToken);
router.post("/forgotPassword", logActivity(12), authController.forgotPassword);
router.post("/getRegisterToken", logActivity(13), authController.getRegisterToken);
router.post("/verifyRegister", logActivity(14), authController.verifyRegister);

export default router