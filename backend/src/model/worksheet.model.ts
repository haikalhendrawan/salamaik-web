import pool from "../config/db";
import { Pool, PoolClient } from "pg";
import ErrorDetail  from "./error.model";
import { v4 as uuidv4 } from 'uuid';
import "dotenv/config";
/**
 *
 *
 * @class Worksheet
 */
// -------------------------------------------------
export interface WorksheetType{
  id: string, 
  kppn_id: string,
  name: string, 
  alias: string,
  period: number,
  status: number,
  open_period: string,
  close_period: string,
  created_at: string,
  updated_at: string,
  matrix_status: number,
  open_follow_up: string,
  close_follow_up: string
}
// ------------------------------------------------------

class Worksheet{
  async getWorksheetByPeriod(period: number){
    try{
      const q = ` SELECT worksheet_ref.*, kppn_ref.name, kppn_ref.alias 
                  FROM worksheet_ref
                  INNER JOIN kppn_ref ON kppn_ref.id = worksheet_ref.kppn_id 
                  WHERE period = $1 AND kppn_ref.level = $2
                  ORDER BY kppn_ref.col_order`;
      const result = await pool.query(q, [period, 0]);
      return result.rows
    }catch(err){
      throw err;
    }  
  }

  async getWorksheetByPeriodAndKPPN(period: number, kppnId: string, poolTrx?: PoolClient): Promise<WorksheetType[]>{
    const poolInstance = poolTrx??pool;
    try{
      const q = ` SELECT *
                  FROM worksheet_ref
                  WHERE period = $1 AND kppn_id = $2`;
      const result = await poolInstance.query(q, [period, kppnId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async addWorksheet(kppnId: string, period: number, startDate: string, closeDate: string, openFollowUp: string, closeFollowUp: string){
    try{
      const id = uuidv4();
      const q = ` INSERT INTO worksheet_ref (id, kppn_id, period, status, open_period, close_period, matrix_status, open_follow_up, close_follow_up) 
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                  RETURNING *`;
      const result = await pool.query(q, [id, kppnId, period, 0, startDate, closeDate, 0, openFollowUp, closeFollowUp]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }

  async checkWorksheetExist(kppnId: string, period: number){
    try{
      const q = `SELECT * FROM worksheet_ref WHERE kppn_id = $1 AND period = $2`;
      const result = await pool.query(q, [kppnId, period]);
      return result.rows.length > 0
    }catch(err){
      throw err
    }
  }

  async editWorksheetStatus(id: string, poolTrx?: PoolClient){
    const poolInstance = poolTrx??pool;
    const updateTime = new Date(Date.now()).toISOString();
    try{
      const q = ` UPDATE worksheet_ref
                  SET status = $1, updated_at = $2
                  WHERE id = $3
                  RETURNING *`;
      const result = await poolInstance.query(q, [1, updateTime, id]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }

  async editWorksheetMatrixStatus(id: string, matrixStatus: number, poolTrx?: PoolClient){
    const poolInstance = poolTrx??pool;
    const updateTime = new Date(Date.now()).toISOString();
    try{
      const q = ` UPDATE worksheet_ref
                  SET matrix_status = $1, updated_at = $2
                  WHERE id = $3
                  RETURNING *`;
      const result = await poolInstance.query(q, [matrixStatus, updateTime, id]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }

  async editWorksheetPeriod(id: string, startDate: string, closeDate: string, openFollowUp: string, closeFollowUp: string){
    try{
      const updateTime = new Date(Date.now()).toISOString();
      const q = ` UPDATE worksheet_ref
                  SET open_period = $1, close_period = $2, updated_at = $3, open_follow_up = $4, close_follow_up = $5
                  WHERE id = $6
                  RETURNING *`;
      const result = await pool.query(q, [startDate, closeDate, updateTime, openFollowUp, closeFollowUp, id]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }

  async deleteWorksheet(id: string){
    try{
      const q = `DELETE FROM worksheet_ref WHERE id = $1 RETURNING *`;
      const result = await pool.query(q, [id]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }
}

const worksheet= new Worksheet();

export default worksheet;