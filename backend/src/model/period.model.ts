import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import ErrorDetail  from "./error.model";
import "dotenv/config"; 
// -------------------------------------------------

// ------------------------------------------------------
class Period{
  async getAllPeriod(){
    try{
      const q = "SELECT * FROM period_ref";
      const result = await pool.query(q);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async getPeriodById(id: number){
    try{
      const q = "SELECT * FROM period_ref WHERE id = $1";
      const result = await pool.query(q, [id]);;
      return result.rows;
    }catch(err){
      throw err;
    }
  }
}

const period = new Period();


export default period;