import { Request, Response, NextFunction } from "express";
import ErrorDetail from "../model/error.model";
import {superAdmin, adminKanwil, userKanwil} from '../config/role';

export default function alterPeriodPayload(req: Request, res: Response, next: NextFunction) {
  const postedPeriod = req.params.period ?? '';

  if(!postedPeriod || postedPeriod === ''){
    return next();
  };

  const role = req.payload.role;

  if(role === superAdmin || role === adminKanwil || role === userKanwil){
    req.payload.period = Number(postedPeriod);
  };

  next();
}