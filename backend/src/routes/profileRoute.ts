/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import express from "express";
import * as profileController from "../controller/profile.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import logActivity from "../middleware/logActivity";

const router = express.Router(); 

router.post("/updateCommonProfile", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(51), profileController.updateCommonProfile);
router.post("/updatePassword", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(52), profileController.updatePassword);
router.post("/updateProfilePicture", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(53), profileController.updateProfilePicture);

export default router