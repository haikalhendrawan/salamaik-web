import jwt from"jsonwebtoken";
import "dotenv/config";
import ErrorDetail from "../model/error.model";
import { Socket } from "socket.io";

type JwtPayloadType = {
  id: string;
  username: string;
  name: string;
  email: string;
  picture: string;
  kppn: string;
  role: number;
  period: number;
  status: number;
};


//Middleware untuk memastikan yg request memiliki token --> utk websocket
const socketAuthenticate= (socket: Socket, next: any) => {
  const token = socket.handshake.auth.token;

  if(!token){
    return next(new ErrorDetail(401, "Not authenticated"));
  };

  jwt.verify(token, process.env.JWT_KEY, (err: any, payload: any)=>{

    if(err){
      return next(new ErrorDetail(401, "Invalid access token provided", err));
    };

    socket.data.payload = payload;

    next(); 
  });
  
}

export default socketAuthenticate