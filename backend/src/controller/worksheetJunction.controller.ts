import {Request, Response, NextFunction} from 'express';
import multer from 'multer';
import wsJunction, {WorksheetJunctionType, WsJunctionJoinChecklistType} from '../model/worksheetJunction.model';
import worksheet from '../model/worksheet.model';
import ErrorDetail from '../model/error.model';
import { uploadWsJunctionFile } from '../config/multer';
import fs from 'fs';
import path from 'path';
import { sanitizeMimeType } from '../utils/mimeTypeSanitizer';
import { validateScore } from '../utils/worksheetJunction.utils';
// ------------------------------------------------------
const getWsJunctionByWorksheetForKPPN = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {kppn, period} = req.payload;
    const worksheetData = await worksheet.getWorksheetByPeriodAndKPPN(period, kppn);
    const worksheetId = worksheetData.length>0? worksheetData[0].id : null;

    if(!worksheetId) {
      throw new ErrorDetail(404, 'Worksheet not found');
    };

    const result: WsJunctionJoinChecklistType[] = await wsJunction.getWsJunctionByWorksheetId(worksheetId);
    return res.status(200).json({sucess: true, message: 'Get worksheet junction success', rows: result})
  }catch(err){
    next(err);
  }
}

const getWsJunctionByWorksheetForKanwil = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const kppn = req.query?.kppn?.toString() || "";
    const {period} = req.payload;

    const worksheetData = await worksheet.getWorksheetByPeriodAndKPPN(period, kppn);
    const worksheetId = worksheetData.length>0? worksheetData[0].id : null;

    if(!worksheetId) {
      throw new ErrorDetail(404, 'Worksheet not found');
    };

    const result: WsJunctionJoinChecklistType[] = await wsJunction.getWsJunctionByWorksheetId(worksheetId);

    if(!result || result.length===0) {
      throw new ErrorDetail(404, 'Worksheet not assigned');
    };
    
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
    const {username} = req.payload;
    const {worksheetId, junctionId, kppnScore} = req.body;

    const wsJunctionDetail = await wsJunction.getWsJunctionByJunctionId(junctionId);
    const availableOpsi = wsJunctionDetail?.opsi;
    const isStandardisasi = wsJunctionDetail?.standardisasi===1? true : false;
    const isValidScore = validateScore(kppnScore, availableOpsi, isStandardisasi);

    if(!isValidScore){
      return next(new ErrorDetail(400, 'Score Invalid'));
    };

    const result = await wsJunction.editWsJunctionKPPNScore(worksheetId, junctionId, kppnScore, username);
    return res.status(200).json({sucess: true, message: 'Edit worksheet junction success', rows: result})
  }catch(err){
    next(err);
  }
}

//protect endpoint di route
const editWsJunctionKanwilScore = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {username} = req.payload;
    const {worksheetId, junctionId, kanwilScore} = req.body;

    const wsJunctionDetail = await wsJunction.getWsJunctionByJunctionId(junctionId);
    const availableOpsi = wsJunctionDetail?.opsi;
    const isStandardisasi = wsJunctionDetail?.standardisasi===1? true : false;
    const isValidScore = validateScore(kanwilScore, availableOpsi, isStandardisasi);

    if(!isValidScore){
      return next(new ErrorDetail(400, 'Score Invalid'));
    };

    const result = await wsJunction.editWsJunctionKanwilScore(worksheetId, junctionId, kanwilScore, username);
    return res.status(200).json({sucess: true, message: 'Edit worksheet junction success', rows: result})
  }catch(err){
    next(err);
  }
}

//protect endpoint di route
const editWsJunctionKanwilNote = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {username} = req.payload;
    const {worksheetId, junctionId, kanwilNote} = req.body; 
    const result = await wsJunction.editWsJunctionKanwilNote(worksheetId, junctionId, kanwilNote, username);
    return res.status(200).json({sucess: true, message: 'Edit worksheet junction success', rows: result})
  }catch(err){
    next(err);
  }
}

const editWsJunctionFile = async(req: Request, res: Response, next: NextFunction) => {
  uploadWsJunctionFile(req, res, async (err: any) => {
    if(err instanceof multer.MulterError) {
      if(err.message==='LIMIT FILE SIZE'){
        return next(new ErrorDetail(400, 'File size is too large (max 30mb)'));
      }else{
        return next(err);
      }
    } else if(err) {
      return next(err);
    };

    if(!req.file){
      return next(new ErrorDetail(400, 'File not allowed', err));
    };

    try{
      const {name} = req.payload;
      const {worksheetId, junctionId, checklistId, kppnId, option} = req.body; 
      const fileExt = sanitizeMimeType(req.file.mimetype);
      const fileName = `ch${checklistId}_file${option}_kppn${kppnId}_${worksheetId}.${fileExt}`;

      const result = await wsJunction.editWsJunctionFile(junctionId, worksheetId, fileName, option, name);
      return res.status(200).json({sucess: true, message: 'Edit worksheet junction success', rows: result})
    }catch(err){
      next(err);
    }

  });
}

const deleteWsJunctionFile = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {username} = req.payload;
    const {id, fileName, option} = req.body;
    const result = await wsJunction.deleteWsJunctionFile(id, option, username);

    const filePath = path.join(__dirname,`../uploads/worksheet/`, fileName);
    fs.unlinkSync(filePath);
 

    return res.status(200).json({sucess: true, message: 'file deleted successfully', rows: result});
  }catch(err){
    next(err);
  }
}

//protect endpoint di route
const deleteWsJunctionByWorksheetId = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {worksheetId} = req.body; 
    const result = await wsJunction.deleteWsJunctionByWorksheetId(worksheetId);
    return res.status(200).json({sucess: true, message: 'Delete worksheet junction success', rows: result})
  }catch(err){
    next(err);
  }
}

export {
  getWsJunctionByWorksheetForKPPN, 
  getWsJunctionByWorksheetForKanwil,
  getWsJunctionByPeriod,
  getWsJunctionByKPPN,
  editWsJunctionKPPNScore,
  editWsJunctionKanwilScore,
  editWsJunctionKanwilNote,
  editWsJunctionFile,
  deleteWsJunctionByWorksheetId,
  deleteWsJunctionFile
}