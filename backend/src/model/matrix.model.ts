import pool from "../config/db";
import "dotenv/config";
import { PoolClient } from "pg";
/**
 *
 *
 * @class Matrix
 */
// -------------------------------------------------
export interface MatrixType{
  id: number,
  wsJunction_id: number,
  worksheet_id: string,
  checklist_id: number,
  hasil_implementasi: string,
  permasalahan: string, 
  rekomendasi: string,
  peraturan: string,
  uic: string,
  tindak_lanjut: string, 
  isFinding: number
};

export interface MatrixBodyType{
  id?: number,
  worksheetId: string,
  wsJunctionId: number,
  checklistId: number,
  hasilImplementasi: string | null,
  rekomendasi: string | null,
  permasalahan: string | null, 
  peraturan: string | null,
  uic: string | null,
  tindakLanjut: string | null, 
  isFinding: number
}

export interface MatrixWithWsJunctionType{
  id: number,
  wsJunction_id: number,
  worksheet_id: string,
  checklist_id: number,
  hasil_implementasi: string,
  permasalahan: string, 
  rekomendasi: string,
  peraturan: string,
  uic: string,
  tindak_lanjut: string, 
  isFinding: number,
  junction_id: number,
  kanwil_score: number | null,
  kppn_score: number | null,
  file_1: string | null,
  file_2: string | null,
  file_3: string | null,
  kanwil_note: string | null,
  kppn_id: string,
  period: string,
  last_update: string | null,
  updated_by: string | null
}

// --------------------------------------------------
class Matrix{

  async addMatrix(body: MatrixBodyType, poolTrx?: PoolClient){
    const poolInstance = poolTrx??pool;
    try{
      const {worksheetId, wsJunctionId, checklistId, hasilImplementasi, permasalahan, rekomendasi, peraturan, uic, tindakLanjut, isFinding} = body;
      const q = ` INSERT INTO matrix_data (
                    worksheet_id, 
                    wsJunction_id, 
                    checklist_id,
                    hasil_implementasi,
                    permasalahan, 
                    rekomendasi, 
                    peraturan,
                    uic, 
                    tindak_lanjut, 
                    isFinding
                  ) 
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
                  RETURNING *`;

      const result = await poolInstance.query(q, [
        worksheetId, 
        wsJunctionId, 
        checklistId, 
        hasilImplementasi,
        permasalahan,
        rekomendasi, 
        peraturan, 
        uic, 
        tindakLanjut, 
        isFinding
      ]);
      return result.rows[0]
    }catch(err){
      throw err
    }

  }

  async getMatrixByWorksheetId(worksheetId: string, poolTrx?: PoolClient): Promise<MatrixType[]>{
    const poolInstance = poolTrx??pool;
    try{
      const q = `SELECT * FROM matrix_data WHERE worksheet_id = $1`;
      const result = await poolInstance.query(q, [worksheetId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async getMatrixWithWsJunction(worksheetId: string, poolTrx?: PoolClient): Promise<MatrixWithWsJunctionType[]>{
    const poolInstance = poolTrx??pool;
    try{
      const q = ` SELECT * FROM matrix_data.*, worksheet_junction.*
                  LEFT JOIN worksheet_junction
                  ON matrix_data.wsJunction_id = worksheet_junction.junction_id
                  WHERE matrix_data.worksheet_id = $1`;
      const result = await poolInstance.query(q, [worksheetId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async updateMatrix(body: MatrixBodyType, poolTrx?: PoolClient){
    const poolInstance = poolTrx??pool;
    try{
      const {id, hasilImplementasi, permasalahan, rekomendasi, peraturan, uic, tindakLanjut, isFinding} = body;
      const q = `UPDATE matrix_data SET
                  hasil_implementasi = $1,
                  rekomendasi = $2, 
                  permasalahan = $3, 
                  peraturan = $4, 
                  uic = $5, 
                  tindak_lanjut = $6, 
                  isFinding = $7
                  WHERE id = $8
                  RETURNING *`;
      const result = await poolInstance.query(q, [
        hasilImplementasi,
        permasalahan,
        rekomendasi, 
        peraturan, 
        uic, 
        tindakLanjut, 
        isFinding,
        id,
      ]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }

  async deleteMatrix(id: number, poolTrx?: PoolClient){
    const poolInstance = poolTrx??pool;
    try{
      const q = `DELETE FROM matrix_data WHERE id = $1`;
      const result = await poolInstance.query(q, [id]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }
}


const matrix = new Matrix();

export default matrix