import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import ErrorDetail  from "./error.model";
import "dotenv/config"; 
// -------------------------------------------------
type JwtPayloadType = {
  id: string;
  username: string;
  name: string;
  email: string;
  picture: string;
  kppn: number;
  role: number;
  period: number;
}

// ------------------------------------------------------
class Auth{

  async login(username: string, password: string){
    try{
      const q1 = "SELECT * FROM user_ref WHERE username = $1";
      const result = await pool.query(q1, [username]);

      if(result.rowCount === 0){
        throw new ErrorDetail(404,'Invalid username')
      };

      const hashedPassword = result.rows[0].password_hash;
      const match = await bcrypt.compare(password, hashedPassword)
      if(match){
        const authInfo = {
          id: result.rows[0].id,
          username: result.rows[0].username,
          name: result.rows[0].name,
          email: result.rows[0].email,
          picture: result.rows[0].picture,
          kppn: result.rows[0].kppn,
          role: result.rows[0].role,
          period: result.rows[0].period,
        };
        return authInfo
      }else{
        throw new ErrorDetail(404,'Invalid password')
      }
    }catch(err){
      throw err
    }
  }

  async updateToken(userID: string){
    try{
      const q1 = "SELECT * FROM user_ref WHERE id = $1";
      const result = await pool.query(q1, [userID]);

      if(result.rowCount === 0){
        throw new ErrorDetail(404,'Invalid UUID provided')
      };

      return result.rows[0]
    }catch(err){
      throw err
    }
  }


}

const auth = new Auth();

export default auth;