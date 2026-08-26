/**
 * Salamaik API
 * © Kanwil DJPb Sumbar 2026
 */

import { Request, Response, NextFunction } from 'express';
import comment, { CommentType } from '../model/comment.model';
import ErrorDetail from '../model/error.model';
import wsSPMLJunction from '../model/wsSPMLJunction.model';

const getByWsJunctionId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { wsJunctionId } = req.params;
    const result: CommentType[] = await comment.getByWsJunctionId(wsJunctionId);
    return res.status(200).json({ success: true, message: 'Get comment success', rows: result });
  } catch (err) {
    next(err);
  }
};

const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.payload;
    const { wsJunctionId, commentBody } = req.body;
    const result = await comment.add(wsJunctionId, id, commentBody);
    return res.status(200).json({ success: true, message: 'Add comment success', rows: result });
  } catch (err) {
    next(err);
  }
};

const canAccessSPMLJunction = (requesterKppn: string | undefined, junctionKppn: string | null) =>
  requesterKppn?.length === 5 || requesterKppn === junctionKppn;

const getByWsSPMLJunctionId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wsSPMLJunctionId = Number(req.params.wsSPMLJunctionId);
    if (!Number.isInteger(wsSPMLJunctionId) || wsSPMLJunctionId <= 0) {
      throw new ErrorDetail(400, 'ID junction SPML tidak valid');
    }

    const junction = await wsSPMLJunction.getWsSPMLJunctionByJunctionId(wsSPMLJunctionId);
    if (!junction) {
      throw new ErrorDetail(404, 'SPML worksheet junction not found');
    }
    if (!canAccessSPMLJunction(req.payload?.kppn, junction.kppn_id)) {
      throw new ErrorDetail(403, 'Not authorized to access this SPML worksheet');
    }

    const result: CommentType[] = await comment.getByWsSPMLJunctionId(wsSPMLJunctionId);
    return res.status(200).json({ success: true, message: 'Get SPML comment success', rows: result });
  } catch (err) {
    next(err);
  }
};

const addSPML = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.payload?.id;
    const wsSPMLJunctionId = Number(req.body.wsSPMLJunctionId);
    const commentBody = typeof req.body.commentBody === 'string' ? req.body.commentBody.trim() : '';

    if (!Number.isInteger(wsSPMLJunctionId) || wsSPMLJunctionId <= 0) {
      throw new ErrorDetail(400, 'ID junction SPML tidak valid');
    }
    if (!commentBody || commentBody.length > 2000) {
      throw new ErrorDetail(400, 'Komentar wajib diisi dan maksimal 2000 karakter');
    }

    const junction = await wsSPMLJunction.getWsSPMLJunctionByJunctionId(wsSPMLJunctionId);
    if (!junction) {
      throw new ErrorDetail(404, 'SPML worksheet junction not found');
    }
    if (!canAccessSPMLJunction(req.payload?.kppn, junction.kppn_id)) {
      throw new ErrorDetail(403, 'Not authorized to access this SPML worksheet');
    }

    const result = await comment.addSPML(wsSPMLJunctionId, userId, commentBody);
    return res.status(200).json({ success: true, message: 'Add SPML comment success', rows: result });
  } catch (err) {
    next(err);
  }
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.body.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new ErrorDetail(400, 'ID komentar tidak valid');
    }

    const existingComment = await comment.getById(id);
    if (!existingComment) {
      throw new ErrorDetail(404, 'Comment not found');
    }
    if (existingComment.user_id !== req.payload?.id) {
      throw new ErrorDetail(403, 'Comment hanya dapat dihapus oleh pembuatnya');
    }

    const result = await comment.delete(id);
    return res.status(200).json({ success: true, message: 'Delete comment success', rows: result });
  } catch (err) {
    next(err);
  }
};

export {
  getByWsJunctionId,
  getByWsSPMLJunctionId,
  add,
  addSPML,
  deleteById,
};
