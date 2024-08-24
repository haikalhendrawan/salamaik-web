import express from "express";
import * as checklistController from "../controller/checklist.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";


const router = express.Router(); 

router.get("/getAllChecklist", authenticate, authorize([99, 4]), checklistController.getAllChecklist);
router.get("/getChecklistWithOpsi", authenticate, authorize([99, 4]), checklistController.getChecklistWithOpsi);
router.post("/editChecklist", authenticate, authorize([99, 4]), checklistController.editChecklist);
router.post("/editChecklistFile", authenticate, authorize([99, 4]), checklistController.editChecklistFile);
router.post("/deleteChecklistFile", authenticate, authorize([99, 4]), checklistController.deleteChecklistFile);
router.get("/getAllOpsi", authenticate, authorize([99, 4]), checklistController.getAllOpsi);
router.post("/editOpsi", authenticate, authorize([99, 4]), checklistController.editOpsiById);


export default router
