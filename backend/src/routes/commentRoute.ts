/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import * as commentController from '../controller/comment.controller';
import { Router } from 'express';
import authenticate from '../middleware/authenticate';
import logActivity from '../middleware/logActivity';

const router = Router();

router.get('/getByWsJunctionId/:wsJunctionId',  authenticate, commentController.getByWsJunctionId);
router.get('/getByWsSPMLJunctionId/:wsSPMLJunctionId', authenticate, commentController.getByWsSPMLJunctionId);
router.get('/getByWsCKJunctionId/:wsCKJunctionId', authenticate, commentController.getByWsCKJunctionId);
router.post('/add', authenticate, logActivity(92), commentController.add);
router.post('/addSPML', authenticate, logActivity(92), commentController.addSPML);
router.post('/addCK', authenticate, logActivity(92), commentController.addCK);
router.post('/deleteById', authenticate, logActivity(93), commentController.deleteById);

export default router


