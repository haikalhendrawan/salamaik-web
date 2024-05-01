import express from "express";
import * as profileController from "../controller/profile.controller";
import authenticate from "../middleware/authenticate";

const router = express.Router(); 

router.post("/updateCommonProfile", authenticate, profileController.updateCommonProfile);
router.post("/updatePassword", authenticate, profileController.updatePassword);
router.post("/updateProfilePicture", authenticate, profileController.updateProfilePicture);

export default router