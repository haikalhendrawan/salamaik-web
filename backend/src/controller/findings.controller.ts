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
import { FindingsUtil } from '../utils/businessLogic/findings.utils';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { uploadFindingFile } from '../config/multer';
// ---------------------------------------------------------------------------------------------------
interface FindingsResponseType{
  id: number,
  ws_junction_id: number,
  worksheet_id: string,
  checklist_id: number,
  matrix_id: number, 
  kppn_response: string,
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

const getFindingsById = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const {findingsId} = req.params;
    const {role, kppn}  = req.payload;
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
    
    if (allFindings[0].matrix_id === null && Number(req.payload.peraturan) === 2) {
      const derived = await findings.getDerivedRegulation2(worksheetId);
      const item: any = derived.find((row) => row.id === Number(findingsId));
      if (!item) throw new ErrorDetail(404, 'Temuan tidak ditemukan');
      return res.status(200).json({
        sucess: true,
        message: 'Get findings success',
        rows: [{
          ...item,
          matrixDetail: [{
            id: null,
            ws_junction: [item.ws_junction],
            checklist: [item.checklist],
            opsi: item.opsi || [],
            standardisasi: item.checklist?.standardisasi || 0,
            komponen_string: item.komponen?.title || '',
            subkomponen_string: item.subkomponen?.title || '',
          }],
        }],
      });
    }

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

const getDerived = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const {period, kppn, peraturan}  = req.payload;
    const allWorksheet = await worksheet.getWorksheetByPeriodAndKPPN(period, kppn); 

    if(allWorksheet.length === 0){
      throw new ErrorDetail(404, 'Worksheet not found');
    };

    const worksheetId = allWorksheet[0].id;
    const derivedFindings = Number(peraturan) === 2
      ? await findings.getDerivedRegulation2(worksheetId)
      : await findings.getDerived(worksheetId);
    const isFinal = derivedFindings.length > 0
      ? FindingsUtil.isFinal(derivedFindings)
      : new Date() > new Date(allWorksheet[0].close_follow_up);
    const nonFinalFindings = derivedFindings;
    const nonFinalCount = nonFinalFindings?.length || 0;
    const finalFindings = Number(peraturan) === 2
      ? derivedFindings.filter((item) => item.status !== 3)
      : FindingsUtil.getFinal(derivedFindings);
    const finalCount = finalFindings?.length || 0;

    const responseBody = {
      isFinal,
      nonFinalFindings,
      nonFinalCount,
      finalFindings,
      finalCount
    };

    return res.status(200).json({sucess: true, message: 'Get findings success', rows: responseBody})
  }catch(err){
    next(err)
  }
}

const addFindings = async (req: Request, res: Response, next: NextFunction) => {
  try{
    // const {worksheetId, wsJunctionId, checklistId, matrixId, scoreBefore} = req.body;

    const result = await findings.createFindings(req.body);

    return res.status(200).json({sucess: true, message: 'Add findings success', rows: result})
  }catch(err){
    next(err)
  }
}

const updateFindingsScore = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const {id, scoreBefore, scoreAfter, userName} = req.body;
    const current = (await findings.getFindingsById(Number(id)))[0];
    if (!current) throw new ErrorDetail(404, 'Findings not found');
    if (current.matrix_id === null && Number(req.payload.peraturan) === 2) {
      const worksheetRows = await worksheet.getById(current.worksheet_id);
      const worksheetDetail = worksheetRows[0];
      if (!worksheetDetail || Date.now() < new Date(worksheetDetail.open_follow_up).getTime() || Date.now() > new Date(worksheetDetail.close_follow_up).getTime()) {
        throw new ErrorDetail(409, 'Periode tindak lanjut tidak sedang dibuka');
      }
      const role = req.payload.role;
      const isKanwil = [3, 4, 99].includes(role);
      const isKPPN = [1, 2].includes(role);
      if (!isKanwil && (!isKPPN || worksheetDetail.kppn_id !== req.payload.kppn)) throw new ErrorDetail(403, 'Not authorized');
      const score = scoreAfter === '' || scoreAfter === undefined || scoreAfter === null ? null : Number(scoreAfter);
      if (score !== null && (!Number.isFinite(score) || score < 0 || score > 15)) throw new ErrorDetail(400, 'Nilai tidak valid');
      if (!(await findings.isRegulation2ScoreAllowed(current, score))) throw new ErrorDetail(400, 'Nilai tidak tersedia pada checklist ini');
      const result = await findings.updateRegulation2FollowUpScore(Number(id), score, isKanwil ? 'KANWIL' : 'KPPN', req.payload.username || userName);
      return res.status(200).json({ success: true, message: 'Nilai tindak lanjut diperbarui', rows: result });
    }
    const result = await findings.updateFindingsScore(id, scoreBefore, scoreAfter, userName);

    return res.status(200).json({sucess: true, message: 'Score has been updated', rows: result})
  }catch(err){
    next(err)
  }
}

const updateFindingsResponse = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.connect();
  try{
    await connection.query('BEGIN');
    const {id, kppnResponse, kanwilResponse, userName, matrixId} = req.body;
    const currentFinding = (await findings.getFindingsById(Number(id)))[0];
    if (!currentFinding) throw new ErrorDetail(404, 'Findings not found');
    if (currentFinding.matrix_id === null && Number(req.payload.peraturan) === 2) {
      const worksheetDetail = (await worksheet.getById(currentFinding.worksheet_id))[0];
      const now = Date.now();
      if (!worksheetDetail || now < new Date(worksheetDetail.open_follow_up).getTime() || now > new Date(worksheetDetail.close_follow_up).getTime()) {
        throw new ErrorDetail(409, 'Periode tindak lanjut tidak sedang dibuka');
      }
      const isKanwil = [3, 4, 99].includes(req.payload.role);
      const isKPPN = [1, 2].includes(req.payload.role);
      if (!isKanwil && (!isKPPN || worksheetDetail.kppn_id !== req.payload.kppn)) throw new ErrorDetail(403, 'Not authorized');
      if (isKanwil && (kppnResponse || '') !== (currentFinding.kppn_response || '')) throw new ErrorDetail(403, 'Kanwil hanya dapat mengubah catatan Kanwil');
      if (isKPPN && (kanwilResponse || '') !== (currentFinding.kanwil_response || '')) throw new ErrorDetail(403, 'KPPN hanya dapat mengubah tanggapan KPPN');
    }
    const result = await findings.updateFindingsResponse(id, kppnResponse, kanwilResponse, userName);
    const matrixResult = Number(req.payload.peraturan) === 2 && currentFinding.matrix_peraturan_2_id != null
      ? await matrix.updateRegulation2TindakLanjut(currentFinding.matrix_peraturan_2_id, kanwilResponse, connection)
      : matrixId == null ? null : await matrix.updateMatrixTindakLanjut(matrixId, kanwilResponse, connection);
    await connection.query('COMMIT');

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
    const {role} = req.payload;
    const {id, status, userName} = req.body;

    const currentFinding = await findings.getFindingsById(id);
    if(currentFinding.length === 0){
      throw new ErrorDetail(404, 'Findings not found');
    };

    const currentStatus = currentFinding[0].status;
    if (currentFinding[0].matrix_id === null && Number(req.payload.peraturan) === 2) {
      const worksheetDetail = (await worksheet.getById(currentFinding[0].worksheet_id))[0];
      const now = Date.now();
      if (!worksheetDetail || now < new Date(worksheetDetail.open_follow_up).getTime() || now > new Date(worksheetDetail.close_follow_up).getTime()) {
        throw new ErrorDetail(409, 'Periode tindak lanjut tidak sedang dibuka');
      }
      const isKPPN = [1, 2].includes(role);
      if (isKPPN && worksheetDetail.kppn_id !== req.payload.kppn) throw new ErrorDetail(403, 'Not authorized');
    }
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

const getRegulation2FindingForMutation = async (id: number, req: Request) => {
  const finding = (await findings.getFindingsById(id))[0];
  if (!finding || finding.matrix_id !== null || Number(req.payload.peraturan) !== 2) throw new ErrorDetail(404, 'Temuan tindak lanjut tidak ditemukan');
  const worksheetDetail = (await worksheet.getById(finding.worksheet_id))[0];
  if (!worksheetDetail) throw new ErrorDetail(404, 'Worksheet not found');
  const now = Date.now();
  if (now < new Date(worksheetDetail.open_follow_up).getTime() || now > new Date(worksheetDetail.close_follow_up).getTime()) {
    throw new ErrorDetail(409, 'Periode tindak lanjut tidak sedang dibuka');
  }
  const isKanwil = [3, 4, 99].includes(req.payload.role);
  const isKPPN = [1, 2].includes(req.payload.role);
  if (!isKanwil && (!isKPPN || worksheetDetail.kppn_id !== req.payload.kppn)) throw new ErrorDetail(403, 'Not authorized');
  return finding;
};

const updateFindingFile = (req: Request, res: Response, next: NextFunction) => {
  uploadFindingFile(req, res, async (uploadError: unknown) => {
    if (uploadError instanceof multer.MulterError) return next(new ErrorDetail(400, 'File terlalu besar (maksimal 20 MB)', uploadError));
    if (uploadError) return next(uploadError);
    if (!req.file) return next(new ErrorDetail(400, 'Tipe file tidak diizinkan'));
    try {
      const id = Number(req.body.id);
      if (!Number.isInteger(id) || id <= 0) throw new ErrorDetail(400, 'ID temuan tidak valid');
      const finding = await getRegulation2FindingForMutation(id, req);
      const result = await findings.updateRegulation2FollowUpFile(id, req.file.filename, req.payload.username);
      if (!result) throw new ErrorDetail(404, 'Temuan tindak lanjut tidak ditemukan');
      if (finding.follow_up_file) {
        const oldPath = path.join(__dirname, '../uploads/worksheet', path.basename(finding.follow_up_file));
        await fs.promises.unlink(oldPath).catch(() => undefined);
      }
      return res.status(200).json({ success: true, message: 'Bukti dukung tindak lanjut berhasil diperbarui', rows: result });
    } catch (error) {
      const uploadedPath = path.join(__dirname, '../uploads/worksheet', path.basename(req.file.filename));
      await fs.promises.unlink(uploadedPath).catch(() => undefined);
      next(error);
    }
  });
};

const deleteFindingFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.body.id);
    const finding = await getRegulation2FindingForMutation(id, req);
    const result = await findings.updateRegulation2FollowUpFile(id, null, req.payload.username);
    if (finding.follow_up_file) {
      const filePath = path.join(__dirname, '../uploads/worksheet', path.basename(finding.follow_up_file));
      await fs.promises.unlink(filePath).catch(() => undefined);
    }
    return res.status(200).json({ success: true, message: 'Bukti dukung tindak lanjut dihapus', rows: result });
  } catch (error) {
    next(error);
  }
};

const updateFindingLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.body.id);
    const link = req.body.link == null || req.body.link === '' ? null : String(req.body.link).trim();
    if (link && !/^https?:\/\//i.test(link)) throw new ErrorDetail(400, 'Link harus menggunakan http:// atau https://');
    await getRegulation2FindingForMutation(id, req);
    const result = await findings.updateRegulation2FollowUpLink(id, link, req.payload.username);
    return res.status(200).json({ success: true, message: 'Link tindak lanjut berhasil diperbarui', rows: result });
  } catch (error) {
    next(error);
  }
};

export {getFindingsByWorksheetId, getAllFindings, getAllFindingsByKPPN, getFindingsById, getDerived, updateFindingsScore, addFindings, updateFindingsResponse, updateFindingStatus, updateFindingFile, deleteFindingFile, updateFindingLink}

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
