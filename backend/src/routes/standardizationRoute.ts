import express from "express";
import * as standardizationController from "../controller/standardization.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router = express.Router(); 

router.get("/getAllStandardization", authenticate, authorize([99, 4, 3, 2, 1]), standardizationController.getAllStandardization);
router.get("/getStandardizationJunction", authenticate, authorize([99, 4, 3, 2, 1]), standardizationController.getStandardizationJunction);
router.get("/getStdWorksheet/:kppn", authenticate, authorize([99, 4, 3, 2, 1]), standardizationController.getStdWorksheet);
router.post("/getStdFilePerMonthKPPN", authenticate, authorize([99, 4, 3, 2, 1]), standardizationController.getStdFilePerMonthKPPN);
router.post("/addStandardizationJunction", authenticate, authorize([99, 4, 3, 2, 1]), standardizationController.addStandardizationJunction);
router.post("/deleteStandardizationJunction", authenticate, authorize([99, 4, 3, 2, 1]), standardizationController.deleteStandardizationJunction);

export default router