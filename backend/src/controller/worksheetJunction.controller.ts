import {Request, Response, NextFunction} from 'express';
import multer from 'multer';
import io from '../config/io';
import wsJunction, {WorksheetJunctionType, WsJunctionJoinChecklistType, WsJunctionWithKomponenType} from '../model/worksheetJunction.model';
import worksheet, { WorksheetType } from '../model/worksheet.model';
import { komponen, KomponenWithSubKomponen } from '../model/komponen.model';
import ErrorDetail from '../model/error.model';
import unit from '../model/unit.model';
import period from '../model/period.model';
import { uploadWsJunctionFile } from '../config/multer';
import fs from 'fs';
import path from 'path';
import { sanitizeMimeType } from '../utils/mimeTypeSanitizer';
import { validateScore } from '../utils/worksheetJunction.utils';
import { getScoreForMatrix } from '../utils/getScorePembinaan';
import {UnitType} from '../model/unit.model';

// ------------------------------------------------------------------

interface ScorePerKomponenType{
  komponenId: number,
  komponenTitle: string,
  komponenBobot: number,
  wsJunction: WorksheetJunctionType[],
}
interface WsJunctionScoreAndProgress{
  scoreByKanwil : number,
  scoreByKPPN: number,
  isFinal: boolean,
  totalChecklist: number,
  totalProgressKanwil: number,
  totalProgressKPPN: number,
  scorePerKomponen: ScorePerKomponenType[],
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
    const {period} = req.body;
    const result: WorksheetJunctionType[] = await wsJunction.getWsJunctionByPeriod(period);
    return res.status(200).json({sucess: true, message: 'Get worksheet junction success', rows: result})
  }catch(err){
    next(err);
  }
}

const getWsJunctionByKPPN = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {kppn} = req.body;
    const result: WorksheetJunctionType[] = await wsJunction.getWsJunctionByKPPN(kppn);
    return res.status(200).json({sucess: true, message: 'Get worksheet junction success', rows: result})
  }catch(err){
    next(err);
  }
}

const getWsJunctionScoreAndProgress = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {kppnId, period} = req.body;

    // query #1 get worksheet Id
    const mainWorksheet = await worksheet.getWorksheetByPeriodAndKPPN(period, kppnId);

    if(mainWorksheet.length === 0) {
      throw new ErrorDetail(404, 'Worksheet not found');
    };
    
    // query #2 #3 get komponen dan wsJunction
    const responseBody = await getScoreProgressResponseBody(mainWorksheet);

    return res.status(200).json({sucess: true, message: 'Get worksheet junction success', rows: responseBody})
  }catch(err){
    next(err)
  }
}

const getWsJunctionScoreAndProgressAllKPPN = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {period} = req.payload;
    const allKPPN = await unit.getAllKPPN();

    const result = await Promise.all(allKPPN.map(async(kppn) => {
      // computation sama persis seperti controller sebelumnya dengan perbedaan response body
      const mainWorksheet = await worksheet.getWorksheetByPeriodAndKPPN(period, kppn.id);
      const worksheetId = mainWorksheet.length>0? mainWorksheet[0].id : null;
  
      if(!worksheetId) {
        return {
          ...kppn,
          scoreProgressDetail: null
        }
      };

      return await getScoreProgressResponseBodyAllKPPN(mainWorksheet, kppn);
    }));

    return res.status(200).json({sucess: true, message: 'Get worksheet junction success', rows: result})
  }catch(err){
    next(err)
  }
}


const getWsJunctionScoreAllPeriod = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const allPeriod = await period.getAllPeriod();
    const allKPPN = await unit.getAllKPPN();

    const result = await Promise.all(
      allPeriod.map(async (period) => {
        const kppnResults = await Promise.all(
          allKPPN.map(async (kppn) => {
            const mainWorksheet = await worksheet.getWorksheetByPeriodAndKPPN(period.id, kppn.id);
            return getScoreProgressResponseBodyAllKPPN(mainWorksheet, kppn);
          })
        );

        return {
          ...period,
          kppn: kppnResults,
        };
      })
    );

    return res.status(200).json({ success: true, message: 'Get Score and progress success', rows: result });
  } catch (err) {
    next(err);
  }
};

const getWsJunctionScoreAllPeriodSingleKPPN = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const allPeriod = await period.getAllPeriod();
    const {kppn} = req.payload;


    const result = await Promise.all(
          allPeriod.map(async (period) => {
            const mainWorksheet = await worksheet.getWorksheetByPeriodAndKPPN(period.id, kppn);
            return getScoreProgressResponseBody(mainWorksheet);
          })
        );
    
    return res.status(200).json({ success: true, message: 'Get Score and progress success', rows: result });
  } catch (err) {
    next(err);
  }
};

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

      io.emit('fileHasUpdated', {worksheetId, junctionId, checklistId, kppnId, fileName, option});
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
  getWsJunctionScoreAndProgress,
  getWsJunctionScoreAndProgressAllKPPN,
  getWsJunctionScoreAllPeriodSingleKPPN,
  getWsJunctionScoreAllPeriod,
  editWsJunctionKPPNScore,
  editWsJunctionKanwilScore,
  editWsJunctionKanwilNote,
  editWsJunctionFile,
  deleteWsJunctionByWorksheetId,
  deleteWsJunctionFile
}

// ------------------------------

async function utilGetWorksheetId(period: number, kppnId: string){
  try{
    const mainWorksheet = await worksheet.getWorksheetByPeriodAndKPPN(period, kppnId);
    const worksheetId = mainWorksheet.length>0? mainWorksheet[0].id : null;

    return worksheetId
  }catch(err){
    throw err
  }
}

async function getScoreProgressResponseBody(mainWorksheet: WorksheetType[]) {
  try{
    const worksheetId = mainWorksheet.length>0? mainWorksheet[0].id : null;

    if(!worksheetId) {
      return {
        scoreByKanwil : 0,
        scoreByKPPN: 0,
        isFinal: false,
        totalChecklist: 0,
        totalProgressKanwil: 0,
        totalProgressKPPN: 0,
        scorePerKomponen: null,
        scorePerKomponenKPPN: null
      }
    };

    const komponenAll = await komponen.getAllKomponenWithSubKomponen();
    const wsJunctionDetail = await wsJunction.getWsJunctionWithKomponenDetail(worksheetId || '');

    if(!wsJunctionDetail || wsJunctionDetail.length===0) {
      return {
        scoreByKanwil : 0,
        scoreByKPPN: 0,
        isFinal: false,
        totalChecklist: 0,
        totalProgressKanwil: 0,
        totalProgressKPPN: 0,
        scorePerKomponen: null,
        scorePerKomponenKPPN: null
      }
    };
    
    const today = new Date().getTime();
    const closeFollowUp = new Date(mainWorksheet?.[0]?.close_follow_up).getTime();
    const isPastDue = today > closeFollowUp;

    return {
      scoreByKanwil : getScoreForMatrix(komponenAll, wsJunctionDetail, true)?.reduce((a, c) => a+c.weightedScore, 0) || 0,
      scoreByKPPN: getScoreForMatrix(komponenAll, wsJunctionDetail, false)?.reduce((a, c) => a+c.weightedScore, 0) || 0,
      isFinal: isPastDue,
      totalChecklist: wsJunctionDetail?.length,
      totalProgressKanwil: wsJunctionDetail?.filter((item) => item?.kanwil_score !== null).length,
      totalProgressKPPN: wsJunctionDetail?.filter((item) => item?.kppn_score !== null).length,
      scorePerKomponen: getScoreForMatrix(komponenAll, wsJunctionDetail, true),
      scorePerKomponenKPPN: getScoreForMatrix(komponenAll, wsJunctionDetail, false)
    };
  }catch(err){
    throw err
  }
}

async function getScoreProgressResponseBodyAllKPPN(mainWorksheet: WorksheetType[], kppn: UnitType) {
  try{
    const worksheetId = mainWorksheet.length>0? mainWorksheet[0].id : null;

    if(!worksheetId) {
      return {
        ...kppn,
        scoreProgressDetail: {
          scoreByKanwil : 0,
          scoreByKPPN: 0,
          isFinal: false,
          totalChecklist: 0,
          totalProgressKanwil: 0,
          totalProgressKPPN: 0,
          scorePerKomponen: null,
          scorePerKomponenKPPN: null
        }
      }
    };

    const komponenAll = await komponen.getAllKomponenWithSubKomponen();
    const wsJunctionDetail = await wsJunction.getWsJunctionWithKomponenDetail(worksheetId);

    if(!wsJunctionDetail || wsJunctionDetail.length===0) {
      return {
        ...kppn,
        scoreProgressDetail: {
          scoreByKanwil : 0,
          scoreByKPPN: 0,
          isFinal: false,
          totalChecklist: 0,
          totalProgressKanwil: 0,
          totalProgressKPPN: 0,
          scorePerKomponen: null,
          scorePerKomponenKPPN: null
        }
      }
    };
    
    const today = new Date().getTime();
    const closeFollowUp = new Date(mainWorksheet?.[0]?.close_follow_up).getTime();
    const isPastDue = today > closeFollowUp;

    return {
      ...kppn,
      scoreProgressDetail:{
        scoreByKanwil : getScoreForMatrix(komponenAll, wsJunctionDetail, true)?.reduce((a, c) => a+c.weightedScore, 0) || 0,
        scoreByKPPN: getScoreForMatrix(komponenAll, wsJunctionDetail, false)?.reduce((a, c) => a+c.weightedScore, 0) || 0,
        isFinal: isPastDue,
        totalChecklist: wsJunctionDetail?.length,
        totalProgressKanwil: wsJunctionDetail?.filter((item) => item?.kanwil_score !== null).length,
        totalProgressKPPN: wsJunctionDetail?.filter((item) => item?.kppn_score !== null).length,
        scorePerKomponen: getScoreForMatrix(komponenAll, wsJunctionDetail, true),
        scorePerKomponenKPPN: getScoreForMatrix(komponenAll, wsJunctionDetail, false)
      }
    };
  }catch(err){
    throw err
  }
}