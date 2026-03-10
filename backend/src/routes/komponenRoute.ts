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

router.post("/createSubKomponen", authenticate, authorize([99, 4]), logActivity(35), komponenController.createSubKomponen);
router.get("/deleteSubKomponen/:id", authenticate, authorize([99, 4]), logActivity(36), komponenController.deleteSubKomponen);
router.post("/editSubKomponen", authenticate, authorize([99, 4]), logActivity(37), komponenController.editSubKomponen);

router.post("/createSubSubKomponen", authenticate, authorize([99, 4]), logActivity(38), komponenController.createSubSubKomponen);
router.get("/deleteSubSubKomponen/:id", authenticate, authorize([99, 4]), logActivity(39), komponenController.deleteSubSubKomponen);
router.post("/editSubSubKomponen", authenticate, authorize([99, 4]), logActivity(40), komponenController.editSubSubKomponen);

export default router