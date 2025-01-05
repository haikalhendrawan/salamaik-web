/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import { Request, Response, NextFunction } from "express";
import * as roles from '../config/role';

export default function alterPeriodPayload(req: Request, res: Response, next: NextFunction) {
  const postedPeriod = req.params.period ?? '';

  if(!postedPeriod || postedPeriod === ''){
    return next();
  };

  const role = req.payload.role;

  if(role === roles.superAdmin || role === roles.adminKanwil || role === roles.userKanwil){
    req.payload.period = Number(postedPeriod);
  };

  next();
}