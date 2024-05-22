import {Request, Response, NextFunction} from 'express';
import standardization from '../model/standardization.model';
import { uploadStdFile } from '../config/multer';
import period from '../model/period.model';
import ErrorDetail from '../model/error.model';
import multer from 'multer';
import logger from '../config/logger';
import { sanitizeMimeType } from '../utils/mimeTypeSanitizer';
import { stdScoreGenerator } from '../utils/standardizationCounter';
import fs from 'fs';
import path from 'path';
// -------------------------------------------------
interface StandardizationType{
  id: number;
  title: string;
  cluster: number;
  interval: number
};

interface PeriodType{
  id: number;
  name: string; 
  evenPeriod: 0;
  semester: number;
  tahun: string
};

// ------------------------------------------------------
const getAllStandardization = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const result = await standardization.getStandardization();
    return res.status(200).json({sucess: true, message: 'Get standardization success', rows: result})
  }catch(err){
    next(err)
  }
}

const getStandardizationJunction = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const {kppn, period} = req.payload;
    const result = await standardization.getStandardizationJunction(kppn, period);
    return res.status(200).json({sucess: true, message: 'Get standardization junction success', rows: result})
  }catch(err){
    next(err)
  }
}

const getStdWorksheet = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const {period: periodID} = req.payload;
    const {kppn} = req.params
    const periodRef = await period.getAllPeriod();
    const isEvenPeriod = periodRef?.filter((item: PeriodType) => item.id === periodID)?.[0]?.evenPeriod || 0;

    const stdRef = await standardization.getStandardization();
    const stdJunction = await standardization.getStandardizationJunction(kppn, periodID);
    const stdWorksheet = stdRef.map((item) => ({
      id: item.id,
      title: item.title,
      interval: item.interval,
      cluster: item.cluster,
      list: [
        [...stdJunction?.filter((row) => (row.standardization_id === item.id) && row.month === (isEvenPeriod===0?1:7))],
        [...stdJunction?.filter((row) => (row.standardization_id === item.id) && row.month === (isEvenPeriod===0?2:8))],
        [...stdJunction?.filter((row) => (row.standardization_id === item.id) && row.month === (isEvenPeriod===0?3:9))],
        [...stdJunction?.filter((row) => (row.standardization_id === item.id) && row.month === (isEvenPeriod===0?4:10))],
        [...stdJunction?.filter((row) => (row.standardization_id === item.id) && row.month === (isEvenPeriod===0?5:11))],
        [...stdJunction?.filter((row) => (row.standardization_id === item.id) && row.month === (isEvenPeriod===0?6:12))]
      ],
      score: stdScoreGenerator(item.interval, stdJunction, item, isEvenPeriod)
    }))
    return res.status(200).json({sucess: true, message: 'Get standardization worksheet success', rows: stdWorksheet})
  }catch(err){
    next(err)
  }
}

const addStandardizationJunction = async (req: Request, res: Response, next: NextFunction) => {
  uploadStdFile(req, res, async (err) => {
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

    try{
      const {kppnId, periodId, standardizationId, month, timeStamp} = req.body;
      const fileExt = sanitizeMimeType(req.file.mimetype);
      const fileName = `std_${kppnId}_${periodId}${month}${standardizationId}_${timeStamp}.${fileExt}`;
      const result = await standardization.addStandardizationJunction(kppnId, periodId, standardizationId, month, fileName);
      return res.status(200).json({sucess: true, message: 'Add File success', rows: result})
    }catch(err){
      logger.error('Error adding std junction', err)
      next(err)
    }
  })
  
}

const deleteStandardizationJunction = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const {id, fileName} = req.body;
    const result = await standardization.deleteStandardizationJunction(id);

    const filePath = path.join(__dirname,`../uploads/standardization/`, fileName);
    fs.unlinkSync(filePath);

    return res.status(200).json({sucess: true, message: 'Delete file success', rows: result})
  }catch(err){
    next(err)
  }
}

export { 
  getAllStandardization, 
  getStandardizationJunction, 
  getStdWorksheet, 
  addStandardizationJunction, 
  deleteStandardizationJunction 
}