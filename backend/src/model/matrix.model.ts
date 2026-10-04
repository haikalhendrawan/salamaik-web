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

export type Regulation2WorksheetType = 'PB' | 'SPML' | 'CK';

export interface Regulation2MatrixRow {
  matrix_id: number;
  worksheet_type: Regulation2WorksheetType;
  junction_id: number;
  checklist_id: number;
  nomor_kertas_kerja: string;
  komponen_supervisi: string;
  hasil_implementasi: string | null;
  permasalahan: string | null;
  rekomendasi: string | null;
  peraturan: string | null;
  uic: string | null;
  tindak_lanjut: string | null;
  status_penyelesaian: string | null;
  kanwil_score: number | null;
  kanwil_note: string | null;
}

// --------------------------------------------------
class Matrix{
  async getRegulation2Findings(worksheetId: string): Promise<Regulation2MatrixRow[]> {
    const { rows } = await pool.query<Regulation2MatrixRow>(
      `SELECT m.id AS matrix_id, m.worksheet_type, j.junction_id, c.id AS checklist_id,
              COALESCE(c.urut::text, c.id::text) AS nomor_kertas_kerja,
              CONCAT_WS(' - ', k.title, s.title) AS komponen_supervisi,
              m.hasil_implementasi, m.permasalahan, m.rekomendasi, m.peraturan, m.uic,
              m.tindak_lanjut,
              CASE f.status WHEN 0 THEN 'Perlu tindak lanjut' WHEN 1 THEN 'Proses' WHEN 2 THEN 'Ditolak' WHEN 3 THEN 'Disetujui' ELSE NULL END AS status_penyelesaian,
              j.kanwil_score, j.kanwil_note
         FROM matrix_data_peraturan_2 m
         JOIN worksheet_junction j ON m.worksheet_type = 'PB' AND j.junction_id = m.ws_junction_id
         JOIN checklist_ref c ON c.id = j.checklist_id
         LEFT JOIN komponen_ref k ON k.id = c.komponen_id
         LEFT JOIN subkomponen_ref s ON s.id = c.subkomponen_id
         LEFT JOIN findings_data f ON f.matrix_peraturan_2_id = m.id
        WHERE m.worksheet_id = $1 AND m.worksheet_type = 'PB' AND j.worksheet_id::text = $1
       UNION ALL
       SELECT m.id, m.worksheet_type, j.junction_id, c.id, c.urut::text,
              CONCAT_WS(' - ', k.title, c.materi), m.hasil_implementasi, m.permasalahan,
              m.rekomendasi, m.peraturan, m.uic, m.tindak_lanjut,
              CASE f.status WHEN 0 THEN 'Perlu tindak lanjut' WHEN 1 THEN 'Proses' WHEN 2 THEN 'Ditolak' WHEN 3 THEN 'Disetujui' ELSE NULL END,
              j.kanwil_score, j.kanwil_note
         FROM matrix_data_peraturan_2 m
         JOIN worksheet_ck_junction j ON m.worksheet_type = 'CK' AND j.junction_id = m.ws_ck_junction_id
         JOIN checklist_ck_ref c ON c.id = j.checklist_ck_id
         JOIN komponen_ck_ref k ON k.id = c.komponen_ck_id
         LEFT JOIN findings_data f ON f.matrix_peraturan_2_id = m.id
        WHERE m.worksheet_id = $1 AND m.worksheet_type = 'CK' AND j.worksheet_id::text = $1
       UNION ALL
       SELECT m.id, m.worksheet_type, j.junction_id, c.id, COALESCE(c.title, c.id::text),
              CONCAT_WS(' - ', k.title, s.title, a.title), m.hasil_implementasi, m.permasalahan,
              m.rekomendasi, m.peraturan, m.uic, m.tindak_lanjut,
              CASE f.status WHEN 0 THEN 'Perlu tindak lanjut' WHEN 1 THEN 'Proses' WHEN 2 THEN 'Ditolak' WHEN 3 THEN 'Disetujui' ELSE NULL END,
              j.kanwil_score, j.kanwil_note
         FROM matrix_data_peraturan_2 m
         JOIN worksheet_spml_junction j ON m.worksheet_type = 'SPML' AND j.junction_id = m.ws_spml_junction_id
         JOIN checklist_spml_ref c ON c.id = j.checklist_spml_id
         LEFT JOIN komponen_spml_ref k ON k.id = c.komponen_spml_id
         LEFT JOIN subkomponen_spml_ref s ON s.id = c.subkomponen_spml_id
         LEFT JOIN aspek_spml_ref a ON a.id = c.aspek_spml_id
         LEFT JOIN findings_data f ON f.matrix_peraturan_2_id = m.id
        WHERE m.worksheet_id = $1 AND m.worksheet_type = 'SPML' AND j.worksheet_id::text = $1
       ORDER BY 2, 4`, [worksheetId]
    );
    const order = { PB: 0, SPML: 1, CK: 2 } as const;
    return rows.sort((a, b) => order[a.worksheet_type] - order[b.worksheet_type]);
  }

  async syncRegulation2Matrix(worksheetId: string, poolTrx: PoolClient) {
    const statements = [
      `INSERT INTO matrix_data_peraturan_2
         (worksheet_id, worksheet_type, ws_junction_id, checklist_id, hasil_implementasi,
          permasalahan, rekomendasi, peraturan, uic, tindak_lanjut)
       SELECT worksheet_id::text, 'PB', ws_junction_id, checklist_id, finding_title,
              finding_description, rekomendasi_snapshot, peraturan_snapshot, uic_snapshot, NULL
         FROM findings_data WHERE worksheet_id = $1 AND worksheet_type = 'PB'
       ON CONFLICT (ws_junction_id) WHERE ws_junction_id IS NOT NULL DO NOTHING`,
      `INSERT INTO matrix_data_peraturan_2
         (worksheet_id, worksheet_type, ws_ck_junction_id, checklist_ck_id, hasil_implementasi,
          permasalahan, rekomendasi, peraturan, uic, tindak_lanjut)
       SELECT worksheet_id::text, 'CK', ws_ck_junction_id, checklist_ck_id, finding_title,
              finding_description, rekomendasi_snapshot, peraturan_snapshot, uic_snapshot, NULL
         FROM findings_data WHERE worksheet_id = $1 AND worksheet_type = 'CK'
       ON CONFLICT (ws_ck_junction_id) WHERE ws_ck_junction_id IS NOT NULL DO NOTHING`,
      `INSERT INTO matrix_data_peraturan_2
         (worksheet_id, worksheet_type, ws_spml_junction_id, checklist_spml_id, hasil_implementasi,
          permasalahan, rekomendasi, peraturan, uic, tindak_lanjut)
       SELECT worksheet_id::text, 'SPML', ws_spml_junction_id, checklist_spml_id, finding_title,
              finding_description, rekomendasi_snapshot, peraturan_snapshot, uic_snapshot, NULL
         FROM findings_data WHERE worksheet_id = $1 AND worksheet_type = 'SPML'
       ON CONFLICT (ws_spml_junction_id) WHERE ws_spml_junction_id IS NOT NULL DO NOTHING`,
    ];
    for (const sql of statements) await poolTrx.query(sql, [worksheetId]);
    await poolTrx.query(
      `UPDATE findings_data f SET matrix_peraturan_2_id = m.id
         FROM matrix_data_peraturan_2 m
        WHERE f.worksheet_id = $1 AND m.worksheet_id = f.worksheet_id::text
          AND f.worksheet_type = m.worksheet_type
          AND ((f.worksheet_type = 'PB' AND f.ws_junction_id = m.ws_junction_id)
            OR (f.worksheet_type = 'CK' AND f.ws_ck_junction_id = m.ws_ck_junction_id)
            OR (f.worksheet_type = 'SPML' AND f.ws_spml_junction_id = m.ws_spml_junction_id))`, [worksheetId]
    );
    await poolTrx.query(
      `DELETE FROM matrix_data_peraturan_2 m WHERE m.worksheet_id = $1 AND NOT EXISTS (
         SELECT 1 FROM findings_data f WHERE f.worksheet_id::text = m.worksheet_id AND f.matrix_peraturan_2_id = m.id
       )`, [worksheetId]
    );
  }

  async updateRegulation2Matrix(id: number, worksheetId: string, body: MatrixBodyType, poolTrx?: PoolClient) {
    const db = poolTrx ?? pool;
    const { rows } = await db.query(
      `UPDATE matrix_data_peraturan_2 SET hasil_implementasi = $1, permasalahan = $2,
          rekomendasi = $3, peraturan = $4, uic = $5, tindak_lanjut = $6, updated_at = NOW()
        WHERE id = $7 AND worksheet_id = $8 RETURNING *`,
      [body.hasilImplementasi, body.permasalahan, body.rekomendasi, body.peraturan, body.uic, body.tindakLanjut, id, worksheetId]
    );
    return rows[0];
  }

  async getRegulation2MatrixById(id: number) {
    const { rows } = await pool.query('SELECT * FROM matrix_data_peraturan_2 WHERE id = $1', [id]);
    return rows[0];
  }

  async updateRegulation2TindakLanjut(id: number, text: string, poolTrx?: PoolClient) {
    const db = poolTrx ?? pool;
    const { rows } = await db.query(
      'UPDATE matrix_data_peraturan_2 SET tindak_lanjut = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [text, id]
    );
    return rows[0];
  }

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
