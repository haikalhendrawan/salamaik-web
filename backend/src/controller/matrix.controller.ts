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
    const {worksheetId} = req.params;
    const result = await matrix.getMatrixByWorksheetId(worksheetId);
    return res.status(200).json({sucess: true, message: 'Get matrix success', rows: result})
  }catch(err){
    next(err)
  }
}

const getMatrixWithWsDetailById = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const {kppnId} = req.params;
    const {period}  = req.payload;
    const result = await worksheet.getWorksheetByPeriodAndKPPN(period, kppnId); 

    if(result.length === 0){
      throw new ErrorDetail(404, 'Worksheet not found');
    };

    const mainWorksheet = result[0];
    const result2 = await matrix.getMatrixWithWsJunction(mainWorksheet.id); 
    return res.status(200).json({sucess: true, message: 'Get matrix success', rows: {matrix: result2, worksheet: mainWorksheet}})
  }catch(err){
    next(err)
  }
}

const createMatrix = async(req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.connect();
  try{
    await connection.query('BEGIN');
    const {kppnId} = req.body;
    const {period} = req.payload;

    // query #1 dapatkan worksheet Id
    const worksheetProfile: WorksheetType[] = await worksheet.getWorksheetByPeriodAndKPPN(period, kppnId); 
    const worksheetId = worksheetProfile[0]?.id || null;
    const matrixStatus = worksheetProfile[0]?.matrix_status || 0;

    if(!worksheetId) {
      throw new ErrorDetail(404, 'Worksheet not found');
    };

    if(matrixStatus === 1){
      throw new ErrorDetail(400, 'Matrix sudah dibuat');
    };

    // query #2 dapatkan list wsjunction
    const worksheetData = await wsJunction.getWsJunctionByWorksheetId(worksheetId);

    const matrixBody = worksheetData.map((item) => {
      const isStandardisasi = item.standardisasi === 1;
      const isFinding = item.standardisasi === 1 
                        ? item.kanwil_score === 12 ? 0 : 1 
                        : item.kanwil_score === 10 ? 0 : 1;
      const wsJunctionId = item.junction_id;
      const checklistId = item.checklist_id;
      const hasilImplementasi = (isStandardisasi ? item.title : item.opsi?.filter((op) => op?.value === item.kanwil_score)[0]?.positive_fallback || '');
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

    // query #3 buat matrix baru utk setiap wsjunction yang memenuhi kriteria finding
    const result = await Promise.all(matrixBody.map(async(item) => {
      await matrix.addMatrix(item, connection)
    }));

    const matrixAll = await matrix.getMatrixWithWsJunction(worksheetId, connection);

    const matrixIsFindings = matrixAll.filter((item) => item.is_finding === 1).map((item) => {
      const wsJunctionId = item?.ws_junction_id;
      const checklistId = item?.checklist_id;
      const matrixId = item?.id;
      const scoreBefore = item.ws_junction[0]?.kanwil_score;

      return({
        worksheetId, 
        wsJunctionId, 
        checklistId, 
        matrixId, 
        scoreBefore
      })
    });

    // query #4 insert to table finding baru utk setiap matrix yang merupakan finding
    const result2 = await Promise.all(matrixIsFindings.map(async (item) => {
      await findings.createFindings(item, connection);
    }));

    // query #5 update status matrix
    await worksheet.editWorksheetMatrixStatus(worksheetId, 1, connection);
    await connection.query('COMMIT');

    return res.status(200).json({sucess: true, message: 'Matrix created successfully', rows: {result, result2}})
  }catch(err){
    await connection.query('ROLLBACK');
    next(err)
  }finally{
    connection.release();
  }
}

const updateMatrix = async(req: Request, res: Response, next: NextFunction) => {
  try{
    // const {id, hasilImplementasi, permasalahan, rekomendasi, peraturan, uic, tindakLanjut, isFinding} = req.body;
    const result = await matrix.updateMatrix(req.body);
    return res.status(200).json({sucess: true, message: 'Update matrix success', rows: result})
  }catch(err){
    next(err)
  }
}

const deleteMatrix = async(req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.connect();

  try{
    await connection.query('BEGIN');
    const {worksheetId} = req.body;

    if(!worksheetId) {
      throw new ErrorDetail(404, 'Missing request body');
    };

    const result = await matrix.deleteMatrixByWorksheetId(worksheetId, connection);

    const result2 = await findings.deleteFindingsByWorksheetId(worksheetId, connection);

    const result3 = await worksheet.editWorksheetMatrixStatus(worksheetId, 0, connection);
    await connection.query('COMMIT');
    return res.status(200).json({sucess: true, message: 'Delete matrix success', rows: [result, result2, result3]})
  }catch(err){  
    await connection.query('ROLLBACK');
    next(err)
  }finally{
    connection.release();
  }
}


export {
  getMatrixByWorksheetId,
  getMatrixWithWsDetailById,
  createMatrix,
  updateMatrix,
  deleteMatrix
}