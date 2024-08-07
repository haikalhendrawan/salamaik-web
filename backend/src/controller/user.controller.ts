import {Request, Response, NextFunction} from 'express';
import user from '../model/user.model';
import ErrorDetail from '../model/error.model';
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { passwordSchema } from '../utils/schema';
// ------------------------------------------------------
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const role = req.payload.role;
    const kppn = req.payload.kppn;

    const result = role===4 || role===99 ? await user.getAllUser(): await user.getUserKPPN(kppn);
    return res.status(200).json({sucess: true, message: 'Get user success', rows: result})
  }catch(err){
    next(err)
  }
}

const addUser = async (req: Request, res: Response, next: NextFunction) => {
  try{
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
    const period = 0;

    const userBody = {
      id,
      username,
      name,
      email,
      password_hash,
      picture,
      period,
      role,
      status,
      kppn,
      gender,
    };

    const result = await user.addUser(userBody);
    return res.status(200).json({sucess: true, message: 'User has been added', detail: result})
  }catch(err){
    next(err)
  }
}

const editUser = async (req: Request, res: Response, next: NextFunction) => {
  try{  
    const { id, username, name, email, kppn, gender} = req.body;
    if(!id || !username  || !name || !kppn || !email){
      return next(new ErrorDetail(400, 'Required field contain null values'))
    };
  
    const result = await user.editUser(req.body);
    return res.status(200).json({sucess: true, message: 'User has been edited', detail: result})
  }catch(err){
    next(err)
  }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const targetID = req.body.id;
    const result = await user.deleteUser(targetID);
    return res.status(200).json({sucess: true, message: 'Delete user success', detail: result})
  }catch(err){
    next(err)
  }
}

const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const targetID = req.body.id;
    const result = await user.updateStatus(targetID);
    return res.status(200).json({sucess: true, message: 'User has been activated', detail: result})
  }catch(err){
    next(err)
  }
}

const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { oldRole, newRole, adminRole, targetId} = req.body;

    if(oldRole === newRole){
      return res.status(200).json({sucess: true, message: 'Role is not changed'})
    };

    if(adminRole===2 && newRole >2){ // utk role yang masuk udh di filter di middleware antara 2, 4, dan 99
      return next(new ErrorDetail(400, 'Unauthorized, you cannot set kanwil role'))
    };

    if(adminRole===4 && newRole ===4){ // utk role yang masuk udh di filter di middleware antara 2, 4, dan 99
      return next(new ErrorDetail(400, 'Unauthorized, untuk menambahkan role admin kanwil dilakukam oleh super admin'))
    };

    const result = await user.updateRole(targetId, newRole);
    return res.status(200).json({sucess: true, message: 'Role updated', rows: result})
  }catch(err){
    next(err)
  }
}

export { getUser, addUser, editUser, deleteUser, updateStatus, updateRole }