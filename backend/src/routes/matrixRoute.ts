import * as matrixController from '../controller/matrix.controller';
import { Router } from 'express';

const router = Router();

router.get('/getMatrixByWorksheetId/:id', matrixController.getMatrixByWorksheetId);
router.post('/createMatrix', matrixController.createMatrix);
router.post('/updateMatrix', matrixController.updateMatrix);
router.post('/deleteMatrix', matrixController.deleteMatrix);


export default router