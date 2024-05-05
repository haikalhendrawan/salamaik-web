import {Request, Response, NextFunction} from 'express';
import auth from "../model/auth.model";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import ErrorDetail  from "../model/error.model";
import otpToken from '../model/token.model';
import user from '../model/user.model';
import transporter from '../config/mailer';
import "dotenv/config";
import {z} from 'zod';
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
};

const passwordSchema =  z
                      .string()
                      .regex(
                        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        'Minimum 8 characters, at least one letter and one number'
                      );
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
}

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
}

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
    return res.status(200).json({sucess: true, message: 'token payload has been updated', authInfo: authInfo, accessToken: newAccessToken})
  }catch(err){
    next(err)
  }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
  const userID = req.payload.id;
  if(!userID){
    throw new ErrorDetail(401,'You are not logged in')
  };

  res.clearCookie('refreshToken', {httpOnly:true });
  return res.status(200).json({success: true, message:`User logged out`})
}

const getForgotPasswordToken = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const {username, email} = req.body;
    const userEmailIsValid = await auth.verifyUserEmail(username, email);

    if(!userEmailIsValid){
      throw new ErrorDetail(404,'Invalid username or email')
    };

    const timeDiff =  150000; //2 menit + buffer 30 detik
    const {tokenId, expireTime, otp} = await otpToken.addToken(username, 0, timeDiff);

    const info = await transporter.sendMail({
      from: `"Salamaik" <${process.env.EMAIL_USERNAME}>`, 
      to: `${email}`, 
      subject: "Salamaik - Forgot Password", 
      html:emailHTML(email, otp)
    });

    return res.status(200).json({
      success: true, 
      message:`Otp has been sent to ${email}`, 
      otp: otp,
      token: tokenId, 
      detail: info
    })
  }catch(err){
    next(err)
  }
}

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nip, password, confirmPassword, token, otp } = req.body;
    if(password !== confirmPassword){
      return next(new ErrorDetail(400,'Password does not match'))
    };

    const validPassword = passwordSchema.safeParse(password);
    if(!validPassword){
      return next( new ErrorDetail(400,'Password criteria is not fulfilled'))
    };

    const tokenIsValid = await otpToken.verifyToken(nip, token, otp);
    if(!tokenIsValid){
      return next( new ErrorDetail(400,'Token is not valid, please generate new OTP'))
    };

    const response = await auth.updatePassword(nip, password);
    return res.status(200).json({sucess: true, message: 'Password has been updated', detail: response});
  } catch (err) {
    next(err);
  }
}

const getRegisterToken = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const {username, email} = req.body;
    const emailIsValid = await user.checkEmail(email);
    const nipIsValid = await user.checkUsername(username);

    if(!emailIsValid){
      return next( new ErrorDetail(400,'Email has been taken'))
    };

    if(!nipIsValid){
      return next( new ErrorDetail(400,'NIP has been taken'))
    };

    if(!emailIsValid && !nipIsValid){
      return next( new ErrorDetail(400,'Email and NIP has been taken'))
    };

    const timeDiff =  150000; //2 menit + buffer 30 detik
    const {tokenId, expireTime, otp} = await otpToken.addToken(username, 0, timeDiff);

    const info = await transporter.sendMail({
      from: `"Salamaik" <${process.env.EMAIL_USERNAME}>`, 
      to: `${email}`, 
      subject: "Salamaik - Register", 
      html:emailHTML(email, otp)
    });

    return res.status(200).json({
      success: true, 
      message:`Otp has been sent to ${email}`, 
      otp: otp,
      token: tokenId, 
    })
  }catch(err){
    next(err)
  }
}

const verifyRegister = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { nip, token, otp } = req.body;

    const tokenIsValid = await otpToken.verifyToken(nip, token, otp);
    if(!tokenIsValid){
      return next(new ErrorDetail(400,'Token is not valid, please generate new OTP'))
    };

    return res.status(200).json({sucess: true, message: 'Token verified'});
  }catch(err){
    next(err)
  }
}


export {login, refresh, updateToken, logout, getForgotPasswordToken, forgotPassword, getRegisterToken, verifyRegister}


//--------------------------------------------------------------------------------------
function emailHTML(email: string, otp: string){
  return (
    `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
        <h1 style="color:#8f0916">Salamaik</h6>
        </div>
        <p>Hi ${email},</p>
        <p>Gunakan kode OTP berikut untuk menyelesaikan pendaftaran. OTP valid untuk 1 menit</p>
        <h2 style="background: #8f0916;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>Kanwil DJPb Sumbar</p>
          <p>Jl. Khatib Sulaiman No.3,Kota Padang</p>
          <p>Sumatera Barat</p>
        </div>
      </div>
    </div>`)
}