import express from "express";
import * as roleController from "../controller/role.controller";
import authenticate from "../middleware/authenticate";

const router = express.Router(); 

router.get("/getAllRole", authenticate, roleController.getAllRole);
router.get("/getRoleById", authenticate, roleController.getRoleById);

export default router