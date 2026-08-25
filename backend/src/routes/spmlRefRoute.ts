/**
 * Salamaik API 
 * © Kanwil DJPb Sumbar 2026
 */

import express from "express";
import * as spmlRefController from "../controller/spmlRef.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import logActivity from "../middleware/logActivity";

const router = express.Router();

// =============================================================================
// KOMPONEN SPML ROUTES
// =============================================================================
router.get("/getAllKomponen", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(101), spmlRefController.getAllKomponenSpml);
router.post("/createKomponen", authenticate, authorize([99, 4]), logActivity(102), spmlRefController.createKomponenSpml);
router.post("/editKomponen", authenticate, authorize([99, 4]), logActivity(103), spmlRefController.editKomponenSpml);
router.post("/deleteKomponen", authenticate, authorize([99, 4]), logActivity(104), spmlRefController.deleteKomponenSpml);
router.get("/deleteKomponen/:id", authenticate, authorize([99, 4]), logActivity(104), spmlRefController.deleteKomponenSpml);

// =============================================================================
// SUBKOMPONEN SPML ROUTES
// =============================================================================
router.get("/getAllSubKomponen", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(105), spmlRefController.getAllSubKomponenSpml);
router.post("/createSubKomponen", authenticate, authorize([99, 4]), logActivity(106), spmlRefController.createSubKomponenSpml);
router.post("/editSubKomponen", authenticate, authorize([99, 4]), logActivity(107), spmlRefController.editSubKomponenSpml);
router.post("/deleteSubKomponen", authenticate, authorize([99, 4]), logActivity(108), spmlRefController.deleteSubKomponenSpml);
router.get("/deleteSubKomponen/:id", authenticate, authorize([99, 4]), logActivity(108), spmlRefController.deleteSubKomponenSpml);

// =============================================================================
// ASPEK SPML ROUTES
// =============================================================================
router.get("/getAllAspek", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(109), spmlRefController.getAllAspekSpml);
router.post("/createAspek", authenticate, authorize([99, 4]), logActivity(110), spmlRefController.createAspekSpml);
router.post("/editAspek", authenticate, authorize([99, 4]), logActivity(111), spmlRefController.editAspekSpml);
router.post("/deleteAspek", authenticate, authorize([99, 4]), logActivity(112), spmlRefController.deleteAspekSpml);
router.get("/deleteAspek/:id", authenticate, authorize([99, 4]), logActivity(112), spmlRefController.deleteAspekSpml);

// =============================================================================
// CHECKLIST SPML ROUTES
// =============================================================================
router.get("/getAllChecklist", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(113), spmlRefController.getAllChecklistSpml);
router.post("/createChecklist", authenticate, authorize([99, 4]), logActivity(114), spmlRefController.createChecklistSpml);
router.post("/editChecklist", authenticate, authorize([99, 4]), logActivity(115), spmlRefController.editChecklistSpml);
router.post("/deleteChecklist", authenticate, authorize([99, 4]), logActivity(116), spmlRefController.deleteChecklistSpml);
router.get("/deleteChecklist/:id", authenticate, authorize([99, 4]), logActivity(116), spmlRefController.deleteChecklistSpml);

export default router;
