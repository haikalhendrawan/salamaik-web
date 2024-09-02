import {Request, Response, NextFunction} from 'express';
import notif from "../model/notif.model";
import nonBlockingCall from '../utils/nonBlockingCall';
import activity from '../model/activity.model';

const getNotif = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const result = await notif.getNotif();

    nonBlockingCall(activity.createActivity(username, 41, ip));

    return res.status(200).json(result)
  }catch(err){
    next(err);  
  }
}

const getNotifById = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const userID = req.payload.id;
    const result = await notif.getNotifById(userID);

    nonBlockingCall(activity.createActivity(username, 42, ip));

    return res.status(200).json(result)
  }catch(err){
    next(err);
  }
}

const addNotif = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const userID = req.payload.id;
    const {title, message, categories} = req.body;
    const result = await notif.addNotif(title, message, categories, userID);

    nonBlockingCall(activity.createActivity(username, 43, ip, title));

    return res.status(200).json(result)
  }catch(err){
    next(err);
  }
}

const assignNotif = async(req: Request, res: Response, next: NextFunction) => { 
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const userId = req.payload.id;
    const {notifId} = req.body;
    const result = await notif.assignNotif(userId, notifId);

    nonBlockingCall(activity.createActivity(username, 44, ip, notifId));

    return res.status(200).json(result)
  }catch(err){
    next(err);
  }
}

const updateNotif = async(req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const userId = req.payload.id;
    const {junctionId} = req.body;
    const result = await notif.updateNotif(userId, junctionId);

    nonBlockingCall(activity.createActivity(username, 45, ip, junctionId));

    return res.status(200).json(result)
  }catch(err){
    next(err);
  }
}

const deleteNotif = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const {notifId} = req.body;
    const result = await notif.deleteNotif(notifId);

    nonBlockingCall(activity.createActivity(username, 46, ip, notifId));

    return res.status(200).json(result)
  }catch(err){
    next(err);
  }
}


export {getNotif, getNotifById, addNotif, assignNotif, updateNotif, deleteNotif};