import { Request, Response, NextFunction } from "express";
import matrix from "../model/matrix.model";
import worksheet, {WorksheetType} from "../model/worksheet.model";
import wsJunction from "../model/worksheetJunction.model";
import pool from '../config/db';
import findings from "../model/findings.model";
import ErrorDetail from "../model/error.model";
// ------------------------------------------------------------------------
const getMatrixByWorksheetId = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {id} = req.params;
    const result = await matrix.getMatrixByWorksheetId(id);
    return res.status(200).json({sucess: true, message: 'Get matrix success', rows: result})
  }catch(err){
    next(err)
  }
}

const createMatrix = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {kppn} = req.body;
    const {period} = req.payload;
    const worksheetProfile: WorksheetType[] = await worksheet.getWorksheetByPeriodAndKPPN(period, kppn);
    const worksheetId = worksheetProfile[0]?.id || null;
    const matrixStatus = worksheetProfile[0]?.matrix_status || 0;

    if(!worksheetId) {
      throw new ErrorDetail(404, 'Worksheet not found');
    };

    if(matrixStatus === 1){
      throw new ErrorDetail(400, 'Matrix sudah dibuat');
    };

    const worksheetData = await wsJunction.getWsJunctionByWorksheetId(worksheetId);

    const matrixBody = worksheetData.map((item) => {
      const isFinding = item.standardisasi === 1 
                        ? (item.kanwil_score === 12 ? 0 : 1) 
                        : (item.kanwil_score === 10 ? 0 : 1);
      const wsJunctionId = item.junction_id;
      const checklistId = item.checklist_id;
      const hasilImplementasi = (item.opsi?.filter((op) => op?.value === item.kanwil_score)[0]?.positive_fallback || '');
      const rekomendasi = isFinding ? (item.opsi?.filter((op) => op?.value === item.kanwil_score)[0]?.rekomendasi|| '') : '';
      const permasalahan = isFinding ? (item.opsi?.filter((op) => op?.value === item.kanwil_score)[0]?.negative_fallback || '') : '';
      const peraturan = item.peraturan;
      const uic = item.uic;
      const tindakLanjut = "";

      return({
        worksheetId,
        wsJunctionId,
        checklistId,
        hasilImplementasi,
        rekomendasi,
        permasalahan, 
        peraturan,
        uic,
        tindakLanjut, 
        isFinding
      })
    });

    const result = await Promise.all(matrixBody.map(async(item) => {
      await matrix.addMatrix(item)
    }));

    const matrixAll = await matrix.getMatrixWithWsJunction(worksheetId);

    const matrixIsFindings = matrixAll.filter((item) => item.isFinding === 1).map((item) => {
      const wsJunctionId = item.junction_id;
      const checklistId = item.checklist_id;
      const matrixId = item.id;
      const scoreBefore = item.kanwil_score;

      return({
        worksheetId, 
        wsJunctionId, 
        checklistId, 
        matrixId, 
        scoreBefore
      })
    });

    const result2 = await Promise.all(matrixIsFindings.map(async (item) => {
      await findings.createFindings(item);
    }));

    return res.status(200).json({sucess: true, message: 'Matrix created successfully', rows: result})
  }catch(err){
    next(err)
  }
}

const updateMatrix = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {id, hasilImplementasi, permasalahan, rekomendasi, peraturan, uic, tindakLanjut, isFinding} = req.body;
    const result = await matrix.updateMatrix(req.body);
    return res.status(200).json({sucess: true, message: 'Update matrix success', rows: result})
  }catch(err){
    next(err)
  }
}

const deleteMatrix = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {id} = req.body;
    const result = await matrix.deleteMatrix(id);
    return res.status(200).json({sucess: true, message: 'Delete matrix success', rows: result})
  }catch(err){  
    next(err)
  }
}


export {
  getMatrixByWorksheetId,
  createMatrix,
  updateMatrix,
  deleteMatrix
}