/**
 * Salamaik API
 * Routes CRUD referensi Kertas Kerja Capaian Kinerja (CK)
 */

import express from 'express';
import * as ckRefController from '../controller/ckRef.controller';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';

const router = express.Router();

const readRoles = [99, 4, 3, 2, 1];
const adminRoles = [99, 4];

// Komponen CK
router.get('/getAllKomponen', authenticate, authorize(readRoles), ckRefController.getAllKomponenCk);
router.post('/createKomponen', authenticate, authorize(adminRoles), ckRefController.createKomponenCk);
router.post('/editKomponen', authenticate, authorize(adminRoles), ckRefController.editKomponenCk);
router.post('/deleteKomponen', authenticate, authorize(adminRoles), ckRefController.deleteKomponenCk);

// Checklist CK
router.get('/getAllChecklist', authenticate, authorize(readRoles), ckRefController.getAllChecklistCk);
router.post('/createChecklist', authenticate, authorize(adminRoles), ckRefController.createChecklistCk);
router.post('/editChecklist', authenticate, authorize(adminRoles), ckRefController.editChecklistCk);
router.post('/deleteChecklist', authenticate, authorize(adminRoles), ckRefController.deleteChecklistCk);

// Opsi CK
router.get('/getAllOpsi', authenticate, authorize(readRoles), ckRefController.getAllOpsiCk);
router.post('/createOpsi', authenticate, authorize(adminRoles), ckRefController.createOpsiCk);
router.post('/editOpsi', authenticate, authorize(adminRoles), ckRefController.editOpsiCk);
router.post('/deleteOpsi', authenticate, authorize(adminRoles), ckRefController.deleteOpsiCk);

export default router;
