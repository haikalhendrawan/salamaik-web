import {Request, Response, NextFunction} from 'express';
import checklist from "../model/checklist.model";
import { uploadChecklistFile } from '../config/multer';
import multer from 'multer';
import ErrorDetail from '../model/error.model';
import fs from 'fs';
import path from 'path';

interface ChecklistType{
  id: number,
  title: string, 
  header: string,
  komponen_id: number,
  subkomponen_id: number,
  subsubkomponen_id: number,
  standardisasi: number, 
  matrix_title: string, 
  file1: string,
  file2: string
};

const getAllChecklist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await checklist.getAllChecklist();
    return res.status(200).json({sucess: true, message: 'Get checklist success', rows: result});
  } catch (err) {
    next(err);
  }
}

const getAllOpsi = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await checklist.getAllOpsi();
    return res.status(200).json({sucess: true, message: 'Get opsi success', rows: result});
  } catch (err) {
    next(err);
  }
}

const getChecklistWithOpsi = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ch = await checklist.getAllChecklist();
    const op = await checklist.getAllOpsi();
    const combined = ch.map(row => {
      const array:any = [];
      op.map((item) => {
        item.checklist_id === row.id && array.push(item)
      });

      return({
        ...row, 
        opsi: array
      })

    });
    return res.status(200).json({sucess: true, message: 'Get checklist with opsi success', rows: combined});
  } catch (err) {
    next(err);
  }
}

const editChecklistFile = async (req: Request, res: Response, next: NextFunction) => {
  uploadChecklistFile(req, res, async (err: any) => {
    if(!req.file){
      return next(new ErrorDetail(400, 'Incorrect file type', err));
    };

    if(err instanceof multer.MulterError) {
      if(err.message==='LIMIT FILE SIZE'){
        return next(new ErrorDetail(400, 'File size is too large'));
      }else{
        return next(err);
      }
    } else if(err) {
      return next(err);
    };

    try {
      const id = Number(req.body.id);
      const option = Number(req.body.option);
      if(option!==1 && option!==2){
        return next(new ErrorDetail(400, 'Incorrect option'));
      };
      const fileExt = req.file.mimetype.split("/")[1];
      const filename = `checklist_${req.body.id}_${req.body.option}.${fileExt}`;
      const result = await checklist.editChecklistFile(id, filename, option);
      return res.status(200).json({sucess: true, message: 'file inserted successfully', rows: result});
    } catch (err) {
      next(err);
    }
   
  });

}

const deleteChecklistFile = async (req: Request, res: Response, next: NextFunction) => {
  try{
    console.log(req.body);
    const {id, filename, option} = req.body;
    const result = await checklist.deleteChecklistFile(id, option);

    const filePath = path.join(__dirname,`../uploads/checklist/`, filename);
    fs.unlinkSync(filePath);

    return res.status(200).json({sucess: true, message: 'file deleted successfully', rows: result});
  }catch(err){
    next(err);
  }
}


export {getAllChecklist, getAllOpsi, getChecklistWithOpsi, editChecklistFile, deleteChecklistFile}