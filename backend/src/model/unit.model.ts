import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import ErrorDetail  from "./error.model";
import "dotenv/config"; 
// -------------------------------------------------

// ------------------------------------------------------
class Unit{
  async getAllUnit(){
    try{
      const q = "SELECT * FROM kppn_ref";
      const result = await pool.query(q);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async getUnitById(id: string){
    try{
      const q = "SELECT * FROM kppn_ref WHERE id = $1";
      const result = await pool.query(q, [id]);;
      return result.rows;
    }catch(err){
      throw err;
    }
  }
}

const unit = new Unit();


export default unit;