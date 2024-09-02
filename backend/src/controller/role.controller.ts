import {Request, Response, NextFunction} from 'express';
import role from '../model/role.model';
import nonBlockingCall from '../utils/nonBlockingCall';
import activity from '../model/activity.model';
// -------------------------------------------------
interface PeriodType{
  id: number;
  title: string;
  description: string | null
}
// ------------------------------------------------------
const getAllRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.payload.username;
    const ip = req.ip || '';

    const roles: PeriodType[] = await role.getAllRole();

    nonBlockingCall(activity.createActivity(username, 54, ip));

    return res.status(200).json({sucess: true, message: 'Get role success', rows: roles});
  } catch (err) {
    next(err);
  }
}

const getRoleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.payload.username;
    const ip = req.ip || '';

    const roleId = req.payload.role;
    const roles = await role.getRoleById(roleId);

    nonBlockingCall(activity.createActivity(username, 55, ip));

    return res.status(200).json({sucess: true, message: 'Get role success', rows: roles});
  } catch (err) {
    next(err);
  }
}

export { getAllRole, getRoleById }