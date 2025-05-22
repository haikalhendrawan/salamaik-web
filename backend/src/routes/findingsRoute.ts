/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import * as findingsController from '../controller/findings.controller';
import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import alterUnitPayload from '../middleware/alterUnitPayload';
import alterPeriodPayload from '../middleware/alterPeriodPayload';
import logActivity from '../middleware/logActivity';

const router = Router();

router.get('/getFindingsByWorksheetId/:kppnId/:period?', authenticate, authorize([99, 4, 3, 2, 1]), logActivity(22), alterPeriodPayload, findingsController.getFindingsByWorksheetId);
router.get('/getAllFindingsWithChecklistDetail', authenticate, authorize([99, 4, 3, 2, 1]), logActivity(23), findingsController.getAllFindings);
router.get('/getAllFindingsByKPPN/:unit?', authenticate, authorize([99, 4, 3, 2, 1]), logActivity(24), alterUnitPayload, findingsController.getAllFindingsByKPPN);
router.get('/getFindingsById/:findingsId', authenticate, authorize([99, 4, 3, 2, 1]), logActivity(22), findingsController.getFindingsById);
router.get('/getDerivedFindings/:unit?/:period?', authenticate, authorize([99, 4, 3, 2, 1]), logActivity(22), alterUnitPayload, alterPeriodPayload, findingsController.getDerived);
router.post('/createFindings', authenticate, authorize([99, 4]), logActivity(25), findingsController.addFindings);
router.post('/updateFindingsScore', authenticate, authorize([99, 4, 2]), logActivity(26), findingsController.updateFindingsScore);
router.post('/updateFindingsResponse', authenticate, authorize([99, 4, 2]), logActivity(27), findingsController.updateFindingsResponse);
router.post('/updateFindingStatus', authenticate, authorize([99, 4, 2]), logActivity(28), findingsController.updateFindingStatus);

export default router
