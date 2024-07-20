import express from "express";
import * as checklistController from "../controller/checklist.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";


const router = express.Router(); 


router.get("/getAllChecklist", authenticate, authorize([99, 4]), checklistController.getAllChecklist);
router.get("/getChecklistWithOpsi", authenticate, authorize([99, 4]), checklistController.getChecklistWithOpsi);
router.post("/editChecklist", authenticate, checklistController.editChecklist);
router.post("/editChecklistFile", authenticate, checklistController.editChecklistFile);
router.post("/deleteChecklistFile", authenticate, checklistController.deleteChecklistFile);
router.get("/getAllOpsi", authenticate, checklistController.getAllOpsi);
router.post("/editOpsi", authenticate, checklistController.editOpsiById);


export default router
