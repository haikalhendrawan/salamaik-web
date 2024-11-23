/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import * as findingsController from '../controller/findings.controller';
import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import alterUnitPayload from '../middleware/alterUnitPayload';

const router = Router();

router.get('/getFindingsByWorksheetId/:kppnId', authenticate, authorize([99, 4, 3, 2, 1]), findingsController.getFindingsByWorksheetId);
router.get('/getAllFindingsWithChecklistDetail', authenticate, authorize([99, 4, 3, 2, 1]), findingsController.getAllFindings);
router.get('/getAllFindingsByKPPN/:unit', authenticate, authorize([99, 4, 3, 2, 1]), alterUnitPayload, findingsController.getAllFindingsByKPPN);
router.post('/createFindings', authenticate, authorize([99, 4]), findingsController.addFindings);
router.post('/updateFindingsScore', authenticate, authorize([99, 4, 2]), findingsController.updateFindingsScore);
router.post('/updateFindingsResponse', authenticate, authorize([99, 4, 2]), findingsController.updateFindingsResponse);
router.post('/updateFindingStatus', authenticate, authorize([99, 4, 2]), findingsController.updateFindingStatus);

export default router
