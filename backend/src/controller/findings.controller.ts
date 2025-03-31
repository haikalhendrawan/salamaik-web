/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import {Request, Response, NextFunction} from 'express';
import findings from '../model/findings.model';
import matrix from '../model/matrix.model';
import worksheet, { WorksheetType } from '../model/worksheet.model';
import ErrorDetail from '../model/error.model';
import pool from '../config/db';
import { MatrixWithWsJunctionType } from '../model/matrix.model';
import nonBlockingCall from '../utils/nonBlockingCall';
import activity from '../model/activity.model';
// ---------------------------------------------------------------------------------------------------
interface FindingsResponseType{
  id: number,
  ws_junction_id: number,
  worksheet_id: string,
  checklist_id: number,
  matrix_id: number, 
  kppn_reponse: string,
  kanwil_response: string,
  score_before: number,
  score_after: number,
  last_update: string,
  updated_by: string,
  matrixDetail: MatrixWithWsJunctionType[],
};

// ---------------------------------------------------------------------------------------------------
const getFindingsByWorksheetId = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const ip = req.ip || '';

    const {kppnId} = req.params;
    const {username, period}  = req.payload;
    const allWorksheet = await worksheet.getWorksheetByPeriodAndKPPN(period, kppnId); 

    if(allWorksheet.length === 0){
      throw new ErrorDetail(404, 'Worksheet not found');
    };

    const worksheetId = allWorksheet[0].id;
    const allFindings = await findings.getFindingsByWorksheetId(worksheetId);

    const matrixDetail = await matrix.getMatrixWithWsJunction(worksheetId);
    const responseBody: FindingsResponseType[] = allFindings.map((item) => {
      return{
        ...item,
        matrixDetail: matrixDetail?.filter((mx) => mx?.id === item?.matrix_id) || [],
      }
    });

    nonBlockingCall(activity.createActivity(username, 22, ip));

    return res.status(200).json({sucess: true, message: 'Get findings success', rows: responseBody})
  }catch(err){
    next(err)
  }
}

const getAllFindings = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const allFindings = await findings.getAllFindingsWithChecklistDetail();

    nonBlockingCall(activity.createActivity(username, 23, ip));

    return res.status(200).json({sucess: true, message: 'Get all findings success', rows: allFindings})
  }catch(err){
    next(err)
  }
}

const getAllFindingsByKPPN = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ip = req.ip || '';

    const {username, kppn} = req.payload;
    const allFindings = await findings.getAllFindingsWithChecklistDetailByKPPN(kppn);

    nonBlockingCall(activity.createActivity(username, 24, ip));

    return res.status(200).json({sucess: true, message: 'Get all findings success', rows: allFindings})
  }catch(err){
    next(err)
  }
}

const getFindingsById = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const ip = req.ip || '';

    const {findingsId} = req.params;
    const {username, role, kppn}  = req.payload;
    const isKanwil = [3, 4, 99].includes(role);
    const allFindings = await findings.getFindingsById(Number(findingsId));

    if(allFindings.length === 0){
      throw new ErrorDetail(404, 'Permasalahan tidak ditemukan');
    };

    const worksheetId = allFindings[0].worksheet_id;
    const worksheetDetail = await worksheet.getById(worksheetId);
    const worksheetOwnedBy = worksheetDetail[0].kppn_id;

    if(!isKanwil && (worksheetOwnedBy !== kppn)){
      throw new ErrorDetail(401, 'Not authorized');
    };
    
    const matrixDetail = await matrix.getMatrixWithWsJunction(worksheetId);
    const responseBody: FindingsResponseType[] = allFindings.map((item) => {
      return{
        ...item,
        matrixDetail: matrixDetail?.filter((mx) => mx?.id === item?.matrix_id) || [],
      }
    });

    nonBlockingCall(activity.createActivity(username, 22, ip));

    return res.status(200).json({sucess: true, message: 'Get findings success', rows: responseBody})
  }catch(err){
    next(err)
  }
}

const addFindings = async (req: Request, res: Response, next: NextFunction) => {
  try{
    // const {worksheetId, wsJunctionId, checklistId, matrixId, scoreBefore} = req.body;
    const username = req.payload.username;
    const ip = req.ip || '';

    const result = await findings.createFindings(req.body);

    nonBlockingCall(activity.createActivity(username, 25, ip));

    return res.status(200).json({sucess: true, message: 'Add findings success', rows: result})
  }catch(err){
    next(err)
  }
}

const updateFindingsScore = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const {id, scoreBefore, scoreAfter, userName} = req.body;
    const result = await findings.updateFindingsScore(id, scoreBefore, scoreAfter, userName);

    nonBlockingCall(activity.createActivity(username, 26, ip, {'id': id, 'score': scoreAfter}));

    return res.status(200).json({sucess: true, message: 'Score has been updated', rows: result})
  }catch(err){
    next(err)
  }
}

const updateFindingsResponse = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.connect();
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    await connection.query('BEGIN');
    const {id, kppnResponse, kanwilResponse, userName, matrixId} = req.body;
    const result = await findings.updateFindingsResponse(id, kppnResponse, kanwilResponse, userName);
    const matrixResult = await matrix.updateMatrixTindakLanjut(matrixId, kanwilResponse, connection);
    await connection.query('COMMIT');

    nonBlockingCall(activity.createActivity(username, 27, ip, {'id': id, 'responseKanwil': kanwilResponse, 'responseKppn': kppnResponse}));

    return res.status(200).json({sucess: true, message: 'Response has been updated  ', rows: {result, matrixResult}})
  }catch(err){
    await connection.query('ROLLBACK');
    next(err)
  }{
    connection.release();
  }
}

const updateFindingStatus = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const ip = req.ip || '';

    const {username, role} = req.payload;
    const {id, status, userName} = req.body;

    const currentFinding = await findings.getFindingsById(id);
    if(currentFinding.length === 0){
      throw new ErrorDetail(404, 'Findings not found');
    };

    const currentStatus = currentFinding[0].status;
    const isVerifiedToUpdateStatus =  verifyUpdateFindingStatus(role, currentStatus, status);

    if(!isVerifiedToUpdateStatus){
      throw new ErrorDetail(403, 'Not Authorized to update status');
    };

    const result = await findings.updateFindingStatus(id, status, userName);

    nonBlockingCall(activity.createActivity(username, 28, ip, {'id': id, 'status': status}));

    return res.status(200).json({sucess: true, message: 'Status has been updated', rows: result})
  }catch(err){
    next(err)
  }
}

export {getFindingsByWorksheetId, getAllFindings, getAllFindingsByKPPN, getFindingsById, updateFindingsScore, addFindings, updateFindingsResponse, updateFindingStatus}

// ---------------------------------------------------------------------------------------------------
function verifyUpdateFindingStatus(role: number, oldStatus: number, newStatus: number){
  // utk filter out user biasa di middleware
  // passed from middleware sudah only admin kppn dan admin kanwil

  const isAdminKanwil = role === 4 || role === 99;

  if(newStatus === 1 && (oldStatus === 2 || oldStatus===3)){
    if(!isAdminKanwil){
      return false
    }
  };

  if(newStatus ===2 || newStatus === 3){
    if(!isAdminKanwil){
      return false
    }
  };


  return true
}