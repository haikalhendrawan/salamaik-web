/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import pool from "../config/db";
// -------------------------------------------------
export interface MiscType{
  id: number;
  misc_id:number;
  value:string;
  detail_1:string | null;
  detail_2:string | null;
  detail_3:string | null;
}
// -------------------------------------------------
class Misc{
  async getMiscByType(miscId: number){
    try{
      const q = `SELECT * FROM misc_data WHERE misc_id = $1`;
      const result = await pool.query(q, [miscId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async addMisc(miscId: number, value: string, detail_1?: string | null, detail_2?: string | null, detail_3?: string | null){
    try{
      const q = `INSERT INTO misc_data (misc_id, value, detail_1, detail_2, detail_3) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      const result = await pool.query(q, [miscId, value, detail_1, detail_2, detail_3]);
      return result.rows[0]
    }catch(err){  
      throw err
    }
  }

  async deleteMiscById(id: number){
    try{
      const q = `DELETE FROM misc_data WHERE id = $1`;
      const result = await pool.query(q, [id]);
      return result
    }catch(err){
      throw err
    }
  }
}

const misc = new Misc;
export default misc