import pool from "../config/db";
import "dotenv/config";
import { PoolClient } from "pg";
/**
 *
 *
 * @class Findings
 */
// -------------------------------------------------
export interface FindingsType{
  id: number,
  ws_junction_id: number,
  worksheet_id: string,
  checklist_id: number,
  matrix_id: number, 
  kppn_reponse: string,
  kanwil_response: string,
  score_before: number,
  score_after: number,
  last_update: string,
  status: number,
  updated_by: string
};

interface FindingsBodyType{
  worksheetId: string,
  wsJunctionId: number,
  checklistId: number,
  matrixId: number,
  scoreBefore: number | null,
};

interface FindingsWithChecklist{
  id: number,
  ws_junction_id: number,
  worksheet_id: string,
  checklist_id: number,
  matrix_id: number, 
  kppn_reponse: string,
  kanwil_response: string,
  score_before: number,
  score_after: number,
  last_update: string,
  status: number,
  updated_by: string,
  title: string | null, 
  komponen_id: number,
  subkomponen_id: number,
  komponen_title: string,
  subkomponen_title: string,
  period: number
}
// --------------------------------------------------
class Findings{
  async createFindings({worksheetId, wsJunctionId, checklistId, matrixId, scoreBefore}: FindingsBodyType, poolTrx?: PoolClient){
    try{
      const poolInstance = poolTrx || pool;
      const q = `INSERT INTO findings_data (worksheet_id, ws_junction_id, checklist_id, matrix_id, score_before) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      const result = await poolInstance.query(q, [worksheetId, wsJunctionId, checklistId, matrixId, scoreBefore]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }

  async getFindingsByWorksheetId(worksheetId: string): Promise<FindingsType[]>{
    try{
      const q = `SELECT * FROM findings_data WHERE worksheet_id = $1`;
      const result = await pool.query(q, [worksheetId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async getFindingsById(id: number): Promise<FindingsType[]>{
    try{
      const q = `SELECT * FROM findings_data WHERE id = $1`;
      const result = await pool.query(q, [id]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async getAllFindingsWithChecklistDetail(): Promise<FindingsWithChecklist[]>{
    try{
      const q = ` SELECT 
                    findings_data.*, 
                    checklist_ref.title, 
                    checklist_ref.komponen_id, 
                    checklist_ref.subkomponen_id, 
                    komponen_ref.title AS komponen_title, 
                    subkomponen_ref.title AS subkomponen_title, 
                    worksheet_ref.period
                  FROM findings_data
                  LEFT JOIN worksheet_ref
                  ON findings_data.worksheet_id = worksheet_ref.id
                  LEFT JOIN checklist_ref 
                  ON findings_data.checklist_id = checklist_ref.id
                  LEFT JOIN komponen_ref
                  ON checklist_ref.komponen_id = komponen_ref.id
                  LEFT JOIN subkomponen_ref
                  ON checklist_ref.subkomponen_id = subkomponen_ref.id
                  ORDER BY findings_data.id DESC`;
      const result = await pool.query(q);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async getAllFindingsWithChecklistDetailByKPPN(kppnId: string): Promise<FindingsWithChecklist[]>{
    try{
      const q = ` SELECT 
                    findings_data.*, 
                    checklist_ref.title, 
                    checklist_ref.komponen_id, 
                    checklist_ref.subkomponen_id, 
                    komponen_ref.title AS komponen_title, 
                    subkomponen_ref.title AS subkomponen_title, 
                    worksheet_ref.period
                  FROM findings_data
                  LEFT JOIN worksheet_ref
                  ON findings_data.worksheet_id = worksheet_ref.id
                  LEFT JOIN checklist_ref 
                  ON findings_data.checklist_id = checklist_ref.id
                  LEFT JOIN komponen_ref
                  ON checklist_ref.komponen_id = komponen_ref.id
                  LEFT JOIN subkomponen_ref
                  ON checklist_ref.subkomponen_id = subkomponen_ref.id
                  WHERE worksheet_ref.kppn_id = $1
                  ORDER BY findings_data.id DESC`;
      const result = await pool.query(q, [kppnId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async updateFindingsResponse(id: number, kppnResponse: string, kanwilResponse: string, userName: string){
    try{
      const updateTime = new Date(Date.now()).toISOString();
      console.log(id, kppnResponse, kanwilResponse, userName);
      const q = `UPDATE findings_data 
                 SET kppn_response = $1, kanwil_response = $2, updated_by = $3, last_update = $4
                 WHERE id = $5
                 RETURNING *`;
      const result = await pool.query(q, [kppnResponse, kanwilResponse, userName, updateTime, id]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }

  async updateFindingsScore(id: number, scoreBefore: string, scoreAfter: string, userName: string){
    try{
      const updateTime = new Date(Date.now()).toISOString();
      const q = `UPDATE findings_data 
                 SET score_before = $1, score_after = $2, updated_by = $3, last_update = $4
                 WHERE id = $5
                 RETURNING *`;
      const result = await pool.query(q, [scoreBefore, scoreAfter, userName, updateTime, id]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }

  async updateFindingStatus(id: number, status: number, userName: string){
    try{
      const updateTime = new Date(Date.now()).toISOString();
      const q = `UPDATE findings_data 
                 SET status = $1, updated_by = $2, last_update = $3
                 WHERE id = $4
                 RETURNING *`;
      const result = await pool.query(q, [status, userName, updateTime, id]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }

  async deleteFindings(id: number, poolTrx?: PoolClient){
    const poolInstance = poolTrx || pool;
    try{
      const q = `DELETE FROM findings_data WHERE id = $1`;
      const result = await pool.query(q, [id]);
      return result
    }catch(err){
      throw err
    }
  }

  async deleteFindingsByMatrixId(matrixId: number, poolTrx?: PoolClient){
    const poolInstance = poolTrx || pool;
    try{
      const q = `DELETE FROM findings_data WHERE matrix_id = $1`;
      const result = await pool.query(q, [matrixId]);
      return result
    }catch(err){
      throw err
    }
  }

  async deleteFindingsByWsJunctionId(wsJunctionId: number, poolTrx: PoolClient){
    const poolInstance = poolTrx || pool;
    try{
      const q = `DELETE FROM findings_data WHERE ws_junction_id = $1`;
      const result = await pool.query(q, [wsJunctionId]);
      return result
    }catch(err){
      throw err
    }
  }

  async deleteFindingsByWorksheetId(worksheetId: string, poolTrx?: PoolClient){
    const poolInstance = poolTrx || pool;
    try{
      const q = `DELETE FROM findings_data WHERE worksheet_id = $1`;
      const result = await poolInstance.query(q, [worksheetId]);
      return result
    }catch(err){
      throw err
    }
  }

}

const findings = new Findings();

export default findings
