import * as findingsController from '../controller/findings.controller';
import { Router } from 'express';
import authenticate from '../middleware/authenticate';

const router = Router();

router.get('/getFindingsByWorksheetId/:kppnId', authenticate, findingsController.getFindingsByWorksheetId);
router.get('/getAllFindingsWithChecklistDetail', authenticate, findingsController.getAllFindings);
router.get('/getAllFindingsByKPPN', authenticate, findingsController.getAllFindingsByKPPN);
router.post('/createFindings', authenticate, findingsController.addFindings);
router.post('/updateFindingsScore', authenticate, findingsController.updateFindingsScore);
router.post('/updateFindingsResponse', authenticate, findingsController.updateFindingsResponse);
router.post('/updateFindingStatus', authenticate, findingsController.updateFindingStatus);

export default router
