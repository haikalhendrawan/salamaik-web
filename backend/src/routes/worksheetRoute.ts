import * as worksheetController from '../controller/worksheet.controller';
import express from "express";
import authenticate from "../middleware/authenticate";
import authorize from '../middleware/authorize';


const router = express.Router();

// all this route accessible only by admin kanwil except for dedicated route
router.get("/getAllWorksheet",  authenticate, authorize([99, 4]), worksheetController.getAllWorksheet);
router.get("/getWorksheetByPeriodAndKPPN/:kppnId",  authenticate, authorize([99, 4, 3, 2, 1]), worksheetController.getWorksheetByPeriodAndKPPN);
router.post("/addWorksheet",  authenticate, authorize([99, 4]), worksheetController.addWorksheet);
router.post("/assignWorksheet",  authenticate, authorize([99, 4]), worksheetController.assignWorksheet);
router.post("/editWorksheetPeriod",  authenticate, authorize([99, 4]),worksheetController.editWorksheetPeriod);
router.post("/deleteWorksheet",  authenticate, authorize([99, 4]),worksheetController.deleteWorksheet);

export default router