/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import ErrorDetail  from "./error.model";
import "dotenv/config"; 
// -------------------------------------------------
interface StandardizationType{
  id: number;
  title: string;
  cluster: number;
  interval: number
};

interface StandardizationJunctionType{
  id: number;
  kppn_id: number;
  period_id: number;
  standardization_id: number
  month: number;
  file: string;
  uploaded_at: string
};
// ------------------------------------------------------
class Standardization{
  async getStandardization(): Promise<StandardizationType[]> {
    try{
      const q = "SELECT * FROM standardization_ref ORDER BY id ASC";
      const result = await pool.query(q);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async getStandardizationJunction(kppnId: string, periodId: number): Promise<StandardizationJunctionType[]> {
    try{
      const q = "SELECT * FROM standardization_junction WHERE kppn_id = $1 AND period_id = $2";
      const result = await pool.query(q, [kppnId, periodId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async getStandardizationById(junctionId: number){
    try{
      const q = "SELECT * FROM standardization_junction WHERE id = $1";
      const result = await pool.query(q, [junctionId]);
      return result.rows[0]
    }
    catch(err){
      throw err
    }
  }

  async addStandardizationJunction(kppnId: number, periodId: number, standardizationId: number, month: string, fileName: string){
    try{
      const q = "INSERT INTO standardization_junction (kppn_id, period_id, standardization_id, month, file) VALUES ($1, $2, $3, $4, $5) RETURNING *";
      const result = await pool.query(q, [kppnId, periodId, standardizationId, month, fileName]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }
  async getStdFileNameCollection(kppnId: string, month: number, period: number){
    try{
      const q = ` SELECT standardization_junction.file, standardization_ref.title, standardization_ref.cluster
                  FROM standardization_junction 
                  INNER JOIN standardization_ref ON standardization_junction.standardization_id = standardization_ref.id
                  WHERE kppn_id = $1 AND month = $2 AND period_id = $3`;
      const result = await pool.query(q, [kppnId, month, period]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async deleteStandardizationJunction(id: number){
    try{
      const q = "DELETE FROM standardization_junction WHERE id = $1 RETURNING *";
      const result = await pool.query(q, [id]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }
}

const standardization = new Standardization();

export default standardization;