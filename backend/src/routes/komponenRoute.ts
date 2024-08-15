import express from "express";
import * as komponenController from "../controller/komponen.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router = express.Router(); 

router.get("/getAllKomponen", authenticate, authorize([99, 4, 3, 2, 1]), komponenController.getAllKomponen);
router.get("/getAllSubKomponen", authenticate, authorize([99, 4, 3, 2, 1]), komponenController.getAllSubKomponen);
router.get("/getAllSubSubKomponen", authenticate, authorize([99, 4, 3, 2, 1]), komponenController.getAllSubSubKomponen);

export default router