/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import * as matrixController from '../controller/matrix.controller';
import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import logActivity from '../middleware/logActivity';

const router = Router();

router.get('/getMatrixByWorksheetId/:id', authenticate, authorize([99, 4, 3, 2, 1]), logActivity(32), matrixController.getMatrixByWorksheetId);
router.get('/getMatrixWithWsDetailById/:kppnId', authenticate, authorize([99, 4, 3, 2, 1]), logActivity(33), matrixController.getMatrixWithWsDetailById);
router.post('/createMatrix', authenticate, authorize([99, 4]), logActivity(34), matrixController.createMatrix);
router.post('/updateMatrix', authenticate, authorize([99, 4, 3]), logActivity(36), matrixController.updateMatrix);
router.post('/reAssignMatrix', authenticate, authorize([99, 4, 3]), logActivity(35), matrixController.reAssignMatrix);
router.post('/deleteMatrix', authenticate, authorize([99, 4]), logActivity(37), matrixController.deleteMatrix);


export default router