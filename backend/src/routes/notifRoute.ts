import express from "express";
import * as notifController from "../controller/notif.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router = express.Router(); 

router.get("/getNotif", authenticate, notifController.getNotif);
router.get("/getNotifById", authenticate, notifController.getNotifById);
router.post("/addNotif", authenticate, authorize([99, 4]), notifController.addNotif);
router.post("/assignNotif", authenticate, authorize([99, 4]), notifController.assignNotif);
router.post("/updateNotif", authenticate, notifController.updateNotif);
router.post("/deleteNotif", authenticate, authorize([99, 4]), notifController.deleteNotif);

export default router
