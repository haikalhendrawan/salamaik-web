import * as findingsController from '../controller/findings.controller';
import { Router } from 'express';
import authenticate from '../middleware/authenticate';

const router = Router();

router.get('/getFindingsByWorksheetId/:kppnId', authenticate, findingsController.getFindingsByWorksheetId);
router.post('/createFindings', authenticate, findingsController.addFindings);


export default router
