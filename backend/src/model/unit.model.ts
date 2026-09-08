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
export type KPPNTipe = 'A1' | 'A2' | 'Kh' | 'K1' | 'K2' | 'K3';

export interface UnitType{
  id: string;
  name: string;
  alias: string;
  kk_name: string;
  kk_nip: string;
  info: string;
  col_order: number;
  level: number;
  tipe: KPPNTipe | null;
  provinsi: 0 | 1;
};
// ------------------------------------------------------
class Unit{
  async getAllUnit(): Promise<UnitType[]> {
    try{
      const q = "SELECT * FROM kppn_ref ORDER BY col_order ASC";
      const result = await pool.query(q);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async getAllKPPN(): Promise<UnitType[]> {
    try{
      const q = "SELECT * FROM kppn_ref WHERE level = $1 ORDER BY col_order ASC";
      const result = await pool.query(q, [0]);
      return result.rows;
    }catch(err){
      throw err;
    }
  }

  async getUnitById(id: string): Promise<UnitType[]> {
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
