/**
 * Salamaik API
 * Worksheet CK junction routes
 */

import express from 'express';
import * as wsCKJunctionController from '../controller/wsCKJunction.controller';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';
import logActivity from '../middleware/logActivity';

const router = express.Router();

router.get(
  '/getProgressAllKPPN',
  authenticate,
  authorize([99, 4, 3]),
  wsCKJunctionController.getProgressAllKPPN
);
router.get(
  '/getWsCKJunctionByWorksheetForKPPN',
  authenticate,
  authorize([99, 4, 3, 2, 1]),
  logActivity(117),
  wsCKJunctionController.getWsCKJunctionByWorksheetForKPPN
);
router.get(
  '/getWsCKJunctionByWorksheetForKanwil',
  authenticate,
  authorize([99, 4, 3]),
  logActivity(118),
  wsCKJunctionController.getWsCKJunctionByWorksheetForKanwil
);
router.post(
  '/editWsCKJunctionFile',
  authenticate,
  authorize([99, 4, 3, 2, 1]),
  logActivity(87),
  wsCKJunctionController.editWsCKJunctionFile
);

export default router;
