/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import express from "express";
import * as checklistController from "../controller/checklist.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import logActivity from "../middleware/logActivity";


const router = express.Router(); 

router.get("/getAllChecklist", authenticate, authorize([99, 4]), logActivity(15), checklistController.getAllChecklist);
router.get("/getChecklistWithOpsi", authenticate, authorize([99, 4]), logActivity(16), checklistController.getChecklistWithOpsi);
router.post("/editChecklist", authenticate, authorize([99, 4]), logActivity(17), checklistController.editChecklist);
router.post("/editChecklistFile", authenticate, authorize([99, 4]), logActivity(18), checklistController.editChecklistFile);
router.post("/deleteChecklistFile", authenticate, authorize([99, 4]), logActivity(19), checklistController.deleteChecklistFile);
router.get("/getAllOpsi", authenticate, authorize([99, 4]), logActivity(21), checklistController.getAllOpsi);
router.post("/editOpsi", authenticate, authorize([99, 4]), logActivity(20), checklistController.editOpsiById);


export default router
