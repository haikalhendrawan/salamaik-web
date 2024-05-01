import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import ErrorDetail  from "./error.model";
import "dotenv/config"; 
// -------------------------------------------------
interface UnitType{
  id: string;
  name: string;
  alias: string;
  kk_name: string;
  kk_nip: string;
  info: string
}
// ------------------------------------------------------
class Unit{
  async getAllUnit(){
    try{
      const q = "SELECT * FROM kppn_ref ORDER BY col_order ASC";
      const result = await pool.query(q);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async getUnitById(id: string){
    try{
      const q = "SELECT * FROM kppn_ref WHERE id = $1 ORDER BY col_order ASC";
      const result = await pool.query(q, [id]);;
      return result.rows;
    }catch(err){
      throw err;
    }
  }
}

const unit = new Unit();


export default unit;