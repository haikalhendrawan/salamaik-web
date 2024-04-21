import express from "express";
import * as notifController from "../controller/notif.controller";

const router = express.Router(); 

router.get("/getNotif", notifController.getNotif);
router.get("/getNotifById", notifController.getNotifById);
router.post("/addNotif", notifController.addNotif);
router.post("/assignNotif", notifController.assignNotif);
router.post("/updateNotif", notifController.updateNotif);

export default router
