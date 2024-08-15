import express from "express";
import * as profileController from "../controller/profile.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router = express.Router(); 

router.post("/updateCommonProfile", authenticate, authorize([99, 4, 3, 2, 1]), profileController.updateCommonProfile);
router.post("/updatePassword", authenticate, authorize([99, 4, 3, 2, 1]), profileController.updatePassword);
router.post("/updateProfilePicture", authenticate, authorize([99, 4, 3, 2, 1]), profileController.updateProfilePicture);

export default router