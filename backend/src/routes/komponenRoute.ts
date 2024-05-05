import express from "express";
import * as komponenController from "../controller/komponen.controller";
import authenticate from "../middleware/authenticate";

const router = express.Router(); 

router.get("/getAllKomponen", komponenController.getAllKomponen);
router.get("/getAllSubKomponen", komponenController.getAllSubKomponen);
router.get("/getAllSubSubKomponen",  komponenController.getAllSubSubKomponen);

export default router