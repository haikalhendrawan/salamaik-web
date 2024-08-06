import express from "express";
import * as standardizationController from "../controller/standardization.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router = express.Router(); 

router.get("/getAllStandardization", authenticate,  standardizationController.getAllStandardization);
router.get("/getStandardizationJunction", authenticate, standardizationController.getStandardizationJunction);
router.get("/getStdWorksheet/:kppn", authenticate, authorize([99, 1, 2, 3, 4]), standardizationController.getStdWorksheet);
router.post("/addStandardizationJunction", authenticate, standardizationController.addStandardizationJunction);
router.post("/deleteStandardizationJunction", authenticate, standardizationController.deleteStandardizationJunction);

export default router