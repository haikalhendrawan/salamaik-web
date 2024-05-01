import {Request, Response, NextFunction} from 'express';
import user from '../model/user.model';
import ErrorDetail from '../model/error.model';
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
// -------------------------------------------------
interface UserBodyType{
  username: string;
  name: string;
  email: string;
  password_hash: string;
  picture: string;
  period: number;
  role: number;
  status: number;
  kppn: string;
  gender: number;
}
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
      return next(new ErrorDetail(400, 'NIP has been taken')); 
    };

    const { username, name, email, password, kppn, gender} = req.body;
    if(!username  || !password || !kppn){
      return next(new ErrorDetail(400, 'Required field contain null values'));
    };

    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 10);
    const picture = gender===0?'default-male.png':'default-female.png';
    const role = kppn.length===5? 3 : 1;
    const status = 0;

    const userBody = {
      id,
      username,
      name,
      email,
      password_hash,
      picture,
      period: 0,
      role,
      status,
      kppn,
      gender,
    };

    const result = await user.addUser(userBody);
    return res.status(200).json({sucess: true, message: 'User has been added', rows: result})
  }catch(err){
    next(err)
  }
}

const editUser = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const newUsernameIsUnique = await user.checkUsername(req.body.username);
    if(!newUsernameIsUnique) {
      return next(new ErrorDetail(400, 'NIP has been taken')); 
    };
  
    const { id, username, name, email, period, role, status, kppn, gender} = req.body;
    if(!id || !username  || !name || !kppn || !role || !status || !period){
      return next(new ErrorDetail(400, 'Required field contain null values'));
    };
  
    const result = await user.editUser(req.body);
    return res.status(200).json({sucess: true, message: 'User has been edited', rows: result})
  }catch(err){
    next(err)
  }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const targetID = req.body.id;
    const result = await user.deleteUser(targetID);
    return res.status(200).json({sucess: true, message: 'Delete user success', rows: result})
  }catch(err){
    next(err)
  }
}

export { getUser, addUser, editUser, deleteUser }