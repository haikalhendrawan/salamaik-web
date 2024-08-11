import {Request, Response, NextFunction} from 'express';
import findings from '../model/findings.model';
import matrix from '../model/matrix.model';
import worksheet, { WorksheetType } from '../model/worksheet.model';
import ErrorDetail from '../model/error.model';
import { MatrixWithWsJunctionType } from '../model/matrix.model';
import { FindingsType } from '../model/findings.model';
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