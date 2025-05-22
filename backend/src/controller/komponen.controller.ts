/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import {Request, Response, NextFunction} from 'express';
import {komponen, subKomponen, subSubKomponen} from '../model/komponen.model';
// -------------------------------------------------

// ------------------------------------------------------
const getAllKomponen= async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await komponen.getAllKomponen();

    return res.status(200).json({sucess: true, message: 'Get komponen success', rows: result});
  } catch (err) {
    next(err);
  }
}

const getAllSubKomponen= async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await subKomponen.getAllSubKomponen();

    return res.status(200).json({sucess: true, message: 'Get sub komponen success', rows: result});
  } catch (err) {
    next(err);
  }
}

const getAllSubSubKomponen= async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await subSubKomponen.getAllSubSubKomponen();

    return res.status(200).json({sucess: true, message: 'Get sub sub komponen success', rows: result});
  } catch (err) {
    next(err);
  }
}



export { getAllKomponen, getAllSubKomponen, getAllSubSubKomponen }