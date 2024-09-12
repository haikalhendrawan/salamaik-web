/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import {Request, Response, NextFunction} from 'express';
import {komponen, subKomponen, subSubKomponen} from '../model/komponen.model';
import nonBlockingCall from '../utils/nonBlockingCall';
import activity from '../model/activity.model';
// -------------------------------------------------

// ------------------------------------------------------
const getAllKomponen= async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.payload.username;
    const ip = req.ip || '';

    const result = await komponen.getAllKomponen();

    nonBlockingCall(activity.createActivity(username, 29, ip));

    return res.status(200).json({sucess: true, message: 'Get komponen success', rows: result});
  } catch (err) {
    next(err);
  }
}

const getAllSubKomponen= async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.payload.username;
    const ip = req.ip || '';

    const result = await subKomponen.getAllSubKomponen();

    nonBlockingCall(activity.createActivity(username, 30, ip));

    return res.status(200).json({sucess: true, message: 'Get sub komponen success', rows: result});
  } catch (err) {
    next(err);
  }
}

const getAllSubSubKomponen= async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.payload.username;
    const ip = req.ip || '';

    const result = await subSubKomponen.getAllSubSubKomponen();

    nonBlockingCall(activity.createActivity(username, 31, ip));

    return res.status(200).json({sucess: true, message: 'Get sub sub komponen success', rows: result});
  } catch (err) {
    next(err);
  }
}



export { getAllKomponen, getAllSubKomponen, getAllSubSubKomponen }