/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import pool from "../config/db";
import { PoolClient } from "pg";

export interface ChecklistType{
  id: number,
  title: string | null, 
  header: string | null,
  komponen_id: number,
  subkomponen_id: number,
  subsubkomponen_id: number,
  standardisasi: 0 | 1, 
  matrix_title: string | null, 
  file1: string | null,
  file2: string | null,
  instruksi: string | null,
  contoh_file: string | null,
  peraturan: string | null,
  uic: string | null,
  checklist_id: number | null,
  standardisasi_id: number | null,
};
//-----------------------------------------------------------------------------
class Checklist{
  async getAllChecklist(poolTrx?: PoolClient){
    const poolInstance = poolTrx??pool;

    try{
      const q = "SELECT * FROM checklist_ref ORDER BY id ASC";
      const result = await poolInstance.query(q);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async editChecklist(body: ChecklistType){
    try{
      const {
        id,
        title, 
        header,
        komponen_id,
        subkomponen_id,
        subsubkomponen_id,
        standardisasi, 
        matrix_title, 
        file1,
        file2,
        instruksi,
        contoh_file,
        peraturan,
        uic
      } = body;

      const q = ` UPDATE checklist_ref
                  SET
                    title = $1, 
                    header = $2, 
                    komponen_id = $3, 
                    subkomponen_id = $4, 
                    subsubkomponen_id = $5, 
                    standardisasi = $6, 
                    matrix_title = $7, 
                    file1 = $8, 
                    file2 = $9, 
                    instruksi = $10, 
                    contoh_file = $11,
                    peraturan = $12,
                    uic = $13
                  WHERE id = $14 
                  RETURNING *`;
      const result = await pool.query(q, [title, header, komponen_id, subkomponen_id, subsubkomponen_id, standardisasi, matrix_title, file1, file2, instruksi, contoh_file, peraturan, uic, id]);
      return result.rows
    }catch(err){
      throw err
    }

  }

  async editChecklistFile(id: number, filename: string, option: number){
    try{
      const q = option===1
                ?"UPDATE checklist_ref SET file1 = $1 WHERE id = $2 RETURNING *"
                :"UPDATE checklist_ref SET file2 = $1 WHERE id = $2 RETURNING *";
      const result = await pool.query(q, [filename, id]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async deleteChecklistFile(id: number, option: number){
    try{
      const q = option===1
                ?"UPDATE checklist_ref SET file1 = NULL WHERE id = $1 RETURNING *"
                :"UPDATE checklist_ref SET file2 = NULL WHERE id = $1 RETURNING *";
      const result = await pool.query(q, [id]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async getAllOpsi(){
    try{
      const q = "SELECT * FROM opsi_ref ORDER BY id ASC";
      const result = await pool.query(q);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async getOpsiByChecklistId(checklistId: number){
    try{
      const q = "SELECT * FROM opsi_ref WHERE checklist_id = $1 ORDER BY id ASC";
      const result = await pool.query(q, [checklistId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async editOpsiById(id: number, title: string, value: number, checklistId: number, positiveFallback: string, negativeFallback: string, rekomendasi: string){
    try{
      const q = "UPDATE opsi_ref SET title = $1, value = $2, checklist_id = $3, positive_fallback = $4, negative_fallback = $5, rekomendasi = $6 WHERE id = $7 RETURNING *";
      const result = await pool.query(q, [title, value, checklistId, positiveFallback, negativeFallback, rekomendasi, id]);
      return result.rows
    }catch(err){
      throw err
    }
  }

}

const checklist = new Checklist();

export default checklist