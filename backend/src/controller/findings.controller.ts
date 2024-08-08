import {Request, Response, NextFunction} from 'express';
import findings from '../model/findings.model';
// ---------------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------------------
const getFindingsByWorksheetId = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const {worksheetId} = req.body;
    const result = await findings.getFindingsByWorksheetId(worksheetId);
    return res.status(200).json({sucess: true, message: 'Get findings success', rows: result})
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

export {getFindingsByWorksheetId, addFindings}