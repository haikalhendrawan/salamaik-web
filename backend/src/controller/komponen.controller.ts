/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import {Request, Response, NextFunction} from 'express';
import {komponen, subKomponen, subSubKomponen} from '../model/komponen.model';
import ErrorDetail from '../model/error.model';
// -------------------------------------------------

// ------------------------------------------------------
const getAllKomponen= async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await komponen.getAllKomponen();

    return res.status(200).json({sucess: true, message: 'Get komponen success', rows: result});
  } catch (err) {
    next(err);
  }
}

const getAllKomponenExisting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await komponen.getAllKomponenExisting();

    return res.status(200).json({sucess: true, message: 'Get komponen existing success', rows: result});
  } catch (err) {
    next(err);
  }
}

const getAllSubKomponen= async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await subKomponen.getAllSubKomponen();

    return res.status(200).json({sucess: true, message: 'Get sub komponen success', rows: result});
  } catch (err) {
    next(err);
  }
}

const getAllSubKomponenExisting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await subKomponen.getAllSubKomponenExisting();

    return res.status(200).json({sucess: true, message: 'Get sub komponen existing success', rows: result});
  } catch (err) {
    next(err);
  }
}

const getAllSubSubKomponen= async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await subSubKomponen.getAllSubSubKomponen();

    return res.status(200).json({sucess: true, message: 'Get sub sub komponen success', rows: result});
  } catch (err) {
    next(err);
  }
}

const createKomponen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {title, bobot, alias} = req.body;

    if(bobot === undefined || bobot=== null || isNaN(bobot) || bobot< 0 || bobot > 100){
      throw new ErrorDetail(401, 'Nilai bobot tidak valid');
    }

    const result = await komponen.createKomponen({title, bobot, alias, detail: ''});

    return res.status(200).json({sucess: true, message: 'Create komponen success', rows: result});
  } catch (err) {
    next(err);
  }
}

const deleteKomponen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const result = await komponen.deleteKomponen(parseInt(id));

    return res.status(200).json({sucess: true, message: 'Delete komponen success', rows: result});
  } catch (err) {
    next(err);
  }
}

const editKomponen = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id, title, bobot, alias} = req.body;

    if(bobot === undefined || bobot=== null || isNaN(bobot) || bobot< 0 || bobot > 100){
      throw new ErrorDetail(401, 'Nilai bobot tidak valid');
    }

    const result = await komponen.editKomponen({id, title, bobot, alias});

    return res.status(200).json({sucess: true, message: 'Edit komponen success', rows: result});
  } catch (err) {
    next(err);
  }
}

const createSubKomponen = async (req: Request, res: Response, next: NextFunction) => {
  try {

  } catch (err) {
    next(err);
  }
}

const deleteSubKomponen = async (req: Request, res: Response, next: NextFunction) => {
  try {

  } catch (err) {
    next(err);
  }
}

const editSubKomponen = async (req: Request, res: Response, next: NextFunction) => {
  try {

  } catch (err) {
    next(err);
  }
}



export { 
  getAllKomponen, 
  getAllKomponenExisting,
  getAllSubKomponen, 
  getAllSubKomponenExisting,
  getAllSubSubKomponen, 
  createKomponen, 
  deleteKomponen, 
  editKomponen };