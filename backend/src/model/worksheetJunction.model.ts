import pool from "../config/db";
import "dotenv/config";
import { PoolClient } from "pg";
/**
 *
 *
 * @class WorksheetJunction
 */
// -------------------------------------------------
interface WorksheetJunctionType{
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
  last_update: string | null
};

interface OpsiType{
  id: number,
  title: string, 
  value: number,
  checklist_id: number
};

interface WsJunctionJoinChecklistType{
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
  last_update: string | null
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
  opsi: OpsiType[] | [] | null
};


// ------------------------------------------------------

class WorksheetJunction{
  async getWsJunctionByWorksheetId(worksheetId: number): Promise<WsJunctionJoinChecklistType[]>{
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

  async addWsJunction(worksheetId: string, checklistId: number, kppnId: string, period: number, poolTrx?: PoolClient){
    const poolInstance = poolTrx ?? pool;

    try{
      const q = "INSERT INTO worksheet_junction (worksheet_id, checklist_id, kppn_id, period) VALUES ($1, $2, $3, $4) RETURNING *";
      const result = await poolInstance.query(q, [worksheetId, checklistId, kppnId, period]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async editWsJunctionKPPNScore(junctionID: number, worksheetId: string, kppnScore: number){
    try{
      const q = "UPDATE worksheet_junction SET kppn_score = $1 WHERE junction_id = $2 AND worksheet_id = $3 RETURNING *";
      const result = await pool.query(q, [kppnScore, junctionID, worksheetId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async editWsJunctionKanwilScore(junctionID: number, worksheetId: string, kanwilScore: number){
    try{
      const q = "UPDATE worksheet_junction SET kanwil_score = $1 WHERE junction_id = $2 AND worksheet_id = $3 RETURNING *";
      const result = await pool.query(q, [kanwilScore, junctionID, worksheetId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async editWsJunctionKanwilNote(junctionID: number, worksheetId: string, kanwilNote: string){
    try{
      const q = "UPDATE worksheet_junction SET kanwil_note = $1 WHERE junction_id = $2 AND worksheet_id = $3 RETURNING *";
      const result = await pool.query(q, [kanwilNote, junctionID, worksheetId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async editWsJunctionFile(junctionID: number, worksheetId: string, file1: string, file2: string, file3: string){
    try{
      const q = "UPDATE worksheet_junction SET file_1 = $1, file_2 = $2, file_3 = $3 WHERE junction_id = $4 AND worksheet_id = $5 RETURNING *";
      const result = await pool.query(q, [file1, file2, file3, junctionID, worksheetId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async deleteWsJunctionByWorksheetId(worksheetId: number){
    try{
      const q = "DELETE FROM worksheet_junction WHERE worksheet_id = $1";
      const result = await pool.query(q, [worksheetId]);
      return result.rows
    }catch(err){
      throw err
    }
  }
}

const wsJunction= new WorksheetJunction();

export default wsJunction;