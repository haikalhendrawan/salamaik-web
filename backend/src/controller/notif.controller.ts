import {Request, Response} from 'express';
import notif from "../model/notif.model";

const USER = `964e2def-d10b-40bd-a8f8-6bf8103aa291`;

const getNotif = async (req: Request, res: Response) => {
  try{
    const result = await notif.getNotif();
    return res.status(200).json(result)
  }catch(err){
    console.log(err);
    return res.status(500).json(err)   
  }
};

const getNotifById = async (req: Request, res: Response) => {
  try{
    const userID = USER;
    const result = await notif.getNotifById(userID);
    return res.status(200).json(result)
  }catch(err){
    console.log(err);
    return res.status(500).json(err)
  }
};

const addNotif = async(req: Request, res: Response) => {
  try{
    const userID = USER;
    const {title, message, categories} = req.body;
    const result = await notif.addNotif(title, message, categories, userID);
    return res.status(200).json(result)
  }catch(err){
    console.log(err);
    return res.status(500).json(err)
  }
};

const assignNotif = async(req: Request, res: Response) => { 
  try{
    const userID = USER;
    const {notifID} = req.body;
    const result = await notif.assignNotif(userID, notifID);
    return res.status(200).json(result)
  }catch(err){
    console.log(err);
    return res.status(500).json(err)
  }
};

const updateNotif = async(req: Request, res: Response) => {
  try{
    const userID = USER;
    const {junctionID} = req.body;
    const result = await notif.updateNotif(userID, junctionID);
    return res.status(200).json(result)
  }catch(err){
    console.log(err);
    return res.status(500).json(err)
  }
};

const deleteNotif = async (req: Request, res: Response) => {
  try{
    const userID = USER;
    const {notifID} = req.body;
    const result = await notif.deleteNotif(notifID);
    return res.status(200).json(result)
  }catch(err){
    console.log(err);
    return res.status(500).json(err)
  }
};


export {getNotif, getNotifById, addNotif, assignNotif, updateNotif, deleteNotif};