/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import ErrorDetail  from "./error.model";
import "dotenv/config"; 
import {v4 as uuidv4} from "uuid";
// -------------------------------------------------

// ------------------------------------------------------
class OTPToken{
  async addToken(userId: string, type: number, timeDiff: number){
    try{
      const q = ` INSERT INTO otp_token (id, user_nip, type, created_at, expired_at, otp)
                  VALUES ($1, $2, $3, $4, $5, $6)
                  RETURNING *`;
      const currentTime = new Date(Date.now()).toISOString();
      const expireTime = new Date(Date.now()+ timeDiff).toISOString();
      const tokenId = uuidv4();
      const otp = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const result = await pool.query(q, [tokenId, userId, type, currentTime, expireTime, otp]);
      return {tokenId, expireTime, otp}
    }catch(err){
      throw err;
    }
  }

  async verifyToken(userId: string, token: string, otp: string){
    try{
      const q = `SELECT * FROM otp_token WHERE id = $1 AND user_nip = $2`; 
      const result = await pool.query(q, [token, userId]);
      
      if(result.rowCount === 0){
        return false
      };

      if(new Date(result.rows[0].expired_at).getTime() < Date.now()){
        return false
      };

      return true
    }catch(err){
      return false
    }
    
  }
}

const otpToken = new OTPToken();


export default otpToken;