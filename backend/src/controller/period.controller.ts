import {Request, Response, NextFunction} from 'express';
import period from '../model/period.model';
// -------------------------------------------------
interface PeriodType{
  id: number;
  name: string; 
  isEven: 0;
  semester: number;
  tahun: string
}
// ------------------------------------------------------
const getAllPeriod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result: PeriodType[] = await period.getAllPeriod();
    return res.status(200).json({sucess: true, message: 'Get period success', rows: result});
  } catch (err) {
    next(err);
  }
}

const getPeriodById = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const periodID = req.payload.period; 
    const result = await period.getPeriodById(periodID);
    return res.status(200).json({sucess: true, message: 'Get period success', rows: result});
  } catch (err) {
    next(err);
  }
}

export { getAllPeriod, getPeriodById }