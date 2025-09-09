/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import * as worksheetController from '../controller/worksheet.controller';
import express from "express";
import authenticate from "../middleware/authenticate";
import authorize from '../middleware/authorize';
import logActivity from '../middleware/logActivity';

const router = express.Router();

// all this route accessible only by admin kanwil except for dedicated route
router.get("/getAllWorksheet",  authenticate, authorize([99, 4]), logActivity(71), worksheetController.getAllWorksheet);
router.get("/getWorksheetByPeriodAndKPPN/:kppnId",  authenticate, authorize([99, 4, 3, 2, 1]), logActivity(72), worksheetController.getWorksheetByPeriodAndKPPN);
router.post("/addWorksheet",  authenticate, authorize([99, 4]), logActivity(73), worksheetController.addWorksheet);
router.post("/assignWorksheet",  authenticate, authorize([99, 4]), logActivity(74), worksheetController.assignWorksheet);
router.post("/editWorksheetPeriod",  authenticate, authorize([99, 4]), logActivity(75), worksheetController.editWorksheetPeriod);
router.post("/deleteWorksheet",  authenticate, authorize([99, 4]), logActivity(76), worksheetController.deleteWorksheet);

export default router