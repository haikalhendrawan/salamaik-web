import {Request, Response, NextFunction} from 'express';
import misc from '../model/misc.model';
import multer from 'multer';
import ErrorDetail from '../model/error.model';
import fs from 'fs';
import path from 'path';
import { MiscType } from '../model/misc.model';
import { uploadGallery } from '../config/multer';
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
const getMiscByType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {miscId} = req.params;
    const result = await misc.getMiscByType(parseInt(miscId));
    return res.status(200).json({sucess: true, message: 'Get misc success', rows: result});
  } catch (err) {
    next(err);
  }
}

const addGallery = async (req: Request, res: Response, next: NextFunction) => {
  uploadGallery(req, res, async (err: any) => {
      if(err instanceof multer.MulterError) {
        return next(new ErrorDetail(400, 'File too large (Max 2mb)', err));
      } else if(err) {
        return next(err);
      };

      if(!req.file){
        console.log(err);
        return next(new ErrorDetail(400, 'Incorrect file type', err));
      };

    try {
      const {miscId, value, detail1, detail2, detail3} = req.body;
      const result = await misc.addMisc(parseInt(miscId), value, detail1, detail2, detail3);
      return res.status(200).json({sucess: true, message: 'Add gallery success', rows: result});
    } catch (err) {
      console.log(err)
      next(err)
    }
  })
}

const deleteMisc= async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const result = await misc.deleteMiscById(parseInt(id));
    return res.status(200).json({sucess: true, message: 'Delete gallery success', rows: result});
  } catch (err) {
    next(err);
  }
}


export {
  getMiscByType,
  addGallery,
  deleteMisc
}
