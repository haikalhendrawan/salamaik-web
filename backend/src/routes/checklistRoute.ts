import express from "express";
import * as checklistController from "../controller/checklist.controller";
import authenticate from "../middleware/authenticate";


const router = express.Router(); 


router.get("/getAllChecklist", authenticate, checklistController.getAllChecklist);
router.get("/getAllOpsi", authenticate, checklistController.getAllOpsi);
router.get("/getChecklistWithOpsi",  authenticate, checklistController.getChecklistWithOpsi);
router.post("/editChecklistFile", authenticate, checklistController.editChecklistFile);
router.post("/deleteChecklistFile", authenticate, checklistController.deleteChecklistFile);


export default router
