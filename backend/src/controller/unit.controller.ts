import {Request, Response, NextFunction} from 'express';
import unit from '../model/unit.model';

const getAllUnit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const units = await unit.getAllUnit();
    return res.status(200).json({sucess: true, message: 'Get unit success', rows: units});
  } catch (err) {
    next(err);
  }
}

const getUnitById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unitID = req.payload.kppn;
    const units = await unit.getUnitById(unitID);
    return res.status(200).json({sucess: true, message: 'Get unit success', rows: units});
  } catch (err) {
    next(err);
  }
}

export { getAllUnit, getUnitById }