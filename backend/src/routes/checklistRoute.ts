import express from "express";
import * as checklistController from "../controller/checklist.controller";
import authenticate from "../middleware/authenticate";


const router = express.Router(); 


router.get("/getAllChecklist", checklistController.getAllChecklist);
router.get("/getAllOpsi", checklistController.getAllOpsi);


export default router
