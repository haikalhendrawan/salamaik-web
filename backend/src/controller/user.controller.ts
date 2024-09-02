import {Request, Response, NextFunction} from 'express';
import user from '../model/user.model';
import ErrorDetail from '../model/error.model';
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { passwordSchema } from '../utils/schema';
import period from '../model/period.model';
import nonBlockingCall from '../utils/nonBlockingCall';
import activity from '../model/activity.model';
// ------------------------------------------------------
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const username = req.payload.username;
    const ip = req.ip || '';

    const role = req.payload.role;
    const kppn = req.payload.kppn;
    const isAdminKanwil = role === 4 || role === 99; // filter role user biasa di middleware
    const isSuperAdmin = role === 99;

    const result = isAdminKanwil 
                    ? isSuperAdmin 
                      ?await user.getAllUser()
                      : await user.getAllUserWtAdmin()
                    :await user.getUserKPPN(kppn);

    nonBlockingCall(activity.createActivity(username, 64, ip));

    return res.status(200).json({sucess: true, message: 'Get user success', rows: result})
  }catch(err){
    next(err)
  }
}

const addUser = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const ip = req.ip || '';

    const usernameIsUnique = await user.checkUsername(req.body.username);
    if(!usernameIsUnique) {
      return next(new ErrorDetail(400, 'NIP has been taken'))
    };

    const { username, name, email, password, kppn, gender} = req.body;
    if(!username  || !password || !email || !kppn){
      return next(new ErrorDetail(400, 'Required field contain null values'))
    };

    const validPassword = passwordSchema.safeParse(password);
    if(!validPassword){
      return next(new ErrorDetail(400,'Password criteria is not fulfilled'))
    };

    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 10);
    const picture = gender===0?'default-male.png':'default-female.png';
    const role = kppn.length===5? 3 : 1;
    const status = 0;
    const allPeriod = await period.getAllPeriod();
    const currPeriod = allPeriod[allPeriod?.length-1]?.id;

    const userBody = {
      id,
      username,
      name,
      email,
      password_hash,
      picture,
      period: currPeriod,
      role,
      status,
      kppn,
      gender,
    };

    const result = await user.addUser(userBody);

    nonBlockingCall(activity.createActivity(username, 65, ip));

    return res.status(200).json({sucess: true, message: 'User has been added', detail: result})
  }catch(err){
    next(err)
  }
}

const editUser = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const nip = req.payload.username;
    const ip = req.ip || '';

    const { id, username, name, email, kppn, gender} = req.body;
    if(!id || !username  || !name || !kppn || !email){
      return next(new ErrorDetail(400, 'Required field contain null values'))
    };

    if(username.length !== 18){
      throw new ErrorDetail(400, 'NIP must be 18 digits')
    };

    const {kppn: payloadKPPN, role} = req.payload;

    const isAllowed = (kppn === payloadKPPN) || (role===99 || role===4);

    if(!isAllowed){
      return next(new ErrorDetail(400, 'Unauthorized unit'))
    };
    
    const result = await user.editUser(req.body);

    nonBlockingCall(activity.createActivity(nip, 66, ip, username));

    return res.status(200).json({sucess: true, message: 'User has been edited', detail: result})
  }catch(err){
    next(err)
  }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const ip = req.ip || '';

    const targetId = req.body.id;
    const {kppn, role, username} = req.payload;
    const targetDetail = await user.getUserById(targetId);
    const targetKPPN = targetDetail.kppn;
    const isAllowed = (targetKPPN === kppn) || (role===99 || role===4);

    if(!isAllowed){
      return next(new ErrorDetail(400, 'Unauthorized unit'))
    };

    const result = await user.deleteUser(targetId);

    nonBlockingCall(activity.createActivity(username, 67, ip, username));

    return res.status(200).json({sucess: true, message: 'Delete user success', detail: result})
  }catch(err){
    next(err)
  }
}

const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const ip = req.ip || '';

    const {kppn, role, username} = req.payload;
    const targetId = req.body.id;
    const targetDetail = await user.getUserById(targetId);
    const targetKPPN = targetDetail.kppn;
    const isAllowed = (targetKPPN === kppn) || (role===99 || role===4);

    if(!isAllowed){
      return next(new ErrorDetail(400, 'Unauthorized unit'))
    };

    const result = await user.updateStatus(targetId);

    nonBlockingCall(activity.createActivity(username, 68, ip, targetId));

    return res.status(200).json({sucess: true, message: 'User has been activated', detail: result})
  }catch(err){
    next(err)
  }
}

const demoteStatus = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const ip = req.ip || '';

    const {kppn, role, username} = req.payload;
    const targetId = req.body.id;
    const targetDetail = await user.getUserById(targetId);
    const targetKPPN = targetDetail.kppn;
    const isAllowed = (targetKPPN === kppn) || (role===99 || role===4);

    if(!isAllowed){
      return next(new ErrorDetail(400, 'Unauthorized unit'))
    };

    const result = await user.demoteStatus(targetId);

    nonBlockingCall(activity.createActivity(username, 69, ip, targetId));

    return res.status(200).json({sucess: true, message: 'User has been deactivated', detail: result})
  }catch(err){
    next(err)
  }
}

const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const ip = req.ip || '';
    const username = req.payload.username;

    const {oldRole, newRole, adminRole, targetId} = req.body;

    if(oldRole === newRole){
      return res.status(200).json({sucess: true, message: 'Role is not changed'})
    };

    if(adminRole===2 && newRole >2){ // utk role yang masuk udh di filter di middleware antara 2, 4, dan 99
      return next(new ErrorDetail(400, 'Unauthorized, you cannot set kanwil role'))
    };

    if(adminRole===4 && newRole ===99){ // utk role yang masuk udh di filter di middleware antara 2, 4, dan 99
      return next(new ErrorDetail(400, 'Unauthorized'))
    };

    const result = await user.updateRole(targetId, newRole);

    nonBlockingCall(activity.createActivity(username, 70, ip, `targetId:${targetId}, oldRole:${oldRole}, newRole: ${newRole}`));

    return res.status(200).json({sucess: true, message: 'Role updated', rows: result})
  }catch(err){
    next(err)
  }
}

export { getUser, addUser, editUser, deleteUser, updateStatus, demoteStatus, updateRole }