/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import {Request, Response, NextFunction} from 'express';
import misc from '../model/misc.model';
import multer from 'multer';
import ErrorDetail from '../model/error.model';
import fs from 'fs';
import path from 'path';
import { MiscType } from '../model/misc.model';
import { uploadGallery } from '../config/multer';
import nonBlockingCall from '../utils/nonBlockingCall';
import activity from '../model/activity.model';
// -------------------------------------------------------------------------------

// -------------------------------------------------------------------------------
const getMiscByType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.payload.username;
    const ip = req.ip || '';

    const {miscId} = req.params;
    const result = await misc.getMiscByType(parseInt(miscId));

    nonBlockingCall(activity.createActivity(username, 38, ip));

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
      const username = req.payload.username;
      const ip = req.ip || '';

      const {miscId, value, detail1, detail2, detail3} = req.body;
      const result = await misc.addMisc(parseInt(miscId), value, detail1, detail2, detail3);

      nonBlockingCall(activity.createActivity(username, 39, ip, value));

      return res.status(200).json({sucess: true, message: 'Add gallery success', rows: result});
    } catch (err) {
      console.log(err)
      next(err)
    }
  })
}

const deleteMisc= async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.payload.username;
    const ip = req.ip || '';

    const {id} = req.params;
    const result = await misc.deleteMiscById(parseInt(id));

    nonBlockingCall(activity.createActivity(username, 40, ip, id));

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
