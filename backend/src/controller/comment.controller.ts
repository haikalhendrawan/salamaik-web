/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import {Request, Response, NextFunction} from 'express';
import comment from '../model/comment.model';
import { CommentType } from '../model/comment.model';
// ---------------------------------------------------------------------------

const getByWsJunctionId = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { wsJunctionId } = req.params;
    const result: CommentType[] = await comment.getByWsJunctionId(wsJunctionId);

    res.status(200).json({success: true, message: 'Get comment success', rows: result});
  }catch(err){
    next(err);
  }

}

const add = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const {id} = req.payload;
    const { wsJunctionId, comment} = req.body;
    const result = await comment.add(wsJunctionId, id, comment);  

    res.status(200).json({success: true, message: 'Add comment success', rows: result});
  }catch(err){
    next(err);
  }
}

// ---------------------------------------------------------------------------
export {
  getByWsJunctionId,
  add
}