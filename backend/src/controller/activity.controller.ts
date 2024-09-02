import {Request, Response, NextFunction} from 'express';
import activity from "../model/activity.model";

const getAllActivityLimited = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await activity.getAllActivityLimited();
    return res.status(200).json({sucess: true, message: 'Get activity success', rows: result});
  } catch (err) {
    next(err)
  }
}

const getActivityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {activityType} = req.params;
    const result = await activity.getActivityByType(Number(activityType));
    return res.status(200).json({sucess: true, message: 'Get activity success', rows: result});
  } catch (err) {
    next(err)
  }
}

const getActivityByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {userId} = req.params;
    const result = await activity.getActivityByUser(userId);
    return res.status(200).json({sucess: true, message: 'Get activity success', rows: result});
  } catch (err) {
    next(err)
  }
}

const getActivityByCluster = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {cluster} = req.params;
    const result = await activity.getActivityByCluster(Number(cluster));
    return res.status(200).json({sucess: true, message: 'Get activity success', rows: result});
  } catch (err) {
    next(err)
  }
}

const createActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {username} = req.payload;
    const {activityType} = req.body;
    const ip = req.ip || '';
    const result = await activity.createActivity(username, Number(activityType), ip);
    return res.status(200).json({sucess: true, message: 'Create activity success', rows: result});
  } catch (err) {
    next(err)
  }
}

const deleteActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const result = await activity.deleteActivity(Number(id));
    return res.status(200).json({sucess: true, message: 'Delete activity success', rows: result});
  } catch (err) {
    next(err)
  }
}

export {
  getAllActivityLimited,
  getActivityById,
  getActivityByUser,
  getActivityByCluster,
  createActivity,
  deleteActivity
}