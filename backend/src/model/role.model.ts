import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import ErrorDetail  from "./error.model";
import "dotenv/config"; 
// -------------------------------------------------

// ------------------------------------------------------
class Role{
  async getAllRole(){
    try{
      const q = "SELECT * FROM role_ref";
      const result = await pool.query(q);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async getRoleById(id: number){
    try{
      const q = "SELECT * FROM role_ref WHERE id = $1";
      const result = await pool.query(q, [id]);;
      return result.rows;
    }catch(err){
      throw err;
    }
  }
}

const role = new Role();


export default role;