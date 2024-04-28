import {Request, Response, NextFunction} from 'express';
import notif from "../model/notif.model";

const getNotif = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const result = await notif.getNotif();
    return res.status(200).json(result)
  }catch(err){
    next(err);  
  }
};

const getNotifById = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const userID = req.payload.id;
    const result = await notif.getNotifById(userID);
    return res.status(200).json(result)
  }catch(err){
    next(err);
  }
};

const addNotif = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const userID = req.payload.id;
    const {title, message, categories} = req.body;
    const result = await notif.addNotif(title, message, categories, userID);
    return res.status(200).json(result)
  }catch(err){
    next(err);
  }
};

const assignNotif = async(req: Request, res: Response, next: NextFunction) => { 
  try{
    const userID = req.payload.id;
    const {notifID} = req.body;
    const result = await notif.assignNotif(userID, notifID);
    return res.status(200).json(result)
  }catch(err){
    next(err);
  }
};

const updateNotif = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const userID = req.payload.id;
    const {junctionID} = req.body;
    const result = await notif.updateNotif(userID, junctionID);
    return res.status(200).json(result)
  }catch(err){
    next(err);
  }
};

const deleteNotif = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const userID = req.payload.id;
    const {notifID} = req.body;
    const result = await notif.deleteNotif(notifID);
    return res.status(200).json(result)
  }catch(err){
    next(err);
  }
};


export {getNotif, getNotifById, addNotif, assignNotif, updateNotif, deleteNotif};