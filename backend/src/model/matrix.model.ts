/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import pool from "../config/db";
import "dotenv/config";
import { PoolClient } from "pg";
import { OpsiType, WorksheetJunctionType } from "./worksheetJunction.model";
import { ChecklistType } from "./checklist.model";
import { FindingsType } from "./findings.model";
/**
 *
 *
 * @class Matrix
 */
// -------------------------------------------------
export interface MatrixType{
  id: number,
  ws_junction_id: number,
  worksheet_id: string,
  checklist_id: number,
  hasil_implementasi: string,
  permasalahan: string, 
  rekomendasi: string,
  peraturan: string,
  uic: string,
  tindak_lanjut: string, 
  is_finding: number
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
};

export interface MatrixWithWsJunctionType{
  id: number,
  worksheet_id: string,
  ws_junction_id: number,
  checklist_id: number,
  hasil_implementasi: string | null,
  permasalahan: string | null,
  rekomendasi: string | null,
  peraturan: string | null,
  uic: string | null,
  tindak_lanjut: string | null,
  is_finding: number,
  komponen_string: string | null,
  subkomponen_string: string | null,
  standardisasi: number, 
  standardisasi_id: number | null,
  ws_junction: WorksheetJunctionType[],
  checklist: ChecklistType[],
  findings: FindingsType[],
  opsi: OpsiType[]
};

// --------------------------------------------------
class Matrix{

  async addMatrix(body: MatrixBodyType, poolTrx?: PoolClient){
    const poolInstance = poolTrx??pool;
    try{
      const {worksheetId, wsJunctionId, checklistId, hasilImplementasi, permasalahan, rekomendasi, peraturan, uic, tindakLanjut, isFinding} = body;
      const q = ` INSERT INTO matrix_data (
                    worksheet_id, 
                    ws_junction_id, 
                    checklist_id,
                    hasil_implementasi,
                    permasalahan, 
                    rekomendasi, 
                    peraturan,
                    uic, 
                    tindak_lanjut, 
                    is_finding
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
      const q = ` SELECT 
                    matrix_data.*, 
                    json_agg(worksheet_junction.* ORDER BY worksheet_junction.junction_id ASC) AS ws_junction, 
                    json_agg(checklist_ref.* ORDER BY checklist_ref.id ASC) AS checklist,
                    json_agg(findings_data.* ORDER BY findings_data.id ASC) AS findings,
                    (
                      SELECT json_agg(opsi_ref.* ORDER BY opsi_ref.id ASC)
                      FROM opsi_ref
                      WHERE opsi_ref.checklist_id = matrix_data.checklist_id
                    ) AS opsi,
                    komponen_ref.title AS komponen_string,
                    subkomponen_ref.title AS subkomponen_string,
                    checklist_ref.standardisasi AS standardisasi,
                    checklist_ref.standardisasi_id AS standardisasi_id
                  FROM matrix_data 
                  LEFT JOIN worksheet_junction
                  ON matrix_data.ws_junction_id = worksheet_junction.junction_id
                  LEFT JOIN checklist_ref
                  ON matrix_data.checklist_id = checklist_ref.id
                  LEFT JOIN komponen_ref
                  ON komponen_ref.id = checklist_ref.komponen_id
                  LEFT JOIN subkomponen_ref
                  ON subkomponen_ref.id = checklist_ref.subkomponen_id
                  LEFT JOIN findings_data
                  ON findings_data.matrix_id = matrix_data.id
                  WHERE matrix_data.worksheet_id = $1
                  GROUP BY matrix_data.id, worksheet_junction.junction_id, komponen_ref.title, subkomponen_ref.title, checklist_ref.standardisasi, checklist_ref.standardisasi_id
                  `;
      const result = await poolInstance.query(q, [worksheetId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async getSingleMatrixByWsJunctionId(wsJunctionId: number, poolTrx?: PoolClient): Promise<MatrixType>{
    const poolInstance = poolTrx??pool;
    try{
      const q = `SELECT * FROM matrix_data WHERE ws_junction_id = $1`;
      const result = await poolInstance.query(q, [wsJunctionId]);
      return result.rows[0]
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
                  permasalahan= $2, 
                  rekomendasi = $3, 
                  peraturan = $4, 
                  uic = $5, 
                  tindak_lanjut = $6, 
                  is_finding = $7
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

  async updateMatrixTindakLanjut(id: number, kanwilResponse: string, poolTrx?: PoolClient){
    const poolInstance = poolTrx??pool;
    try{
      const q = `UPDATE matrix_data SET
                  tindak_lanjut = $1 
                  WHERE id = $2
                  RETURNING *`;
      const result = await poolInstance.query(q, [kanwilResponse, id]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }

  async updateMatrixFindings(wsJunctionId: number, hasilImplementasi: string, permasalahan: string, isFinding: number, poolTrx?: PoolClient){
    const poolInstance = poolTrx??pool;
    try{
      const q = ` UPDATE matrix_data 
                  SET hasil_implementasi = $1, permasalahan = $2, is_finding = $3 
                  WHERE ws_junction_id = $4 
                  RETURNING *`;
      const result = await poolInstance.query(q, [hasilImplementasi, permasalahan, isFinding, wsJunctionId]);
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

  async deleteMatrixByWorksheetId(worksheetId: string, poolTrx?: PoolClient){
    const poolInstance = poolTrx??pool;
    try{
      const q = `DELETE FROM matrix_data WHERE worksheet_id = $1`;
      const result = await poolInstance.query(q, [worksheetId]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }
}


const matrix = new Matrix();

export default matrix