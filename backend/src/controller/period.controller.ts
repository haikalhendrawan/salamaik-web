import {Request, Response, NextFunction} from 'express';
import period from '../model/period.model';
import nonBlockingCall from '../utils/nonBlockingCall';
import activity from '../model/activity.model';
// -------------------------------------------------
interface PeriodType{
  id: number;
  name: string; 
  even_period: 0;
  semester: number;
  tahun: number
}
// ------------------------------------------------------
const getAllPeriod = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.payload.username;
    const ip = req.ip || '';

    const result: PeriodType[] = await period.getAllPeriod();

    nonBlockingCall(activity.createActivity(username, 47, ip));

    return res.status(200).json({sucess: true, message: 'Get period success', rows: result});
  } catch (err) {
    next(err);
  }
}

const getPeriodById = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const periodID = req.payload.period; 
    const result = await period.getPeriodById(periodID);

    nonBlockingCall(activity.createActivity(username, 48, ip));

    return res.status(200).json({sucess: true, message: 'Get period success', rows: result});
  } catch (err) {
    next(err);
  }
}

const addPeriod = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const {semester, tahun} = req.body;
    const isPeriodExist = await period.checkPeriodExist(semester, tahun);
    
    if(isPeriodExist) {
      return res.status(400).json({sucess: false, message: 'Period already exist'});
    };

    const result = await period.addPeriod(semester, tahun);

    nonBlockingCall(activity.createActivity(username, 49, ip, `${semester} ${tahun}`));

    return res.status(200).json({sucess: true, message: 'Add period success', rows: result});
  }catch(err){
    next(err);
  }
}

const deletePeriodById = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const {periodId} = req.body;
    const result = await period.deletePeriodById(periodId);

    nonBlockingCall(activity.createActivity(username, 50, ip, periodId));

    return res.status(200).json({sucess: true, message: 'Delete period success', rows: result});
  }catch(err){
    next(err);
  }
}

export { getAllPeriod, getPeriodById, addPeriod, deletePeriodById }