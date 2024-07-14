import {Request, Response, NextFunction} from 'express';
import wsJunction from '../model/worksheetJunction.model';
import worksheet from '../model/worksheet.model';
import ErrorDetail from '../model/error.model';

// -------------------------------------------------
interface WorksheetJunctionType{
  junction_id: number,
  worksheet_id: string,
  checklist_id: number,
  kanwil_score: number,
  kppn_score: number,
  file_1: string,
  file_2: string,
  file_3: string,
  kanwil_note: string,
  kppn_id: string,
  period: string
}
// ------------------------------------------------------

const getWsJunctionByWorksheetForKPPN = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {kppn, period} = req.payload;
    const worksheetData = await worksheet.getWorksheetByPeriodAndKPPN(period, kppn);
    const worksheetId = worksheetData.length>0? worksheetData[0].id : null;

    if(!worksheetId) {
      throw new ErrorDetail(404, 'Worksheet not found');
    };

    const result: WorksheetJunctionType[] = await wsJunction.getWsJunctionByWorksheetId(worksheetId);
    return res.status(200).json({sucess: true, message: 'Get worksheet junction success', rows: result})
  }catch(err){
    next(err);
  }
}

const getWsJunctionByWorksheetForKanwil = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const kppn = req.body;
    const {period} = req.payload;
    const worksheetData = await worksheet.getWorksheetByPeriodAndKPPN(period, kppn);
    const worksheetId = worksheetData.length>0? worksheetData[0].id : null;

    if(!worksheetId) {
      throw new ErrorDetail(404, 'Worksheet not found');
    };

    const result: WorksheetJunctionType[] = await wsJunction.getWsJunctionByWorksheetId(worksheetId);
    return res.status(200).json({sucess: true, message: 'Get worksheet junction success', rows: result})
  }catch(err){
    next(err);
  }
}

const getWsJunctionByPeriod = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const period = req.body;
    const result: WorksheetJunctionType[] = await wsJunction.getWsJunctionByPeriod(period);
    return res.status(200).json({sucess: true, message: 'Get worksheet junction success', rows: result})
  }catch(err){
    next(err);
  }
}

const getWsJunctionByKPPN = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const kppn = req.body;
    const result: WorksheetJunctionType[] = await wsJunction.getWsJunctionByKPPN(kppn);
    return res.status(200).json({sucess: true, message: 'Get worksheet junction success', rows: result})
  }catch(err){
    next(err);
  }
}

const editWsJunctionKPPNScore = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {worksheetId, junctionId, kppnScore} = req.body;
    const result = await wsJunction.editWsJunctionKPPNScore(worksheetId, junctionId, kppnScore);
    return res.status(200).json({sucess: true, message: 'Edit worksheet junction success', rows: result})
  }catch(err){
    next(err);
  }
}

//protect endpoint di middleware
const editWsJunctionKanwilScore = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {worksheetId, junctionId, kanwilScore} = req.body;
    const result = await wsJunction.editWsJunctionKanwilScore(worksheetId, junctionId, kanwilScore);
    return res.status(200).json({sucess: true, message: 'Edit worksheet junction success', rows: result})
  }catch(err){
    next(err);
  }
}

//protect endpoint di middleware
const editWsJunctionKanwilNote = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {worksheetId, junctionId, kanwilNote} = req.body; 
    const result = await wsJunction.editWsJunctionKanwilNote(worksheetId, junctionId, kanwilNote);
    return res.status(200).json({sucess: true, message: 'Edit worksheet junction success', rows: result})
  }catch(err){
    next(err);
  }
}

const editWsJunctionFile = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {worksheetId, junctionId, file1, file2, file3} = req.body; 
    const result = await wsJunction.editWsJunctionFile(worksheetId, junctionId, file1, file2, file3);
    return res.status(200).json({sucess: true, message: 'Edit worksheet junction success', rows: result})
  }catch(err){
    next(err);
  }
}

//protect endpoint di middleware
const deleteWsJunctionByWorksheetId = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {worksheetId} = req.body; 
    const result = await wsJunction.deleteWsJunctionByWorksheetId(worksheetId);
    return res.status(200).json({sucess: true, message: 'Delete worksheet junction success', rows: result})
  }catch(err){
    next(err);
  }
}