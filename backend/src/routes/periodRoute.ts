import express from "express";
import * as periodController from "../controller/period.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router = express.Router(); 

router.get("/getAllPeriod", authenticate, authorize([99, 4, 3, 2, 1]), periodController.getAllPeriod);
router.get("/getPeriodById", authenticate, authorize([99, 4, 3, 2, 1]), periodController.getPeriodById);
router.post("/addPeriod", authenticate, authorize([99, 4]), periodController.addPeriod);
router.post("/deletePeriodById", authenticate, authorize([99, 4]), periodController.deletePeriodById);

export default router