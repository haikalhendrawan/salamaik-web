import express from "express";
import * as unitController from "../controller/unit.controller";
import authenticate from "../middleware/authenticate";

const router = express.Router(); 

router.get("/getAllUnit", authenticate, unitController.getAllUnit);
router.get("/getUnitById", authenticate, unitController.getUnitById);

export default router