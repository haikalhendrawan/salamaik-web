import express from "express";
import * as activityController from "../controller/activity.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";


const router = express.Router(); 

router.get("/getAllActivityWithLimit", authenticate, authorize([99, 4]), activityController.getAllActivityLimited);
router.get("/getActivityById/:activityType", authenticate, authorize([99, 4]), activityController.getActivityById);
router.get("/getActivityByUser/:userId", authenticate, authorize([99, 4]), activityController.getActivityByUser);
router.get("/getActivityByCluster/:cluster", authenticate, authorize([99, 4]), activityController.getActivityByCluster);
router.post("/createActivity", authenticate, authorize([99, 4, 3, 2, 1]), activityController.createActivity);
router.post("/deleteActivity/:id", authenticate, authorize([99, 4]), activityController.deleteActivity);

export default router