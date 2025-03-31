/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import {Request, Response, NextFunction} from 'express';
import archiver from 'archiver';
import standardization from '../model/standardization.model';
import { uploadStdFile } from '../config/multer';
import period from '../model/period.model';
import ErrorDetail from '../model/error.model';
import unit from '../model/unit.model';
import multer from 'multer';
import logger from '../config/logger';
import { sanitizeMimeType } from '../utils/mimeTypeSanitizer';
import { stdScoreGenerator } from '../utils/standardizationCounter';
import fs from 'fs';
import path from 'path';
import { PeriodType } from '../model/period.model';
import nonBlockingCall from '../utils/nonBlockingCall';
import activity from '../model/activity.model';
// -------------------------------------------------
interface StandardizationType{
  id: number;
  title: string;
  cluster: number;
  interval: number
};
// ------------------------------------------------------
const getAllStandardization = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const result = await standardization.getStandardization();

    nonBlockingCall(activity.createActivity(username, 56, ip));

    return res.status(200).json({sucess: true, message: 'Get standardization success', rows: result})
  }catch(err){
    next(err)
  }
}

const getStandardizationJunction = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const {kppn, period} = req.payload;
    const result = await standardization.getStandardizationJunction(kppn, period);

    nonBlockingCall(activity.createActivity(username, 57, ip));

    return res.status(200).json({sucess: true, message: 'Get standardization junction success', rows: result})
  }catch(err){
    next(err)
  }
}

const getStdWorksheet = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const ip = req.ip || '';

    const {period: periodID, username, kppn: unit, role} = req.payload;
    const {kppn} = req.params
    const isKanwil = [3, 4, 99].includes(role);

    if(!isKanwil){
      if(kppn !== unit){
        throw new ErrorDetail(401, 'Not authorized');
      }
    };
    
    const periodRef = await period.getAllPeriod();
    const isEvenPeriod = periodRef?.filter((item: PeriodType) => item.id === periodID)?.[0]?.even_period || 0;

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
      score:  stdScoreGenerator(item.interval, stdJunction, item, isEvenPeriod).score,
      short:  stdScoreGenerator(item.interval, stdJunction, item, isEvenPeriod).short
    }));

    nonBlockingCall(activity.createActivity(username, 58, ip));

    return res.status(200).json({sucess: true, message: 'Get standardization worksheet success', rows: stdWorksheet})
  }catch(err){
    next(err)
  }
}

const getStdFilePerMonthKPPN = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const ip = req.ip || '';
    const {period, kppn, username} = req.payload;
    const {kppnId, month} = req.body;
    const allowedKPPN = kppn === '03010'? kppnId: kppn ;

    const monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthString = monthName[month-1];
    const unitAll = await unit.getAllKPPN();
    const kppnString = unitAll.filter((item) => item.id === allowedKPPN)[0]?.name || '';

    const CLUSTER = [
      'Manajemen Eksternal', 'Penguatan Kapasitas Perbendaharaan', 'Penguatan Manajemen Internal'
    ];

    const archive = archiver('zip', {
      zlib: { level: 9 } // Set the compression level
    });
    res.attachment(`${kppnString} - ${monthString}.zip`);
    const basePath = `${__dirname}/../uploads/standardization`;
    archive.pipe(res);
    const fileToAdd = await standardization.getStdFileNameCollection(allowedKPPN, month, period);

    fileToAdd.forEach(fileObj => {
      const fileName = `${CLUSTER[fileObj.cluster-1]}/${fileObj.title}/${fileObj.file}`;
      const filePath = path.join(basePath, fileObj.file);
      archive.file(filePath, { name: fileName });
    });
    
    archive.finalize();

    nonBlockingCall(activity.createActivity(username, 59, ip));

  }catch(err){
    next(err)
  }
}

const addStandardizationJunction = async (req: Request, res: Response, next: NextFunction) => {
  uploadStdFile(req, res, async (err) => {
    if(err instanceof multer.MulterError) {
      return next(new ErrorDetail(400, 'File too large (Max 5mb)', err));
    } else if(err) {
      return next(err);
    };

    if(!req.file){
      return next(new ErrorDetail(400, 'File not allowed', err));
    };

    try{
      const ip = req.ip || '';

      const {kppn, username} = req.payload;
      const {kppnId, periodId, standardizationId, month, timeStamp} = req.body;
      const allowedKPPN = kppn.length===5 ? kppnId : kppn;
      const fileExt = sanitizeMimeType(req.file.mimetype);
      const fileName = `std_${allowedKPPN}_${periodId}${month}${standardizationId}_${timeStamp}.${fileExt}`;
      const result = await standardization.addStandardizationJunction(allowedKPPN, periodId, standardizationId, month, fileName);

      nonBlockingCall(activity.createActivity(username, 60, ip, {'kppnId': allowedKPPN, 'periodId': periodId, 'stdId': standardizationId, 'monthId': month}));

      return res.status(200).json({sucess: true, message: 'Add File success', rows: result})
    }catch(err){
      logger.error('Error adding std junction', err)
      next(err)
    }
  })
  
}

const deleteStandardizationJunction = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const ip = req.ip || '';

    const {id, fileName} = req.body;
    const {kppn, role, username} = req.payload;

    const standardizationJunction = await standardization.getStandardizationById(id);
    const stdKPPN = standardizationJunction?.kppn_id;
    const isAuthorized = (stdKPPN === kppn) || (role === 99  || role === 4);

    if(!isAuthorized){
      return res.status(401).json({sucess: false, message: 'Unauthorized'})
    };

    const result = await standardization.deleteStandardizationJunction(id);

    const filePath = path.join(__dirname,`../uploads/standardization/`, fileName);
    fs.unlinkSync(filePath);

    nonBlockingCall(activity.createActivity(username, 61, ip, {'id': id}));

    return res.status(200).json({sucess: true, message: 'Delete file success', rows: result})
  }catch(err){
    next(err)
  }
}

export { 
  getAllStandardization, 
  getStandardizationJunction, 
  getStdWorksheet, 
  getStdFilePerMonthKPPN,
  addStandardizationJunction, 
  deleteStandardizationJunction 
}

// ------------------------------------------------------------------------------------------------------------------
