import * as findingsController from '../controller/findings.controller';
import { Router } from 'express';

const router = Router();

router.get('/getFindingsByWorksheetId', findingsController.getFindingsByWorksheetId);
router.post('/createFindings', findingsController.addFindings);


export default router
