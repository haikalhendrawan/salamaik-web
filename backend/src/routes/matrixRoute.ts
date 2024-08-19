import * as matrixController from '../controller/matrix.controller';
import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';

const router = Router();

router.get('/getMatrixByWorksheetId/:id', authenticate, authorize([99, 4, 3, 2, 1]), matrixController.getMatrixByWorksheetId);
router.get('/getMatrixWithWsDetailById/:kppnId', authenticate, authorize([99, 4, 3, 2, 1]), matrixController.getMatrixWithWsDetailById);
router.post('/createMatrix', authenticate, authorize([99, 4]), matrixController.createMatrix);
router.post('/updateMatrix', authenticate, authorize([99, 4, 3]), matrixController.updateMatrix);
router.post('/reAssignMatrix', authenticate, authorize([99, 4, 3]), matrixController.reAssignMatrix);
router.post('/deleteMatrix', authenticate, authorize([99, 4]), matrixController.deleteMatrix);


export default router