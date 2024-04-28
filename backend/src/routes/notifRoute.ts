import express from "express";
import * as notifController from "../controller/notif.controller";
import authenticate from "../middleware/authenticate";

const router = express.Router(); 

router.get("/getNotif", authenticate, notifController.getNotif);
router.get("/getNotifById", authenticate, notifController.getNotifById);
router.post("/addNotif", authenticate, notifController.addNotif);
router.post("/assignNotif", authenticate, notifController.assignNotif);
router.post("/updateNotif", authenticate, notifController.updateNotif);
router.post("/deleteNotif", authenticate, notifController.deleteNotif);

export default router
