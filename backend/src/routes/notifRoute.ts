/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import express from "express";
import * as notifController from "../controller/notif.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import logActivity from "../middleware/logActivity";

const router = express.Router(); 

router.get("/getNotif", authenticate, logActivity(41), notifController.getNotif);
router.get("/getNotifById", authenticate, logActivity(42), notifController.getNotifById);
router.post("/addNotif", authenticate, authorize([99, 4]), logActivity(43), notifController.addNotif);
router.post("/assignNotif", authenticate, authorize([99, 4]), logActivity(44), notifController.assignNotif);
router.post("/updateNotif", authenticate, logActivity(45), notifController.updateNotif);
router.post("/deleteNotif", authenticate, authorize([99, 4]), logActivity(46), notifController.deleteNotif);

export default router
