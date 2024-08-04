import {Request, Response, NextFunction} from 'express';
import period from '../model/period.model';
// -------------------------------------------------
interface PeriodType{
  id: number;
  name: string; 
  isEven: 0;
  semester: number;
  tahun: number
}
// ------------------------------------------------------
const getAllPeriod = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const result: PeriodType[] = await period.getAllPeriod();
    return res.status(200).json({sucess: true, message: 'Get period success', rows: result});
  } catch (err) {
    next(err);
  }
}

const getPeriodById = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const periodID = req.payload.period; 
    const result = await period.getPeriodById(periodID);
    return res.status(200).json({sucess: true, message: 'Get period success', rows: result});
  } catch (err) {
    next(err);
  }
}

const addPeriod = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {semester, tahun} = req.body;
    const isPeriodExist = await period.checkPeriodExist(semester, tahun);
    
    if(isPeriodExist) {
      return res.status(400).json({sucess: false, message: 'Period already exist'});
    };

    const result = await period.addPeriod(semester, tahun);
    return res.status(200).json({sucess: true, message: 'Add period success', rows: result});
  }catch(err){
    next(err);
  }
}

const deletePeriodById = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {periodId} = req.body;
    const result = await period.deletePeriodById(periodId);
    return res.status(200).json({sucess: true, message: 'Delete period success', rows: result});
  }catch(err){
    next(err);
  }
}

export { getAllPeriod, getPeriodById, addPeriod, deletePeriodById }