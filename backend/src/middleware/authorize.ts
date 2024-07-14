import { Request, Response, NextFunction } from 'express';
import jwt from"jsonwebtoken";
import "dotenv/config";
import ErrorDetail from "../model/error.model";
// -------------------------------------------------------------------------------------

//Middleware untuk memastikan yg request memiliki level yang sesuai
const authorize= (allowedRole: number[]) => (req: Request, res: Response, next: NextFunction)=>{               
  const {role} = req.payload;

  if(allowedRole.includes(role)){
    return next();
  };

  return res.status(401).json({sucess: false, message: 'Unauthorized to access this content'})
}

export default authorize;