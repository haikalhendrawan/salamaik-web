import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import ErrorDetail  from "./error.model";
import "dotenv/config"; 
// -------------------------------------------------

// ------------------------------------------------------
class Profile{
  async updateCommonProfile(id: string, name: string, username: string, email: string, period: number){
    try{
      const q = "UPDATE user_ref SET name = $1, username = $2, email = $3, period = $4 WHERE id = $5 RETURNING *";
      const result = await pool.query(q, [name, username, email, period, id]);
      return result
    }catch(err){
      throw err;
    }
  }

}

const profile = new Profile();


export default profile;