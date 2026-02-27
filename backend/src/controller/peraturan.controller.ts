/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

 import {Request, Response, NextFunction} from 'express';
 import peraturan from '../model/peraturan.model';
 // ---------------------------------------------------------

 const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await peraturan.getAll();

    return res.status(200).json({sucess: true, message: 'Get peraturan success', rows: result})
  } catch (err) {
    next(err);
  }
 }

 const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const result = await peraturan.getById(id);

    return res.status(200).json({sucess: true, message: 'Get peraturan success', rows: result})

  } catch (err) {
    next(err);
  }
 }

 const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {nomor, hal, tahun} = req.body;
    const result = await peraturan.add(nomor, hal, tahun);

    return res.status(200).json({sucess: true, message: 'create peraturan success', rows: result})
  } catch (err) {
    next(err);
  }
 }

 const edit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id, nomor, hal, tahun} = req.body;
    const result = await peraturan.edit(id, nomor, hal, tahun);

    return res.status(200).json({sucess: true, message: 'edit peraturan success', rows: result})
  } catch (err) {
    next(err);
  }
 }

 const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);

    const result = await peraturan.deleteById(id);
    return res.status(200).json({sucess: true, message: 'delete peraturan success', rows: result})
  } catch (err) {
    next(err);
  }
 }

 export {
   getAll,
   getById,
   create,
   edit,
   deleteById
 }