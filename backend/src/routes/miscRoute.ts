/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import express from "express";
import * as miscController from "../controller/misc.controller";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";


const router = express.Router(); 

router.get("/getMiscByType/:miscId", authenticate, authorize([99, 4, 3, 2, 1]), miscController.getMiscByType);
router.post("/addGallery", authenticate, authorize([99, 4, 3, 2, 1]), miscController.addGallery);
router.post("/deleteGallery/:id", authenticate, authorize([99, 4, 3, 2, 1]), miscController.deleteMisc);


export default router