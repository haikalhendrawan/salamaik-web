import * as worksheetController from '../controller/worksheet.controller';
import express from "express";
import authenticate from "../middleware/authenticate";


const router = express.Router();

// all this route accessible only by admin kanwil
router.get("/getAllWorksheet",  authenticate, worksheetController.getAllWorksheet);
router.post("/addWorksheet",  authenticate, worksheetController.addWorksheet);
router.post("/assignWorksheet",  authenticate, worksheetController.assignWorksheet);
router.post("/editWorksheetPeriod",  authenticate, worksheetController.editWorksheetPeriod);
router.post("/deleteWorksheet",  authenticate, worksheetController.deleteWorksheet);

export default router