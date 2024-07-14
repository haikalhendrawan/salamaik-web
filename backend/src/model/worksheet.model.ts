import pool from "../config/db";
import ErrorDetail  from "./error.model";
import { v4 as uuidv4 } from 'uuid';
import "dotenv/config";
import logger from "../config/logger"; 
/**
 *
 *
 * @class Worksheet
 */
// -------------------------------------------------
interface WorksheetType{
  id: string, 
  kppn_id: string,
  name: string, 
  alias: string,
  period: number,
  status: number,
  open_period: string,
  close_period: string,
  created_at: string,
  updated_at: string
}
// ------------------------------------------------------

class Worksheet{
  async getWorksheetByPeriod(period: number){
    try{
      const q = ` SELECT worksheet_ref.*, kppn_ref.name, kppn_ref.alias 
                  FROM worksheet_ref
                  INNER JOIN kppn_ref ON kppn_ref.id = worksheet_ref.kppn_id 
                  WHERE period = $1 AND kppn_ref.level = $2`;
      const result = await pool.query(q, [period, 0]);
      return result.rows;
    }catch(err){
      throw err;
    }  
  }

  async getWorksheetByPeriodAndKPPN(period: number, kppnId: string){
    try{
      const q = ` SELECT *
                  FROM worksheet_ref
                  WHERE period = $1 AND kppn_id = $2`;
      const result = await pool.query(q, [period, kppnId]);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async addWorksheet(kppnId: string, period: number, startDate: string, closeDate: string){
    try{
      const id = uuidv4();
      const q = ` INSERT INTO worksheet_ref (id, kppn_id, period, status, open_period, close_period) 
                  VALUES ($1, $2, $3, $4, $5, $6) 
                  RETURNING *`;
      const result = await pool.query(q, [id, kppnId, period, 0, startDate, closeDate]);
      return result.rows[0];
    }catch(err){
      throw err;
    }
  }

  async checkWorksheetExist(kppnId: string, period: number){
    try{
      const q = `SELECT * FROM worksheet_ref WHERE kppn_id = $1 AND period = $2`;
      const result = await pool.query(q, [kppnId, period]);
      return result.rows.length > 0;
    }catch(err){
      throw err;
    }
  }

  async editWorksheetStatus(id: string){
    try{
      const q = ` UPDATE worksheet_ref
                  SET status = $1
                  WHERE id = $2
                  RETURNING *`;
      const result = await pool.query(q, [1, id]);
      return result.rows[0];
    }catch(err){
      throw err;
    }
  }

  async editWorksheetPeriod(id: string, startDate: string, closeDate: string){
    try{
      const q = ` UPDATE worksheet_ref
                  SET open_period = $1, close_period = $2
                  WHERE id = $3
                  RETURNING *`;
      const result = await pool.query(q, [startDate, closeDate, id]);
      return result.rows[0];
    }catch(err){
      throw err;
    }
  }

  async deleteWorksheet(id: string){
    try{
      const q = `DELETE FROM worksheet_ref WHERE id = $1 RETURNING *`;
      const result = await pool.query(q, [id]);
      return result.rows[0];
    }catch(err){
      throw err;
    }
  }
}

const worksheet= new Worksheet();

export default worksheet;