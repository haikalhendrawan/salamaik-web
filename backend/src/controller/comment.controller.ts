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
    const {id} = req.payload; //user uuid
    const { wsJunctionId, commentBody} = req.body;
    const result = await comment.add(wsJunctionId, id, commentBody);  

    res.status(200).json({success: true, message: 'Add comment success', rows: result});
  }catch(err){
    next(err);
  }
}

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const {id} = req.body;
    const result = await comment.delete(id);
    res.status(200).json({success: true, message: 'Delete comment success', rows: result});
  }catch(err){
    next(err)
  }
}

// ---------------------------------------------------------------------------
export {
  getByWsJunctionId,
  add,
  deleteById
}