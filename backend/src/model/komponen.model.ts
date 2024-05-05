import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import ErrorDetail  from "./error.model";
import "dotenv/config"; 
// -------------------------------------------------

// ------------------------------------------------------
class Komponen{
  async getAllKomponen(){
    try{
      const q = "SELECT * FROM komponen_ref ORDER BY id ASC";
      const result = await pool.query(q);
      return result.rows;
    }catch(err){
      throw err;
    }
  }
}

const komponen = new Komponen();

class SubKomponen{
  async getAllSubKomponen(){
    try{
      const q = "SELECT * FROM subkomponen_ref ORDER BY id ASC";
      const result = await pool.query(q);
      return result.rows;
    }catch(err){
      throw err;
    }
  }
}

const subKomponen = new SubKomponen();

class SubSubKomponen{
  async getAllSubSubKomponen(){
    try{
      const q = "SELECT * FROM subsubkomponen_ref ORDER BY id ASC";
      const result = await pool.query(q);
      return result.rows;
    }catch(err){
      throw err;
    }
  }
}

const subSubKomponen = new SubSubKomponen();


export {komponen, subKomponen, subSubKomponen};

