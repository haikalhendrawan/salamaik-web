import {Request, Response, NextFunction} from 'express';
import role from '../model/role.model';

const getAllRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await role.getAllRole();
    return res.status(200).json({sucess: true, message: 'Get role success', rows: roles});
  } catch (err) {
    next(err);
  }
}

const getRoleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleId = req.payload.role;
    const roles = await role.getRoleById(roleId);
    return res.status(200).json({sucess: true, message: 'Get role success', rows: roles});
  } catch (err) {
    next(err);
  }
}

export { getAllRole, getRoleById }