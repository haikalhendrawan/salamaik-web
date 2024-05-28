import pool from "../config/db";
import ErrorDetail  from "./error.model";
import { v4 as uuidv4 } from 'uuid';
import "dotenv/config";
import logger from "../config/logger"; 
// -------------------------------------------------

// ------------------------------------------------------
class Worksheet{
  async addWorksheet(kppnId: string, period: number){
    try{
      const id = uuidv4();
      const q = ` INSERT INTO worksheet_ref (id, kppn_id, period, status, open_period, close_period) 
                  VALUES ($1, $2, $3, $4, $5, $6) 
                  RETURNING *`;
      const result = await pool.query(q, [id, kppnId, period, 0, null, null]);
      return result.rows[0];
    }catch(err){
      throw err;
    }
  }

  async editWorksheetStatus(id: string, open: string, close: string){
    try{
      const q = ` UPDATE worksheet_ref
                  SET status = $1, open_period = $2, close_period = $3
                  WHERE id = $4
                  RETURNING *`;
      const result = await pool.query(q, [1, open, close, id]);
      return result.rows[0];
    }catch(err){
      throw err;
    }
  }

  async editWorksheetPeriod(id: string, open: string, close: string){
    try{
      const q = ` UPDATE worksheet_ref
                  SET open_period = $1, close_period = $2
                  WHERE id = $3
                  RETURNING *`;
      const result = await pool.query(q, [open, close, id]);
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