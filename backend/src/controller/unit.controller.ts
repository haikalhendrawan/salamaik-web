/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import {Request, Response, NextFunction} from 'express';
import unit from '../model/unit.model';
import nonBlockingCall from '../utils/nonBlockingCall';
import activity from '../model/activity.model';
// -------------------------------------------------
interface UnitType{
  id: string;
  name: string;
  alias: string;
  kk_name: string;
  kk_nip: string;
  info: string;
  col_order: number;
  level: number;
};
// ------------------------------------------------------
const getAllUnit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.payload.username;
    const ip = req.ip || '';

    const units: UnitType[] = await unit.getAllUnit();

    nonBlockingCall(activity.createActivity(username, 62, ip));

    return res.status(200).json({sucess: true, message: 'Get unit success', rows: units});
  } catch (err) {
    next(err);
  }
}

const getUnitById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.payload.username;
    const ip = req.ip || '';

    const unitID = req.payload.kppn;
    const units = await unit.getUnitById(unitID);

    nonBlockingCall(activity.createActivity(username, 63, ip));

    return res.status(200).json({sucess: true, message: 'Get unit success', rows: units});
  } catch (err) {
    next(err);
  }
}

export { getAllUnit, getUnitById }