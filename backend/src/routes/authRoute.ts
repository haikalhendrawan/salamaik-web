/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import express from "express";
import * as authController from "../controller/auth.controller";
import authenticate from "../middleware/authenticate";

const router = express.Router(); 

router.post("/login", authController.login);
router.get("/refresh", authController.refresh);
router.get("/logout", authenticate, authController.logout);
router.get("/updateToken", authenticate, authController.updateToken);
router.post("/getForgotPassToken", authController.getForgotPasswordToken);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/getRegisterToken", authController.getRegisterToken);
router.post("/verifyRegister", authController.verifyRegister);

export default router