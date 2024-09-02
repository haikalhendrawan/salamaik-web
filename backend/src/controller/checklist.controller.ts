import {Request, Response, NextFunction} from 'express';
import checklist from "../model/checklist.model";
import { uploadChecklistFile } from '../config/multer';
import multer from 'multer';
import ErrorDetail from '../model/error.model';
import fs from 'fs';
import path from 'path';
import { sanitizeMimeType } from '../utils/mimeTypeSanitizer';
import { sanitizeSubKomponen } from '../utils/subKomponenSanitizer';
import nonBlockingCall from '../utils/nonBlockingCall';
import activity from '../model/activity.model';
// ---------------------------------------------------------------------
interface ChecklistType{
  id: number,
  title: string | null, 
  header: string | null,
  komponen_id: number,
  subkomponen_id: number,
  subsubkomponen_id: number,
  standardisasi: number, 
  matrix_title: string | null, 
  file1: string | null,
  file2: string | null,
  instruksi: string | null,
  contoh_file: string | null
  peraturan: string | null,
  uic: string | null, 
  checklist_id: number | null,
  standardisasi_id: number | null,
};
// ---------------------------------------------------------------------------
const getAllChecklist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.payload.username;
    const ip = req.ip || '';

    const result = await checklist.getAllChecklist();

    nonBlockingCall(activity.createActivity(username, 15, ip));

    return res.status(200).json({sucess: true, message: 'Get checklist success', rows: result});
  } catch (err) {
    next(err);
  }
}

const getChecklistWithOpsi = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.payload.username;
    const ip = req.ip || '';

    const check = await checklist.getAllChecklist();
    const option = await checklist.getAllOpsi();
    const combined = check.map(row => {
      const array:any = [];
      option.map((item) => {
        item.checklist_id === row.id && array.push(item)
      });

      return({
        ...row, 
        opsi: array
      })

    });

    nonBlockingCall(activity.createActivity(username, 16, ip));

    return res.status(200).json({sucess: true, message: 'Get checklist with opsi success', rows: combined});
  } catch (err) {
    next(err);
  }
}

const editChecklist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.payload.username;
    const ip = req.ip || '';

    const{ komponen_id, subkomponen_id } = req.body;
    const isValidSubKomponen = await sanitizeSubKomponen(komponen_id, subkomponen_id);
    if(!isValidSubKomponen){
      return next(new ErrorDetail(400, 'Invalid subkomponen'));
    };

    const result = await checklist.editChecklist(req.body);

    nonBlockingCall(activity.createActivity(username, 17, ip, req.body.id));

    return res.status(200).json({sucess: true, message: 'Checklist has been updated', rows: result});
  } catch (err) {
    next(err);
  }
}

const editChecklistFile = async (req: Request, res: Response, next: NextFunction) => {
  uploadChecklistFile(req, res, async (err: any) => {
    if(err instanceof multer.MulterError) {
      return next(new ErrorDetail(400, 'File too large (Max 5mb)', err));
    } else if(err) {
      return next(err);
    };

    if(!req.file){
      return next(new ErrorDetail(400, 'File not allowed', err));
    };

    try {
      const username = req.payload.username;
      const ip = req.ip || '';
  
      const id = Number(req.body.id);
      const option = Number(req.body.option);
      if(option!==1 && option!==2){
        return next(new ErrorDetail(400, 'Incorrect option'));
      };
      const fileExt = sanitizeMimeType(req.file.mimetype);
      const filename = `checklist_${req.body.id}_${req.body.option}.${fileExt}`;
      const result = await checklist.editChecklistFile(id, filename, option);

      nonBlockingCall(activity.createActivity(username, 18, ip, id));

      return res.status(200).json({sucess: true, message: 'file inserted successfully', rows: result});
    } catch (err) {
      next(err);
    }

  });

}

const deleteChecklistFile = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const {id, filename, option} = req.body;
    const result = await checklist.deleteChecklistFile(id, option);

    const filePath = path.join(__dirname,`../uploads/checklist/`, filename);
    fs.unlinkSync(filePath);

    nonBlockingCall(activity.createActivity(username, 19, ip, id));

    return res.status(200).json({sucess: true, message: 'file deleted successfully', rows: result});
  }catch(err){
    next(err);
  }
}

const editOpsiById = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';
    
    const {id, title, value, checklistId, positiveFallback, negativeFallback, rekomendasi} = req.body;
    const validValue = [0, 5, 7, 10];
    if(validValue.includes(value) === false){
      return next(new ErrorDetail(400, 'Nilai dari opsi harus 0, 5, 7, atau 10'));
    };
    const result = await checklist.editOpsiById(id, title, value, checklistId, positiveFallback, negativeFallback, rekomendasi);

    nonBlockingCall(activity.createActivity(username, 20, ip, id));

    return res.status(200).json({sucess: true, message: 'Opsi updated successfully', rows: result});
  }catch(err){
    next(err);
  }
}

const getAllOpsi = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.payload.username;
    const ip = req.ip || '';

    const result = await checklist.getAllOpsi();

    nonBlockingCall(activity.createActivity(username, 21, ip));

    return res.status(200).json({sucess: true, message: 'Get opsi success', rows: result});
  } catch (err) {
    next(err);
  }
}

export {
  getAllChecklist, 
  getChecklistWithOpsi, 
  editChecklist,
  editChecklistFile, 
  deleteChecklistFile, 
  getAllOpsi, 
  editOpsiById,
}
//------------------------------------------------------------------------------------------------------------
