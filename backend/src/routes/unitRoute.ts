import express from "express";
import * as unitController from "../controller/unit.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router = express.Router(); 

router.get("/getAllUnit", authenticate, authorize([99, 4, 3, 2, 1]), unitController.getAllUnit);
router.get("/getUnitById", authenticate, authorize([99, 4, 3, 2, 1]), unitController.getUnitById);

export default router