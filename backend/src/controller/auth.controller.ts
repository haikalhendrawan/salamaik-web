import {Request, Response, NextFunction} from 'express';
import auth from "../model/auth.model";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import ErrorDetail  from "../model/error.model";
// -------------------------------------------------
type JwtPayloadType = {
  id: string;
  username: string;
  name: string;
  email: string;
  picture: string;
  kppn: string;
  role: number;
  period: number;
  status: number
}

// ------------------------------------------------------

const login = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const{ username, password } = req.body;
    const authInfo = await auth.login(username, password); // return object dengan informasi user

    //put activity log here

    const accessToken = jwt.sign(authInfo, process.env.JWT_KEY, {expiresIn:60*60*12});
    const refreshToken = jwt.sign(authInfo, process.env.JWT_REFRESH_KEY, {expiresIn:60*60*24});
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly`);
    return res.status(200).json({sucess: true, message: 'login success', authInfo: authInfo, accessToken: accessToken})
  }catch(err){
    next(err)
  }
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
      throw new ErrorDetail(401,'Authentication expired, please login again')
    };

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY) as JwtPayload;
    const authInfo: JwtPayloadType = {
      id: payload.id,
      username: payload.username,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      kppn: payload.kppn,
      role: payload.role,
      period: payload.period,
      status: payload.status
    };
    const newAccessToken = jwt.sign(authInfo, process.env.JWT_KEY, {expiresIn:60*60*12});
    const newRefreshToken = jwt.sign(authInfo, process.env.JWT_REFRESH_KEY, {expiresIn:60*60*24});

    res.cookie('refreshToken', newRefreshToken, {httpOnly:true});
    return res.status(200).json({sucess: true, message: 'token has been refreshed', authInfo: authInfo, accessToken: newAccessToken})
  }catch(err){
    next(err)
  }
};

const updateToken = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const userID = req.payload.id;
    if(!userID){
      throw new ErrorDetail(401,'Invalid jwt payload')
    };

    const response = await auth.updateToken(userID);
    const authInfo: JwtPayloadType = {
      id: response.id,
      username: response.username,
      name: response.name,
      email: response.email,
      picture: response.picture,
      kppn: response.kppn,
      role: response.role,
      period: response.period,
      status: response.status
    };
    const newAccessToken = jwt.sign(authInfo, process.env.JWT_KEY, {expiresIn:60*60*12});
    const newRefreshToken = jwt.sign(authInfo, process.env.JWT_REFRESH_KEY, {expiresIn:60*60*24});

    res.setHeader('Set-Cookie', `refreshToken=${newRefreshToken}; HttpOnly`);
    return res.status(200).json({sucess: true, message: 'token payload has been updated', token: newAccessToken})
  }catch(err){
    next(err)
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  const userID = req.payload.id;
  if(!userID){
    throw new ErrorDetail(401,'You are not logged in')
  };

  res.clearCookie('refreshToken', {httpOnly:true });
  return res.status(200).json({success: true, message:`User logged out`})
};




export {login, refresh, updateToken, logout};