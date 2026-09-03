/**
 * Salamaik API
 * Worksheet CK junction model
 */

import { PoolClient } from 'pg';
import pool from '../config/db';
import { CkScoreValue, OpsiCkType } from './ckRef.model';

export interface WsCKJunctionType {
  junction_id: number;
  worksheet_id: string;
  checklist_ck_id: number;
  kppn_score: CkScoreValue | null;
  kanwil_score: CkScoreValue | null;
  excluded: number;
  file_1: string | null;
  link_file: string | null;
  kppn_note: string | null;
  kanwil_note: string | null;
  last_update: Date | string | null;
  updated_by: string | null;
  created_at: Date | string;
}

export interface WsCKJunctionWithDetailType extends WsCKJunctionType {
  kppn_id: string;
  period: number;
  open_period: Date | string;
  close_period: Date | string;
  checklist_urut: number | null;
  materi: string | null;
  kriteria_penilaian: string | null;
  bukti_dukung: string | null;
  komponen_ck_id: number | null;
  komponen_urut: string | null;
  komponen_title: string | null;
  komponen_alias: string | null;
  komponen_detail: string | null;
  opsi: OpsiCkType[];
  comment_count: number;
}

export interface WsCKProgressType {
  worksheetCKId: string;
  kppnId: string;
  name: string;
  alias: string;
  jumlahChecklist: number;
  jumlahChecklistDiisiKPPN: number;
  jumlahChecklistDiisiKanwil: number;
}

const getPoolInstance = (poolTrx?: PoolClient) => poolTrx ?? pool;

const DETAIL_SELECT = `
  SELECT junction.*,
         worksheet.kppn_id,
         worksheet.period,
         worksheet.open_period,
         worksheet.close_period,
         checklist.urut AS checklist_urut,
         checklist.materi,
         checklist.kriteria_penilaian,
         checklist.bukti_dukung,
         checklist.komponen_ck_id,
         komponen.urut AS komponen_urut,
         komponen.title AS komponen_title,
         komponen.alias AS komponen_alias,
         komponen.detail AS komponen_detail,
         COALESCE(
           (SELECT json_agg(opsi.* ORDER BY opsi.urut ASC, opsi.id ASC)
              FROM opsi_ck_ref AS opsi
             WHERE opsi.checklist_ck_id = junction.checklist_ck_id
               AND opsi.deleted IS NULL),
           '[]'::json
         ) AS opsi,
         (SELECT COUNT(*)::int
            FROM comment_data AS komentar
           WHERE komentar.ws_ck_junction_id = junction.junction_id
             AND komentar.active = 1) AS comment_count
    FROM worksheet_ck_junction AS junction
    INNER JOIN worksheet_ref AS worksheet
      ON worksheet.id = junction.worksheet_id
    LEFT JOIN checklist_ck_ref AS checklist
      ON checklist.id = junction.checklist_ck_id
     AND checklist.deleted IS NULL
    LEFT JOIN komponen_ck_ref AS komponen
      ON komponen.id = checklist.komponen_ck_id
     AND komponen.deleted IS NULL`;

class WsCKJunction {
  async getByWorksheetId(
    worksheetId: string,
    poolTrx?: PoolClient
  ): Promise<WsCKJunctionWithDetailType[]> {
    const result = await getPoolInstance(poolTrx).query<WsCKJunctionWithDetailType>(
      `${DETAIL_SELECT}
        WHERE junction.worksheet_id = $1
        ORDER BY komponen.id ASC, checklist.urut ASC, checklist.id ASC`,
      [worksheetId]
    );
    return result.rows;
  }

  async getByJunctionId(
    junctionId: number,
    poolTrx?: PoolClient
  ): Promise<WsCKJunctionWithDetailType | undefined> {
    const result = await getPoolInstance(poolTrx).query<WsCKJunctionWithDetailType>(
      `${DETAIL_SELECT}
        WHERE junction.junction_id = $1`,
      [junctionId]
    );
    return result.rows[0];
  }

  async getProgressAllByPeriod(period: number): Promise<WsCKProgressType[]> {
    const result = await pool.query<WsCKProgressType>(
      `SELECT worksheet.id AS "worksheetCKId",
              unit.id AS "kppnId",
              unit.name,
              unit.alias,
              COUNT(junction.junction_id)::int AS "jumlahChecklist",
              COUNT(junction.junction_id) FILTER (
                WHERE junction.kppn_score IS NOT NULL OR junction.excluded = 1
              )::int AS "jumlahChecklistDiisiKPPN",
              COUNT(junction.junction_id) FILTER (
                WHERE junction.kanwil_score IS NOT NULL OR junction.excluded = 1
              )::int AS "jumlahChecklistDiisiKanwil"
         FROM worksheet_ref AS worksheet
         INNER JOIN kppn_ref AS unit
           ON unit.id = worksheet.kppn_id
          AND unit.level = 0
         LEFT JOIN worksheet_ck_junction AS junction
           ON junction.worksheet_id = worksheet.id
        WHERE worksheet.period = $1
        GROUP BY worksheet.id, unit.id, unit.name, unit.alias, unit.col_order
        ORDER BY unit.col_order ASC`,
      [period]
    );
    return result.rows;
  }

  async assignWorksheet(
    worksheetId: string,
    peraturan: number,
    poolTrx: PoolClient
  ): Promise<WsCKJunctionType[]> {
    const result = await poolTrx.query<WsCKJunctionType>(
      `INSERT INTO worksheet_ck_junction (worksheet_id, checklist_ck_id)
       SELECT $1, checklist.id
         FROM checklist_ck_ref AS checklist
         INNER JOIN komponen_ck_ref AS komponen
           ON komponen.id = checklist.komponen_ck_id
          AND komponen.deleted IS NULL
        WHERE komponen.peraturan = $2
          AND checklist.deleted IS NULL
        ORDER BY komponen.id ASC, checklist.urut ASC, checklist.id ASC
       ON CONFLICT (worksheet_id, checklist_ck_id) DO NOTHING
       RETURNING *`,
      [worksheetId, peraturan]
    );
    return result.rows;
  }

  async updateKPPNScore(
    junctionId: number,
    worksheetId: string,
    score: CkScoreValue,
    excluded: 0 | 1,
    updatedBy: string,
    poolTrx?: PoolClient
  ): Promise<WsCKJunctionType | undefined> {
    const result = await getPoolInstance(poolTrx).query<WsCKJunctionType>(
      `UPDATE worksheet_ck_junction
          SET kppn_score = CASE WHEN $2 = 1 THEN 10 ELSE $1 END,
              kanwil_score = CASE WHEN $2 = 1 THEN 10 ELSE kanwil_score END,
              excluded = $2,
              last_update = CURRENT_TIMESTAMP,
              updated_by = $3
        WHERE junction_id = $4
          AND worksheet_id = $5
        RETURNING *`,
      [score, excluded, updatedBy, junctionId, worksheetId]
    );
    return result.rows[0];
  }

  async updateKanwilScore(
    junctionId: number,
    worksheetId: string,
    score: CkScoreValue,
    excluded: 0 | 1,
    updatedBy: string,
    poolTrx?: PoolClient
  ): Promise<WsCKJunctionType | undefined> {
    const result = await getPoolInstance(poolTrx).query<WsCKJunctionType>(
      `UPDATE worksheet_ck_junction
          SET kanwil_score = CASE WHEN $2 = 1 THEN 10 ELSE $1 END,
              kppn_score = CASE WHEN $2 = 1 THEN 10 ELSE kppn_score END,
              excluded = $2,
              last_update = CURRENT_TIMESTAMP,
              updated_by = $3
        WHERE junction_id = $4
          AND worksheet_id = $5
        RETURNING *`,
      [score, excluded, updatedBy, junctionId, worksheetId]
    );
    return result.rows[0];
  }

  async updateNote(
    junctionId: number,
    worksheetId: string,
    noteType: 'kppn_note' | 'kanwil_note',
    note: string | null,
    updatedBy: string,
    poolTrx?: PoolClient
  ): Promise<WsCKJunctionType | undefined> {
    const result = await getPoolInstance(poolTrx).query<WsCKJunctionType>(
      `UPDATE worksheet_ck_junction
          SET ${noteType} = $1,
              last_update = CURRENT_TIMESTAMP,
              updated_by = $2
        WHERE junction_id = $3
          AND worksheet_id = $4
        RETURNING *`,
      [note, updatedBy, junctionId, worksheetId]
    );
    return result.rows[0];
  }

  async updateLinkFile(
    junctionId: number,
    worksheetId: string,
    linkFile: string | null,
    updatedBy: string,
    poolTrx?: PoolClient
  ): Promise<WsCKJunctionType | undefined> {
    const result = await getPoolInstance(poolTrx).query<WsCKJunctionType>(
      `UPDATE worksheet_ck_junction
          SET link_file = $1,
              last_update = CURRENT_TIMESTAMP,
              updated_by = $2
        WHERE junction_id = $3
          AND worksheet_id = $4
        RETURNING *`,
      [linkFile, updatedBy, junctionId, worksheetId]
    );
    return result.rows[0];
  }

  async addFile(
    junctionId: number,
    worksheetId: string,
    fileName: string,
    updatedBy: string,
    poolTrx?: PoolClient
  ): Promise<WsCKJunctionType | undefined> {
    const result = await getPoolInstance(poolTrx).query<WsCKJunctionType>(
      `UPDATE worksheet_ck_junction
          SET file_1 = $1,
              last_update = CURRENT_TIMESTAMP,
              updated_by = $2
        WHERE junction_id = $3
          AND worksheet_id = $4
          AND file_1 IS NULL
        RETURNING *`,
      [fileName, updatedBy, junctionId, worksheetId]
    );
    return result.rows[0];
  }

  async deleteFile(
    junctionId: number,
    worksheetId: string,
    updatedBy: string,
    poolTrx?: PoolClient
  ): Promise<WsCKJunctionType | undefined> {
    const result = await getPoolInstance(poolTrx).query<WsCKJunctionType>(
      `UPDATE worksheet_ck_junction
          SET file_1 = NULL,
              last_update = CURRENT_TIMESTAMP,
              updated_by = $1
        WHERE junction_id = $2
          AND worksheet_id = $3
        RETURNING *`,
      [updatedBy, junctionId, worksheetId]
    );
    return result.rows[0];
  }
}

const wsCKJunction = new WsCKJunction();

export default wsCKJunction;
