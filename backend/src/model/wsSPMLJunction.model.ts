/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import pool from "../config/db";
import "dotenv/config";
import { PoolClient } from "pg";
import {
  AspekSpmlType,
  ChecklistSpmlType,
  KomponenSpmlType,
  SubKomponenSpmlType,
} from "./spmlRef.model";

/**
 *
 *
 * @class WsSPMLJunction
 */
// -------------------------------------------------
export interface WsSPMLJunctionType{
  junction_id: number,
  worksheet_id: string, 
  checklist_spml_id: number,
  kanwil_score: number | null,
  kppn_score: number | null,
  file_1: string | null,
  kppn_id: string | null,
  last_update: string | null,
  updated_by: string | null,
  excluded: number,
  link_file: string | null,
};

export interface WsSPMLJunctionJoinChecklistSPMLType
  extends WsSPMLJunctionType, ChecklistSpmlType {}

export interface WsSPMLJunctionWithDetailType extends WsSPMLJunctionType {
  checklist: ChecklistSpmlType[];
  komponen: KomponenSpmlType[];
  subkomponen: SubKomponenSpmlType[];
  aspek: AspekSpmlType[];
}

// ------------------------------------------------------

class WsSPMLJunction {
  async getWsSPMLJunctionByWorksheetId(
    worksheetId: string,
    poolTrx?: PoolClient
  ): Promise<WsSPMLJunctionJoinChecklistSPMLType[]> {
    const poolInstance = poolTrx ?? pool;
    try {
      const q = `SELECT worksheet_spml_junction.*, checklist_spml_ref.*
                 FROM worksheet_spml_junction
                 LEFT JOIN checklist_spml_ref
                   ON worksheet_spml_junction.checklist_spml_id = checklist_spml_ref.id
                  AND checklist_spml_ref.deleted IS NULL
                 WHERE worksheet_spml_junction.worksheet_id = $1
                 ORDER BY worksheet_spml_junction.checklist_spml_id ASC`;
      const result = await poolInstance.query(q, [worksheetId]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async getWsSPMLJunctionByJunctionId(
    junctionId: number
  ): Promise<WsSPMLJunctionJoinChecklistSPMLType | undefined> {
    try {
      const q = `SELECT worksheet_spml_junction.*, checklist_spml_ref.*
                 FROM worksheet_spml_junction
                 LEFT JOIN checklist_spml_ref
                   ON worksheet_spml_junction.checklist_spml_id = checklist_spml_ref.id
                  AND checklist_spml_ref.deleted IS NULL
                 WHERE worksheet_spml_junction.junction_id = $1`;
      const result = await pool.query(q, [junctionId]);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  async getWsSPMLJunctionWithKomponenDetail(
    worksheetId: string
  ): Promise<WsSPMLJunctionWithDetailType[]> {
    try {
      const q = `SELECT worksheet_spml_junction.*,
                        json_agg(checklist_spml_ref.* ORDER BY checklist_spml_ref.id ASC) AS checklist,
                        json_agg(komponen_spml_ref.* ORDER BY komponen_spml_ref.id ASC) AS komponen,
                        json_agg(subkomponen_spml_ref.* ORDER BY subkomponen_spml_ref.id ASC) AS subkomponen,
                        json_agg(aspek_spml_ref.* ORDER BY aspek_spml_ref.id ASC) AS aspek
                 FROM worksheet_spml_junction
                 LEFT JOIN checklist_spml_ref
                   ON worksheet_spml_junction.checklist_spml_id = checklist_spml_ref.id
                  AND checklist_spml_ref.deleted IS NULL
                 LEFT JOIN komponen_spml_ref
                   ON komponen_spml_ref.id = checklist_spml_ref.komponen_spml_id
                  AND komponen_spml_ref.deleted IS NULL
                 LEFT JOIN subkomponen_spml_ref
                   ON subkomponen_spml_ref.id = checklist_spml_ref.subkomponen_spml_id
                  AND subkomponen_spml_ref.deleted IS NULL
                 LEFT JOIN aspek_spml_ref
                   ON aspek_spml_ref.id = checklist_spml_ref.aspek_spml_id
                  AND aspek_spml_ref.deleted IS NULL
                 WHERE worksheet_spml_junction.worksheet_id = $1
                 GROUP BY worksheet_spml_junction.junction_id
                 ORDER BY worksheet_spml_junction.checklist_spml_id ASC`;
      const result = await pool.query(q, [worksheetId]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async getWsSPMLJunctionByKPPN(kppnId: string): Promise<WsSPMLJunctionType[]> {
    try {
      const q = `SELECT * FROM worksheet_spml_junction WHERE kppn_id = $1`;
      const result = await pool.query(q, [kppnId]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async addWsSPMLJunction(
    worksheetId: string,
    checklistSpmlId: number,
    kppnId: string,
    isExcluded: number,
    poolTrx?: PoolClient
  ): Promise<WsSPMLJunctionType[]> {
    const poolInstance = poolTrx ?? pool;
    try {
      const q = `INSERT INTO worksheet_spml_junction
                   (worksheet_id, checklist_spml_id, kppn_id, excluded)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`;
      const result = await poolInstance.query(q, [worksheetId, checklistSpmlId, kppnId, isExcluded]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async editWsSPMLJunctionKPPNScore(
    junctionId: number,
    worksheetId: string,
    kppnScore: number,
    excluded: number,
    userName: string
  ): Promise<WsSPMLJunctionType[]> {
    try {
      const q = `UPDATE worksheet_spml_junction
                 SET kppn_score = $1, excluded = $2, last_update = CURRENT_TIMESTAMP, updated_by = $3
                 WHERE junction_id = $4 AND worksheet_id = $5
                 RETURNING *`;
      const result = await pool.query(q, [kppnScore, excluded, userName, junctionId, worksheetId]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async editWsSPMLJunctionKanwilScore(
    junctionId: number,
    worksheetId: string,
    kanwilScore: number,
    excluded: number,
    userName: string
  ): Promise<WsSPMLJunctionType[]> {
    try {
      const q = `UPDATE worksheet_spml_junction
                 SET kanwil_score = $1, excluded = $2, last_update = CURRENT_TIMESTAMP, updated_by = $3
                 WHERE junction_id = $4 AND worksheet_id = $5
                 RETURNING *`;
      const result = await pool.query(q, [kanwilScore, excluded, userName, junctionId, worksheetId]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async editWsSPMLJunctionLinkFile(
    junctionId: number,
    worksheetId: string,
    linkFile: string,
    userName: string
  ): Promise<WsSPMLJunctionType | undefined> {
    try {
      const q = `UPDATE worksheet_spml_junction
                 SET link_file = $1, last_update = CURRENT_TIMESTAMP, updated_by = $2
                 WHERE junction_id = $3 AND worksheet_id = $4
                 RETURNING *`;
      const result = await pool.query(q, [linkFile, userName, junctionId, worksheetId]);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  async editWsSPMLJunctionFile(
    junctionId: number,
    worksheetId: string,
    fileName: string,
    userName: string
  ): Promise<WsSPMLJunctionType[]> {
    try {
      const q = `UPDATE worksheet_spml_junction
                 SET file_1 = $1, last_update = CURRENT_TIMESTAMP, updated_by = $2
                 WHERE junction_id = $3 AND worksheet_id = $4
                 RETURNING *`;
      const result = await pool.query(q, [fileName, userName, junctionId, worksheetId]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async editWsSPMLJunctionExclude(
    junctionId: number,
    exclude: number
  ): Promise<WsSPMLJunctionType | undefined> {
    try {
      const q = `UPDATE worksheet_spml_junction
                 SET excluded = $1
                 WHERE junction_id = $2
                 RETURNING *`;
      const result = await pool.query(q, [exclude, junctionId]);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  async deleteWsSPMLJunctionFile(
    junctionId: number,
    userName: string
  ): Promise<WsSPMLJunctionType[]> {
    try {
      const q = `UPDATE worksheet_spml_junction
                 SET file_1 = NULL, last_update = CURRENT_TIMESTAMP, updated_by = $1
                 WHERE junction_id = $2
                 RETURNING *`;
      const result = await pool.query(q, [userName, junctionId]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async deleteWsSPMLJunctionByWorksheetId(
    worksheetId: string,
    poolTrx?: PoolClient
  ): Promise<WsSPMLJunctionType[]> {
    const poolInstance = poolTrx ?? pool;
    try {
      const q = `DELETE FROM worksheet_spml_junction WHERE worksheet_id = $1 RETURNING *`;
      const result = await poolInstance.query(q, [worksheetId]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

}

const wsSPMLJunction = new WsSPMLJunction();

export default wsSPMLJunction;
