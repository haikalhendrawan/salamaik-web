import express from "express";
import * as authController from "../controller/auth.controller";
import authenticate from "../middleware/authenticate";

const router = express.Router(); 

router.post("/login", authController.login);
router.get("/refresh", authController.refresh);
router.get("/logout", authenticate, authController.logout);
router.get("/updateToken", authenticate, authController.updateToken);

export default router