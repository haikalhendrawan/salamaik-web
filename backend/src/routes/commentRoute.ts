/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import * as commentController from '../controller/comment.controller';
import { Router } from 'express';
import authenticate from '../middleware/authenticate';

const router = Router();

router.get('/getByWsJunctionId/:wsJunctionId',  authenticate, commentController.getByWsJunctionId);
router.post('/add', authenticate, commentController.add);

export default router


