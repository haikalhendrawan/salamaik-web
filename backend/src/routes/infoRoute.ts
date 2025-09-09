/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

 import express from "express";
 import * as infoController from "../controller/info.controller";
 import authenticate from "../middleware/authenticate";
 import authorize from "../middleware/authorize";
 import alterUnitPayload from "../middleware/alterUnitPayload";
 import alterPeriodPayload from "../middleware/alterPeriodPayload";
 import logActivity from "../middleware/logActivity";
 
 
 const router = express.Router(); 
 
 router.get("/getByKPPN/:unit?/:period?", authenticate, authorize([99, 4, 3, 2 , 1]), logActivity(94), alterPeriodPayload, alterUnitPayload, infoController.getByKPPN);
 
 export default router