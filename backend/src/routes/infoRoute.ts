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
 
 
 const router = express.Router(); 
 
 router.get("/getByKPPN/:unit?/:period?", authenticate, authorize([99, 4, 3, 2 , 1]), alterPeriodPayload, alterUnitPayload, infoController.getByKPPN);
 
 export default router