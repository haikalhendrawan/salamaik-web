/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

 import express from "express";
 import * as peraturanController from "../controller/peraturan.controller";
 import authenticate from "../middleware/authenticate";
 import authorize from "../middleware/authorize";
 import logActivity from "../middleware/logActivity";
 
 const router = express.Router(); 
 
 router.get("/getAllPeraturan", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(95), peraturanController.getAll);
 router.get("/getPeraturanById/:id", authenticate, authorize([99, 4, 3, 2, 1]), logActivity(96), peraturanController.getById);
 router.post("/addPeraturan", authenticate, authorize([99, 4]), logActivity(97), peraturanController.create);
 router.post("/editPeraturan", authenticate, authorize([99, 4]), logActivity(98), peraturanController.edit);
 router.get("/deletePeraturan/:id", authenticate, authorize([99, 4]), logActivity(99), peraturanController.deleteById);

 export default router