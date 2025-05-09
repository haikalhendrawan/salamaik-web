/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import pool from "../config/db";
import "dotenv/config";
import { PoolClient } from "pg";
import { ChecklistType } from "./checklist.model";
import { KomponenType, SubKomponenType } from "./komponen.model";
/**
 *
 *
 * @class WorksheetJunction
 */
// -------------------------------------------------
export interface WorksheetJunctionType{
  junction_id: number,
  worksheet_id: string,
  checklist_id: number,
  kanwil_score: number | null,
  kppn_score: number | null,
  file_1: string | null,
  file_2: string | null,
  file_3: string | null,
  kanwil_note: string | null,
  kppn_id: string,
  period: string,
  last_update: string | null,
  updated_by: string | null,
  excluded: number
};

export interface OpsiType{
  id: number,
  title: string, 
  value: number,
  checklist_id: number,
  positive_fallback: string,
  negative_fallback: string,
  rekomendasi: string
};

export interface WsJunctionJoinChecklistType{
  junction_id: number,
  worksheet_id: string,
  checklist_id: number,
  kanwil_score: number | null,
  kppn_score: number | null,
  file_1: string | null,
  file_2: string | null,
  file_3: string | null,
  kanwil_note: string | null,
  kppn_id: string,
  period: string,
  last_update: string | null,
  updated_by: string | null,
  excluded: number,
  id: number,
  title: string | null, 
  header: string | null,
  komponen_id: number,
  subkomponen_id: number,
  subsubkomponen_id: number,
  standardisasi: number, 
  matrix_title: string | null, 
  file1: string | null,
  file2: string | null,
  instruksi: string | null,
  contoh_file: string | null,
  peraturan: string | null,
  uic: string | null,
  standardisasi_id: number | null,
  opsi: OpsiType[] | [] | null
};

export interface WsJunctionWithKomponenType{
  junction_id: number,
  worksheet_id: string,
  checklist_id: number,
  kanwil_score: number | null,
  kppn_score: number | null,
  file_1: string | null,
  file_2: string | null,
  file_3: string | null,
  kanwil_note: string | null,
  kppn_id: string,
  period: string,
  last_update: string | null,
  updated_by: string | null,
  excluded: number,
  checklist: ChecklistType[],
  komponen: KomponenType[],
  subkomponen: SubKomponenType[],
}


// ------------------------------------------------------

class WorksheetJunction{
  async getWsJunctionByWorksheetId(worksheetId: string, poolTrx?: PoolClient): Promise<WsJunctionJoinChecklistType[]>{
    const poolInstance = poolTrx ?? pool;
    try{
      const q = ` SELECT worksheet_junction.*, checklist_ref.*, json_agg(opsi_ref.* ORDER BY opsi_ref.checklist_id ASC, value DESC) AS opsi
                  FROM worksheet_junction
                  LEFT JOIN checklist_ref 
                  ON worksheet_junction.checklist_id = checklist_ref.id
                  LEFT JOIN opsi_ref
                  ON worksheet_junction.checklist_id = opsi_ref.checklist_id
                  WHERE worksheet_id = $1
                  GROUP BY worksheet_junction.junction_id, checklist_ref.id
                  ORDER BY worksheet_junction.checklist_id
                  `;
      const result = await poolInstance.query(q, [worksheetId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async getWsJunctionByJunctionId(junctionId: number): Promise<WsJunctionJoinChecklistType>{
    try{
      const q = ` SELECT worksheet_junction.*, checklist_ref.*, json_agg(opsi_ref.* ORDER BY opsi_ref.checklist_id ASC, value DESC) AS opsi 
                  FROM worksheet_junction 
                  LEFT JOIN checklist_ref
                  ON worksheet_junction.checklist_id = checklist_ref.id
                  LEFT JOIN opsi_ref
                  ON worksheet_junction.checklist_id = opsi_ref.checklist_id
                  WHERE junction_id = $1
                  GROUP BY worksheet_junction.junction_id, checklist_ref.id
                  `;
      const result = await pool.query(q, [junctionId]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }

  async getWsJunctionWithKomponenDetail(worksheetId: string): Promise<WsJunctionWithKomponenType[]>{
    try{
      const q = ` SELECT  worksheet_junction.*, 
                          json_agg(komponen_ref.* ORDER BY komponen_ref.id ASC) AS komponen, 
                          json_agg(subkomponen_ref.* ORDER BY subkomponen_ref.id ASC) AS subkomponen,
                          json_agg(checklist_ref.* ORDER BY checklist_ref.id ASC) AS checklist
                  FROM worksheet_junction
                  LEFT JOIN checklist_ref
                  ON worksheet_junction.checklist_id = checklist_ref.id
                  LEFT JOIN komponen_ref
                  ON komponen_ref.id = checklist_ref.komponen_id
                  LEFT JOIN subkomponen_ref
                  ON subkomponen_ref.id = checklist_ref.subkomponen_id
                  WHERE worksheet_junction.worksheet_id = $1
                  GROUP BY worksheet_junction.junction_id
                  `;
      const result = await pool.query(q, [worksheetId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async getWsJunctionByPeriod(period: number){
    try{
      const q = "SELECT * FROM worksheet_junction WHERE period = $1";
      const result = await pool.query(q, [period]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async getWsJunctionByKPPN(kppnId: string){
    try{
      const q = "SELECT * FROM worksheet_junction WHERE kppn_id = $1";
      const result = await pool.query(q, [kppnId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async addWsJunction(worksheetId: string, checklistId: number, kppnId: string, period: number, isExcluded: number, poolTrx?: PoolClient){
    const poolInstance = poolTrx ?? pool;

    try{
      const q = "INSERT INTO worksheet_junction (worksheet_id, checklist_id, kppn_id, period, excluded) VALUES ($1, $2, $3, $4, $5) RETURNING *";
      const result = await poolInstance.query(q, [worksheetId, checklistId, kppnId, period, isExcluded]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async editWsJunctionKPPNScore(junctionID: number, worksheetId: string, kppnScore: number, userName: string){
    try{
      const updateTime = new Date(Date.now()).toISOString();
      const q = "UPDATE worksheet_junction SET kppn_score = $1, last_update = $2, updated_by = $3 WHERE junction_id = $4 AND worksheet_id = $5 RETURNING *";
      const result = await pool.query(q, [kppnScore, updateTime, userName, junctionID, worksheetId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async editWsJunctionKanwilScore(junctionID: number, worksheetId: string, kanwilScore: number, userName: string){
    try{
      const updateTime = new Date(Date.now()).toISOString();
      const q = "UPDATE worksheet_junction SET kanwil_score = $1, last_update = $2, updated_by = $3 WHERE junction_id = $4 AND worksheet_id = $5 RETURNING *";
      const result = await pool.query(q, [kanwilScore, updateTime, userName, junctionID, worksheetId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async editWsJunctionKanwilNote(junctionID: number, worksheetId: string, kanwilNote: string, userName: string){
    try{
      const updateTime = new Date(Date.now()).toISOString();
      const q = "UPDATE worksheet_junction SET kanwil_note = $1, last_update = $2, updated_by = $3 WHERE junction_id = $4 AND worksheet_id = $5 RETURNING *";
      const result = await pool.query(q, [kanwilNote, updateTime, userName, junctionID, worksheetId]);
      return result?.rows[0]
    }catch(err){
      throw err
    }
  }

  async editWsJunctionFile(junctionId: number, worksheetId: string, fileName: string, option: number, userName: string){
    try{
      const updateTime = new Date(Date.now()).toISOString();
      const queryOption = [
        "UPDATE worksheet_junction SET file_1 = $1, last_update = $2, updated_by = $3 WHERE junction_id = $4 AND worksheet_id = $5 RETURNING *",
        "UPDATE worksheet_junction SET file_2 = $1, last_update = $2, updated_by = $3 WHERE junction_id = $4 AND worksheet_id = $5 RETURNING *",
        "UPDATE worksheet_junction SET file_3 = $1, last_update = $2, updated_by = $3 WHERE junction_id = $4 AND worksheet_id = $5 RETURNING *",
      ];
      const q = queryOption[option-1];
      const result = await pool.query(q, [fileName, updateTime, userName, junctionId, worksheetId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async editWsJunctionExclude(junctionId: number, exclude: number){
    try{
      const q = "UPDATE worksheet_junction SET excluded = $1, kanwil_note = $2 WHERE junction_id = $3 RETURNING *";
      const kanwilNote = exclude===1?'Dikecualikan':null;
      const result = await pool.query(q, [exclude, kanwilNote, junctionId]);
      return result.rows[0]
    }catch(err){
      throw err
    }
  }

  async deleteWsJunctionFile(junctionId: number, option: number, name: string){
    try{
      const updateTime = new Date(Date.now()).toISOString();
      const queryOption = [
        "UPDATE worksheet_junction SET file_1 = null, last_update = $1, updated_by = $2 WHERE junction_id = $3 RETURNING *",
        "UPDATE worksheet_junction SET file_2 = null, last_update = $1, updated_by = $2 WHERE junction_id = $3 RETURNING *",
        "UPDATE worksheet_junction SET file_3 = null, last_update = $1, updated_by = $2 WHERE junction_id = $3 RETURNING *"
      ];
      const q = queryOption[option-1];
      const result = await pool.query(q, [updateTime, name,  junctionId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async deleteWsJunctionByWorksheetId(worksheetId: number){
    try{
      const q = "DELETE FROM worksheet_junction WHERE worksheet_id = $1 RETURNING *";
      const result = await pool.query(q, [worksheetId]);
      return result.rows
    }catch(err){
      throw err
    }
  }
}

const wsJunction= new WorksheetJunction();

export default wsJunction;