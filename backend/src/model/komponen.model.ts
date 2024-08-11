import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import ErrorDetail  from "./error.model";
import "dotenv/config"; 
// -------------------------------------------------
export interface KomponenType{
  id: number,
  title: string,
  bobot: number,
  detail: string | null,
  alias: string
};

export interface SubKomponenType{
  id: number,
  title: string,
  komponen_id: number,
  detail: string | null,
  alias: string
};

export interface KomponenWithSubKomponen{
  id: number,
  title: string,
  bobot: number,
  detail: string | null,
  alias: string,
  subkomponen: SubKomponenType[]
}
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

  async getAllKomponenWithSubKomponen(): Promise<KomponenWithSubKomponen[]>{
    try{
      const q = ` SELECT komponen_ref.*, json_agg(subkomponen_ref.* ORDER BY subkomponen_ref.id ASC) AS subkomponen 
                  FROM komponen_ref 
                  INNER JOIN subkomponen_ref ON komponen_ref.id = subkomponen_ref.komponen_id 
                  GROUP BY komponen_ref.id
                  ORDER BY komponen_ref.id ASC`;
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

