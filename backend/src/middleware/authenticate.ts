import { Request, Response, NextFunction } from 'express';
import jwt from"jsonwebtoken";
import "dotenv/config";
import ErrorDetail from "../model/error.model";

//Middleware untuk memastikan yg request memiliki token (minimal user biasa)
const authenticate= (req: Request, res: Response, next: NextFunction)=>{               
    const headerReceived= req.headers.authorization;
    if(headerReceived){
        const token = headerReceived.split(" ")[1];  // Bearer xxxxx
        jwt.verify(token, process.env.JWT_KEY, (err, payload)=>{
            if(err){
                throw new ErrorDetail(401, "Invalid access token provided", err);
            };
            req.payload=payload;
            next(); 
        });
    }else{
      throw new ErrorDetail(401, "Not authenticated");
    }
}

export default authenticate;