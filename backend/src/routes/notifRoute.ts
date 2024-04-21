import express from "express";
import { getNotif, getNotifById, addNotif, assignNotif, updateNotif } from "../controller/notif.controller";

const router = express.Router(); 

router.get("/getNotif", getNotif);
router.get("/getNotifById", getNotifById);
router.post("/addNotif", addNotif);
router.post("/assignNotif", assignNotif);
router.post("/updateNotif", updateNotif);

export default router
