import {Request, Response, NextFunction} from 'express';
import checklist from "../model/checklist.model";


const getAllChecklist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await checklist.getAllChecklist();
    return res.status(200).json({sucess: true, message: 'Get komponen success', rows: result});
  } catch (err) {
    next(err);
  }
}

const getAllOpsi = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await checklist.getAllOpsi();
    return res.status(200).json({sucess: true, message: 'Get komponen success', rows: result});
  } catch (err) {
    next(err);
  }
}


export {getAllChecklist, getAllOpsi}