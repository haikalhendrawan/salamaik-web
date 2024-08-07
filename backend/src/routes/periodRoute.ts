import express from "express";
import * as periodController from "../controller/period.controller";
import authenticate from "../middleware/authenticate";

const router = express.Router(); 

router.get("/getAllPeriod", authenticate, periodController.getAllPeriod);
router.get("/getPeriodById", authenticate, periodController.getPeriodById);
router.post("/addPeriod", authenticate, periodController.addPeriod);
router.post("/deletePeriodById", authenticate, periodController.deletePeriodById);

export default router