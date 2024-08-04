import {Request, Response, NextFunction} from 'express';
import worksheet, { WorksheetType } from '../model/worksheet.model';
import checklist, { ChecklistType } from '../model/checklist.model';
import wsJunction from '../model/worksheetJunction.model';
import pool from '../config/db';
// ------------------------------------------------------

const getAllWorksheet = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const period = req.payload.period;
    const worksheets: WorksheetType[] = await worksheet.getWorksheetByPeriod(period);

    return res.status(200).json({sucess: true, message: 'Get worksheet success', rows: worksheets})
  } catch (err){
    next(err);
  }
}

const addWorksheet = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { kppnId, startDate, closeDate, openFollowUp, closeFollowUp } = req.body;
    const period = req.payload.period;
    const isWorksheetExist = await worksheet.checkWorksheetExist(kppnId, period);

    if(isWorksheetExist) {
      return res.status(400).json({sucess: false, message: 'Worksheet already exist'})
    };

    const result = await worksheet.addWorksheet(kppnId, period, startDate, closeDate, openFollowUp, closeFollowUp);
    return res.status(200).json({sucess: true, message: 'Add worksheet success', rows: result})
  } catch (err){
    next(err);
  }
}

const assignWorksheet = async(req: Request, res: Response, next: NextFunction) => {
  const client = await pool.connect();
  await client.query('BEGIN');

  try {
    const { worksheetId, kppnId, period } = req.body;
    const allChecklist: ChecklistType[]  = await checklist.getAllChecklist(client);

    const mapChecklist = Promise.all (allChecklist.map(async(item) => {
        await wsJunction.addWsJunction(worksheetId, item.id, kppnId, period, client);
    }));
    
    const result = await worksheet.editWorksheetStatus(worksheetId, client);
    await client.query('COMMIT');
    return res.status(200).json({sucess: true, message: 'Assign worksheet success', rows: result, detail: mapChecklist})
  } catch (err){
    await client.query('ROLLBACK');
    next(err);
  } finally{
    client.release();
  }
}

const editWorksheetPeriod = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const { worksheetId, startDate, closeDate, openFollowUp, closeFollowUp } = req.body;
    const result = await worksheet.editWorksheetPeriod(worksheetId, startDate, closeDate, openFollowUp, closeFollowUp);
    return res.status(200).json({sucess: true, message: 'Edit worksheet period success', rows: result})
  }catch(err){
    next(err);
  }
}

const deleteWorksheet = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const { worksheetId } = req.body;
    const result = await worksheet.deleteWorksheet(worksheetId);
    return res.status(200).json({sucess: true, message: 'Delete worksheet success', rows: result})
  }catch(err){
    next(err);
  }
}


export {
  getAllWorksheet,
  addWorksheet,
  assignWorksheet,
  editWorksheetPeriod,
  deleteWorksheet
}