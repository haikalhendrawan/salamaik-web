import { Request, Response, NextFunction } from "express";
import ErrorDetail from "../model/error.model";
import {superAdmin, adminKanwil, userKanwil} from '../config/role';

export default function alterUnitPayload(req: Request, res: Response, next: NextFunction) {
  const postedUnit = req.params.unit ?? '';

  if(!postedUnit || postedUnit === ''){
    return next()
  };

  const role = req.payload.role;

  if(role === superAdmin || role === adminKanwil || role === userKanwil){
    req.payload.kppn = postedUnit;
  };

  next();
}