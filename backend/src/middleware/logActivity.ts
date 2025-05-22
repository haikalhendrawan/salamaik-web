/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

 import { Request, Response, NextFunction } from 'express';
 import "dotenv/config";
 import activity from '../model/activity.model';
 import nonBlockingCall from '../utils/nonBlockingCall';
 // -------------------------------------------------------------------------------------
 
 //Middleware untuk merekam log activity yang dilakukan user
 const logActivity = (activityId: number) => (req: Request, res: Response, next: NextFunction)=>{               
   const username = req.payload?.username || '';
   const ip = req.ip || '';
   const isPost = req.method === 'POST';
   const detail = isPost ? JSON.parse(req.body) : null;

   nonBlockingCall(activity.createActivity(username, activityId, ip, detail));
  
   return next();
 }
 
 export default logActivity;