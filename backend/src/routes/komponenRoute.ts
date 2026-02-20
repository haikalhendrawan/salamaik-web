/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import express from "express";
import * as komponenController from "../controller/komponen.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import logActivity from "../middleware/logActivity";

const router = express.Router(); 

router.get("/getAllKomponen", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(29), komponenController.getAllKomponen);
router.get("/getAllKomponenExisting", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(29), komponenController.getAllKomponenExisting);
router.get("/getAllSubKomponen", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(30), komponenController.getAllSubKomponen);
router.get("/getAllSubKomponenExisting", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(30), komponenController.getAllSubKomponenExisting);
router.get("/getAllSubSubKomponen", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(31), komponenController.getAllSubSubKomponen);

router.post("/createKomponen", authenticate, authorize([99, 4]), logActivity(32), komponenController.createKomponen);
router.get("/deleteKomponen/:id", authenticate, authorize([99, 4]), logActivity(33), komponenController.deleteKomponen);
router.post("/editKomponen", authenticate, authorize([99, 4]), logActivity(34), komponenController.editKomponen);

export default router