import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import ErrorDetail  from "./error.model";
import "dotenv/config"; 
// -------------------------------------------------
export interface PeriodType{
  id: number;
  name: string; 
  even_period: 0;
  semester: number;
  tahun: number
};
// ------------------------------------------------------
class Period{
  async getAllPeriod(): Promise<PeriodType[]>{
    try{
      const q = "SELECT * FROM period_ref ORDER BY tahun, semester ASC";
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

  async addPeriod(semester: number, tahun: number){
    try{
      const q = "INSERT INTO period_ref (name, semester, tahun, even_period) VALUES ($1, $2, $3, $4) RETURNING *";
      const name = `Semester ${semester} ${tahun}`;
      const isEvenPeriod = semester === 2 ? 1 : 0;
      const result = await pool.query(q, [name, semester, tahun, isEvenPeriod]);
      return result.rows[0]
    }catch(err){
      throw err;
    }
  }

  async checkPeriodExist(semester: number, tahun: number){
    try{
      const q = "SELECT * FROM period_ref WHERE semester = $1 AND tahun = $2";
      const result = await pool.query(q, [semester, tahun]);
      return result.rows.length > 0;
    }catch(err){
      throw err;
    }
  }

  async deletePeriodById(id: number){
    try{
      const q = "DELETE FROM period_ref WHERE id = $1 RETURNING *";
      const result = await pool.query(q, [id]);
      return result.rows[0];
    }catch(err){
      throw err;
    }
  }
}

const period = new Period();


export default period;