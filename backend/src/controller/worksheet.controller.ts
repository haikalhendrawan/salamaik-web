/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import {Request, Response, NextFunction} from 'express';
import worksheet, { WorksheetType } from '../model/worksheet.model';
import checklist, { ChecklistType } from '../model/checklist.model';
import wsJunction from '../model/worksheetJunction.model';
import pool from '../config/db';
import dayjs from 'dayjs';
import ErrorDetail from '../model/error.model';
import nonBlockingCall from '../utils/nonBlockingCall';
import activity from '../model/activity.model';
// ------------------------------------------------------
const getAllWorksheet = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.payload.username;
    const ip = req.ip || '';

    const period = req.payload.period;
    const worksheets: WorksheetType[] = await worksheet.getWorksheetByPeriod(period);

    nonBlockingCall(activity.createActivity(username, 71, ip));

    return res.status(200).json({sucess: true, message: 'Get worksheet success', rows: worksheets})
  } catch (err){
    next(err)
  }
}

const getWorksheetByPeriodAndKPPN = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.ip || '';

    const {username, period } = req.payload;
    const {kppnId} = req.params;
    const worksheets: WorksheetType[] = await worksheet.getWorksheetByPeriodAndKPPN(period, kppnId);
    const mainWorksheet = worksheets[0];

    if(worksheets.length === 0) {
      throw new ErrorDetail(400, 'Worksheet not found')
    };

    nonBlockingCall(activity.createActivity(username, 72, ip));

    return res.status(200).json({sucess: true, message: 'Get worksheet success', rows: mainWorksheet})
  }catch(err){
    next(err)
  }
}

const addWorksheet = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.payload.username;
    const ip = req.ip || '';

    const { kppnId, startDate, closeDate, openFollowUp, closeFollowUp } = req.body;
    const isValidDate = validateDates(startDate, closeDate, openFollowUp, closeFollowUp);

    if(!isValidDate.success) {
      return res.status(400).json({sucess: false, message: isValidDate.message})
    };

    const period = req.payload.period;
    const isWorksheetExist = await worksheet.checkWorksheetExist(kppnId, period);

    if(isWorksheetExist) {
      return res.status(400).json({sucess: false, message: 'Worksheet already exist'})
    };

    nonBlockingCall(activity.createActivity(username, 73, ip, `kppnId: ${kppnId}, period: ${period}`));

    const result = await worksheet.addWorksheet(kppnId, period, startDate, closeDate, openFollowUp, closeFollowUp);
    return res.status(200).json({sucess: true, message: 'Add worksheet success', rows: result})
  } catch (err){
    next(err)
  }
}

const assignWorksheet = async(req: Request, res: Response, next: NextFunction) => {
  const client = await pool.connect();
  try {
    const username = req.payload.username;
    const ip = req.ip || '';

    await client.query('BEGIN');
    const { worksheetId, kppnId, period } = req.body;
    const allChecklist: ChecklistType[]  = await checklist.getAllChecklist(client);

    const mapChecklist = Promise.all (allChecklist.map(async(item) => {
        const isExcluded = item.standardisasi;
        await wsJunction.addWsJunction(worksheetId, item.id, kppnId, period, isExcluded, client);
    }));
    
    const result = await worksheet.editWorksheetStatus(worksheetId, client);
    await client.query('COMMIT');

    nonBlockingCall(activity.createActivity(username, 74, ip, worksheetId));

    return res.status(200).json({sucess: true, message: 'Assign worksheet success', rows: result, detail: mapChecklist})
  } catch (err){
    await client.query('ROLLBACK');
    next(err)
  } finally{
    client.release();
  }
}

const editWorksheetPeriod = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const { worksheetId, startDate, closeDate, openFollowUp, closeFollowUp } = req.body;
    const isValidDate = validateDates(startDate, closeDate, openFollowUp, closeFollowUp);

    if(!isValidDate.success) {
      return res.status(400).json({sucess: false, message: isValidDate.message})
    };
    
    nonBlockingCall(activity.createActivity(username, 75, ip, worksheetId));

    const result = await worksheet.editWorksheetPeriod(worksheetId, startDate, closeDate, openFollowUp, closeFollowUp);
    return res.status(200).json({sucess: true, message: 'Edit worksheet period success', rows: result})
  }catch(err){
    next(err)
  }
}

const deleteWorksheet = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const { worksheetId } = req.body;
    const result = await worksheet.deleteWorksheet(worksheetId);

    nonBlockingCall(activity.createActivity(username, 76, ip, worksheetId));

    return res.status(200).json({sucess: true, message: 'Delete worksheet success', rows: result})
  }catch(err){
    next(err)
  }
}

export {
  getAllWorksheet,
  getWorksheetByPeriodAndKPPN,
  addWorksheet,
  assignWorksheet,
  editWorksheetPeriod,
  deleteWorksheet
}

// ------------------------------------------------------------------------------------------------------
function validateDates (startDateStr: string, closeDateStr: string, openFollowUpStr: string, closeFollowUpStr: string){
  const startDate = dayjs(startDateStr);
  const closeDate = dayjs(closeDateStr);
  const openFollowUp = dayjs(openFollowUpStr);
  const closeFollowUp = dayjs(closeFollowUpStr);

  if (!startDate.isValid() || !closeDate.isValid() || !openFollowUp.isValid() || !closeFollowUp.isValid()) {
    return { success: false, message: 'Invalid date format.' };
  }

  if (startDate.isAfter(closeDate)) {
    return { success: false, message: 'Open period must be earlier than close period.' };
  }

  if (openFollowUp.isAfter(closeFollowUp)) {
    return { success: false, message: 'Open period tindak lanjut must be earlier than close period tindak lanjut.' };
  }

  if (openFollowUp.isBefore(closeDate)) {
    return { success: false, message: 'Open period tindak lanjut must happen after close period.' };
  }

  return { success: true };
};