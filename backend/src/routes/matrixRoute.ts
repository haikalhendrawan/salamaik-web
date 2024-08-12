import * as matrixController from '../controller/matrix.controller';
import { Router } from 'express';
import authenticate from '../middleware/authenticate';

const router = Router();

router.get('/getMatrixByWorksheetId/:id', authenticate, matrixController.getMatrixByWorksheetId);
router.get('/getMatrixWithWsDetailById/:kppnId', authenticate,matrixController.getMatrixWithWsDetailById);
router.post('/createMatrix', authenticate, matrixController.createMatrix);
router.post('/updateMatrix', authenticate, matrixController.updateMatrix);
router.post('/reAssignMatrix', authenticate, matrixController.reAssignMatrix);
router.post('/deleteMatrix', authenticate, matrixController.deleteMatrix);


export default router