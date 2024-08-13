import {Request, Response, NextFunction} from 'express';
import findings from '../model/findings.model';
import matrix from '../model/matrix.model';
import worksheet, { WorksheetType } from '../model/worksheet.model';
import ErrorDetail from '../model/error.model';
import { MatrixWithWsJunctionType } from '../model/matrix.model';
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
    const {kppnId} = req.params;
    const {period}  = req.payload;
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
    return res.status(200).json({sucess: true, message: 'Get findings success', rows: responseBody})
  }catch(err){
    next(err)
  }
}

const getAllFindings = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const allFindings = await findings.getAllFindingsWithChecklistDetail();
    return res.status(200).json({sucess: true, message: 'Get all findings success', rows: allFindings})
  }catch(err){
    next(err)
  }
}

const getAllFindingsByKPPN = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {kppn} = req.payload;
    const allFindings = await findings.getAllFindingsWithChecklistDetailByKPPN(kppn);
    return res.status(200).json({sucess: true, message: 'Get all findings success', rows: allFindings})
  }catch(err){
    next(err)
  }
}

const addFindings = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const {worksheetId, wsJunctionId, checklistId, matrixId, scoreBefore} = req.body;
    const result = await findings.createFindings(req.body);
    return res.status(200).json({sucess: true, message: 'Add findings success', rows: result})
  }catch(err){
    next(err)
  }
}

const updateFindingsScore = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const {id, scoreBefore, scoreAfter, userName} = req.body;
    const result = await findings.updateFindingsResponse(id, scoreBefore, scoreAfter, userName);
    return res.status(200).json({sucess: true, message: 'Score has been updated', rows: result})
  }catch(err){
    next(err)
  }
}

const updateFindingsResponse = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const {id, kppnResponse, kanwilResponse, userName} = req.body;
    const result = await findings.updateFindingsResponse(id, kppnResponse, kanwilResponse, userName);
    return res.status(200).json({sucess: true, message: 'Response has been updated  ', rows: result})
  }catch(err){
    next(err)
  }
}

const updateFindingStatus = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {kppn, role} = req.payload;
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
    return res.status(200).json({sucess: true, message: 'Status has been updated', rows: result})
  }catch(err){
    next(err)
  }
}

export {getFindingsByWorksheetId, getAllFindings, getAllFindingsByKPPN, updateFindingsScore, addFindings, updateFindingsResponse, updateFindingStatus}


function verifyUpdateFindingStatus(role: number, oldStatus: number, newStatus: number){
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

  // utk filter out user biasa di middleware
  // passed from middleware sudah only admin kppn dan admin kanwil

  return true
}