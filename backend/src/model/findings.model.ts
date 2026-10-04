/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import pool from "../config/db";
import "dotenv/config";
import { PoolClient } from "pg";
import { WorksheetType } from "./worksheet.model";
import { ChecklistType } from "./checklist.model";
import { WorksheetJunctionType } from "./worksheetJunction.model";
import { MatrixType } from "./matrix.model";
import { KomponenType, SubKomponenType } from "./komponen.model";
import { OpsiType } from "./worksheetJunction.model";
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
  matrix_peraturan_2_id?: number | null,
  worksheet_type?: 'PB' | 'CK' | 'SPML',
  ws_ck_junction_id?: number | null,
  ws_spml_junction_id?: number | null,
  checklist_ck_id?: number | null,
  checklist_spml_id?: number | null,
  follow_up_file?: string | null,
  follow_up_link_file?: string | null,
  kppn_response: string,
  kanwil_response: string,
  score_before: number,
  score_after: number,
  last_update: string,
  status: number,
  updated_by: string
};

export type ComprehensiveFindingsType = (FindingsType & WorksheetJunctionType & ChecklistType & WorksheetType);

export interface DerivedFindingsType {
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
  worksheet: WorksheetType,
  ws_junction: WorksheetJunctionType,
  checklist: ChecklistType,
  matrix: MatrixType,
  komponen: KomponenType,
  subkomponen: SubKomponenType,
  opsi: OpsiType[] | null
}

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
  /** Synchronize draft Peraturan 2 findings while the follow-up phase is closed. */
  async postRegulation2Findings(worksheetId: string, poolTrx: PoolClient) {
    const statements = [
      `DELETE FROM findings_data f
        WHERE f.worksheet_id = $1 AND f.matrix_id IS NULL AND f.worksheet_type = 'PB'
          AND NOT EXISTS (
            SELECT 1 FROM worksheet_junction j
            JOIN LATERAL (SELECT MAX(o.value) AS max_score FROM opsi_ref o WHERE o.checklist_id = j.checklist_id AND o.deleted IS NULL) mx ON TRUE
            WHERE j.worksheet_id = f.worksheet_id AND j.junction_id = f.ws_junction_id
              AND COALESCE(j.excluded, 0) <> 1
              AND (j.kanwil_score IS NULL OR j.kanwil_score < COALESCE(mx.max_score, 10))
          )`,
      `DELETE FROM findings_data f
        WHERE f.worksheet_id = $1 AND f.matrix_id IS NULL AND f.worksheet_type = 'CK'
          AND NOT EXISTS (
            SELECT 1 FROM worksheet_ck_junction j
            JOIN LATERAL (SELECT MAX(o.value) AS max_score FROM opsi_ck_ref o WHERE o.checklist_ck_id = j.checklist_ck_id AND o.deleted IS NULL) mx ON TRUE
            WHERE j.worksheet_id = f.worksheet_id AND j.junction_id = f.ws_ck_junction_id
              AND COALESCE(j.excluded, 0) <> 1
              AND (j.kanwil_score IS NULL OR j.kanwil_score < COALESCE(mx.max_score, 10))
          )`,
      `DELETE FROM findings_data f
        WHERE f.worksheet_id = $1 AND f.matrix_id IS NULL AND f.worksheet_type = 'SPML'
          AND NOT EXISTS (
            SELECT 1 FROM worksheet_spml_junction j
            WHERE j.worksheet_id = f.worksheet_id AND j.junction_id = f.ws_spml_junction_id
              AND COALESCE(j.excluded, 0) <> 1
              AND (j.kanwil_score IS NULL OR j.kanwil_score < 10)
          )`,
      `INSERT INTO findings_data
         (worksheet_id, ws_junction_id, checklist_id, matrix_id, worksheet_type,
          initial_kppn_score, score_before, status, finding_title, finding_description,
          rekomendasi_snapshot, peraturan_snapshot, uic_snapshot)
       SELECT j.worksheet_id, j.junction_id, j.checklist_id, NULL, 'PB',
              j.kppn_score, j.kanwil_score, 0,
              COALESCE(selected.positive_fallback, c.matrix_title, c.title),
              COALESCE(selected.negative_fallback, minimum.negative_fallback),
              COALESCE(selected.rekomendasi, minimum.rekomendasi), c.peraturan, c.uic
         FROM worksheet_junction j
         JOIN checklist_ref c ON c.id = j.checklist_id
         LEFT JOIN LATERAL (SELECT o.* FROM opsi_ref o WHERE o.checklist_id = c.id AND o.deleted IS NULL AND o.value = j.kanwil_score LIMIT 1) selected ON TRUE
         LEFT JOIN LATERAL (SELECT o.* FROM opsi_ref o WHERE o.checklist_id = c.id AND o.deleted IS NULL ORDER BY o.value ASC LIMIT 1) minimum ON TRUE
         JOIN LATERAL (
           SELECT MAX(o.value) AS max_score FROM opsi_ref o
           WHERE o.checklist_id = j.checklist_id AND o.deleted IS NULL
         ) mx ON TRUE
        WHERE j.worksheet_id = $1 AND COALESCE(j.excluded, 0) <> 1
          AND (j.kanwil_score IS NULL OR j.kanwil_score < COALESCE(mx.max_score, 10))
       ON CONFLICT (ws_junction_id) WHERE ws_junction_id IS NOT NULL AND matrix_id IS NULL AND worksheet_type = 'PB'
       DO UPDATE SET initial_kppn_score = EXCLUDED.initial_kppn_score,
                     score_before = EXCLUDED.score_before,
                     finding_title = EXCLUDED.finding_title,
                     finding_description = EXCLUDED.finding_description,
                     rekomendasi_snapshot = EXCLUDED.rekomendasi_snapshot,
                     peraturan_snapshot = EXCLUDED.peraturan_snapshot,
                     uic_snapshot = EXCLUDED.uic_snapshot`,
      `INSERT INTO findings_data
         (worksheet_id, ws_junction_id, checklist_id, matrix_id, worksheet_type,
          ws_ck_junction_id, checklist_ck_id, initial_kppn_score, score_before, status,
          finding_title, finding_description, rekomendasi_snapshot, peraturan_snapshot, uic_snapshot)
       SELECT j.worksheet_id, NULL, NULL, NULL, 'CK', j.junction_id,
              j.checklist_ck_id, j.kppn_score, j.kanwil_score, 0,
              COALESCE(selected.positive_fallback, c.kriteria_penilaian),
              COALESCE(selected.negative_fallback, minimum.negative_fallback),
              COALESCE(selected.rekomendasi, minimum.rekomendasi), c.peraturan, c.uic
         FROM worksheet_ck_junction j
         JOIN checklist_ck_ref c ON c.id = j.checklist_ck_id
         LEFT JOIN LATERAL (SELECT o.* FROM opsi_ck_ref o WHERE o.checklist_ck_id = c.id AND o.deleted IS NULL AND o.value = j.kanwil_score LIMIT 1) selected ON TRUE
         LEFT JOIN LATERAL (SELECT o.* FROM opsi_ck_ref o WHERE o.checklist_ck_id = c.id AND o.deleted IS NULL ORDER BY o.value ASC LIMIT 1) minimum ON TRUE
         JOIN LATERAL (
           SELECT MAX(o.value) AS max_score FROM opsi_ck_ref o
           WHERE o.checklist_ck_id = j.checklist_ck_id AND o.deleted IS NULL
         ) mx ON TRUE
        WHERE j.worksheet_id = $1 AND COALESCE(j.excluded, 0) <> 1
          AND (j.kanwil_score IS NULL OR j.kanwil_score < COALESCE(mx.max_score, 10))
       ON CONFLICT (ws_ck_junction_id) WHERE ws_ck_junction_id IS NOT NULL
       DO UPDATE SET initial_kppn_score = EXCLUDED.initial_kppn_score,
                     score_before = EXCLUDED.score_before,
                     finding_title = EXCLUDED.finding_title,
                     finding_description = EXCLUDED.finding_description,
                     rekomendasi_snapshot = EXCLUDED.rekomendasi_snapshot,
                     peraturan_snapshot = EXCLUDED.peraturan_snapshot,
                     uic_snapshot = EXCLUDED.uic_snapshot`,
      `INSERT INTO findings_data
         (worksheet_id, ws_junction_id, checklist_id, matrix_id, worksheet_type,
          ws_spml_junction_id, checklist_spml_id, initial_kppn_score, score_before, status,
          finding_title, finding_description, rekomendasi_snapshot, peraturan_snapshot, uic_snapshot)
       SELECT j.worksheet_id, NULL, NULL, NULL, 'SPML', j.junction_id,
              j.checklist_spml_id, j.kppn_score, j.kanwil_score, 0,
              COALESCE(c.positive_fallback, c.uraian), c.negative_fallback,
              c.rekomendasi, c.peraturan, c.uic
         FROM worksheet_spml_junction j
         JOIN checklist_spml_ref c ON c.id = j.checklist_spml_id
        WHERE j.worksheet_id = $1 AND COALESCE(j.excluded, 0) <> 1
          AND (j.kanwil_score IS NULL OR j.kanwil_score < 10)
       ON CONFLICT (ws_spml_junction_id) WHERE ws_spml_junction_id IS NOT NULL
       DO UPDATE SET initial_kppn_score = EXCLUDED.initial_kppn_score,
                     score_before = EXCLUDED.score_before,
                     finding_title = EXCLUDED.finding_title,
                     finding_description = EXCLUDED.finding_description,
                     rekomendasi_snapshot = EXCLUDED.rekomendasi_snapshot,
                     peraturan_snapshot = EXCLUDED.peraturan_snapshot,
                     uic_snapshot = EXCLUDED.uic_snapshot`,
    ];
    const counts: number[] = [];
    for (const sql of statements) {
      const result = await poolTrx.query(sql, [worksheetId]);
      counts.push(result.rowCount ?? 0);
    }
    const [removedPB, removedCK, removedSPML, pb, ck, spml] = counts;
    return {
      addedOrUpdated: { pb, ck, spml, total: pb + ck + spml },
      removedNoLongerEligible: { pb: removedPB, ck: removedCK, spml: removedSPML, total: removedPB + removedCK + removedSPML },
    };
  }

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
      const q = `SELECT * FROM findings_data WHERE worksheet_id = $1 ORDER BY id ASC`;
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

  // findings comprehensive = findings + ws junction + checklist + worksheet
  async getComprehensiveByKPPNPeriod(kppnId: string, period: number): Promise<ComprehensiveFindingsType[]>{
    try{
      const q = `SELECT findings_data.*, worksheet_junction.*, checklist_ref.*, worksheet_ref.*
        FROM public.findings_data 
        LEFT JOIN worksheet_junction 
        ON findings_data.ws_junction_id = worksheet_junction.junction_id
        LEFT JOIN checklist_ref
        ON worksheet_junction.checklist_id = checklist_ref.id
        LEFT JOIN worksheet_ref
        ON worksheet_junction.worksheet_id = worksheet_ref.id
        WHERE worksheet_junction.kppn_id = $1 AND worksheet_junction.period = $2
      `;
      const result = await pool.query(q, [kppnId, period]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  // derived findings = findings + ws junction + checklist + matrix + komponen + subkomponen + opsi in subderived format
  async getDerived(worksheetId: string, poolTrx?: PoolClient): Promise<DerivedFindingsType []> {
    const poolInstance = poolTrx??pool;
      
    try{
      const q = ` SELECT 
                    findings_data.*,
                    to_jsonb(worksheet_ref) AS worksheet,
                    to_jsonb(worksheet_junction) AS ws_junction, 
                    to_jsonb(checklist_ref) AS checklist,
                    to_jsonb(matrix_data) AS matrix,
                    to_jsonb(komponen_ref) AS komponen,
                    to_jsonb(subkomponen_ref) AS subkomponen,
                    (
                      SELECT json_agg(opsi_ref.* ORDER BY opsi_ref.id ASC)
                      FROM opsi_ref
                      WHERE opsi_ref.checklist_id = findings_data.checklist_id
                    ) AS opsi
                  FROM findings_data 
                  LEFT JOIN worksheet_ref
                  ON findings_data.worksheet_id = worksheet_ref.id
                  LEFT JOIN worksheet_junction
                  ON findings_data.ws_junction_id = worksheet_junction.junction_id
                  LEFT JOIN checklist_ref
                  ON findings_data.checklist_id = checklist_ref.id
                  LEFT JOIN matrix_data
                  ON findings_data.matrix_id = matrix_data.id
                  LEFT JOIN komponen_ref
                  ON komponen_ref.id = checklist_ref.komponen_id
                  LEFT JOIN subkomponen_ref
                  ON subkomponen_ref.id = checklist_ref.subkomponen_id
                  WHERE findings_data.worksheet_id = $1
                  GROUP BY findings_data.id, worksheet_ref.id, worksheet_junction.junction_id, checklist_ref.id, matrix_data.id, subkomponen_ref.id, komponen_ref.id
                  ORDER BY findings_data.id
                  `;
      const result = await poolInstance.query(q, [worksheetId]);
      return result.rows
    }catch(err){
      throw err
    }
  }

  async getDerivedRegulation2(worksheetId: string): Promise<any[]> {
    const { rows } = await pool.query(
      `SELECT f.*,
              to_jsonb(w) AS worksheet,
              row_data.ws_junction,
              row_data.checklist,
              row_data.matrix,
              row_data.komponen,
              row_data.subkomponen,
              row_data.opsi
         FROM findings_data f
         JOIN worksheet_ref w ON w.id = f.worksheet_id
         CROSS JOIN LATERAL (
           SELECT to_jsonb(j) || jsonb_build_object(
                    'kppn_score', COALESCE(f.follow_up_kppn_score, f.initial_kppn_score, j.kppn_score),
                    'kanwil_score', COALESCE(f.score_after, f.score_before, j.kanwil_score)
                  ) AS ws_junction, to_jsonb(c) AS checklist,
                  COALESCE(to_jsonb(m2), jsonb_build_object('permasalahan', f.finding_description, 'uic', f.uic_snapshot)) AS matrix,
                  to_jsonb(k) AS komponen,
                  COALESCE(to_jsonb(s), jsonb_build_object('title', '')) AS subkomponen,
                  (SELECT jsonb_agg(o.* ORDER BY o.value DESC) FROM opsi_ref o WHERE o.checklist_id = c.id AND o.deleted IS NULL) AS opsi
             FROM worksheet_junction j
             JOIN checklist_ref c ON c.id = f.checklist_id
             LEFT JOIN komponen_ref k ON k.id = c.komponen_id
             LEFT JOIN subkomponen_ref s ON s.id = c.subkomponen_id
             LEFT JOIN matrix_data_peraturan_2 m2 ON m2.id = f.matrix_peraturan_2_id
            WHERE f.worksheet_type = 'PB' AND j.junction_id = f.ws_junction_id
           UNION ALL
           SELECT to_jsonb(j) || jsonb_build_object(
                    'kppn_score', COALESCE(f.follow_up_kppn_score, f.initial_kppn_score, j.kppn_score),
                    'kanwil_score', COALESCE(f.score_after, f.score_before, j.kanwil_score)
                  ), to_jsonb(c) || jsonb_build_object(
                    'title', COALESCE(to_jsonb(c)->>'materi', 'Checklist CK'),
                    'header', COALESCE(to_jsonb(c)->>'kriteria_penilaian', '')
                  ),
                  COALESCE(to_jsonb(m2), jsonb_build_object('permasalahan', f.finding_description, 'uic', f.uic_snapshot)),
                  to_jsonb(k), jsonb_build_object('title', ''),
                  (SELECT jsonb_agg(o.* ORDER BY o.value DESC) FROM opsi_ck_ref o WHERE o.checklist_ck_id = c.id AND o.deleted IS NULL)
             FROM worksheet_ck_junction j
             JOIN checklist_ck_ref c ON c.id = f.checklist_ck_id
             JOIN komponen_ck_ref k ON k.id = c.komponen_ck_id
             LEFT JOIN matrix_data_peraturan_2 m2 ON m2.id = f.matrix_peraturan_2_id
            WHERE f.worksheet_type = 'CK' AND j.junction_id = f.ws_ck_junction_id
           UNION ALL
           SELECT to_jsonb(j) || jsonb_build_object(
                    'kppn_score', COALESCE(f.follow_up_kppn_score, f.initial_kppn_score, j.kppn_score),
                    'kanwil_score', COALESCE(f.score_after, f.score_before, j.kanwil_score)
                  ), to_jsonb(c),
                  COALESCE(to_jsonb(m2), jsonb_build_object('permasalahan', f.finding_description, 'uic', f.uic_snapshot)),
                  to_jsonb(k), COALESCE(to_jsonb(s), jsonb_build_object('title', '')),
                  NULL::jsonb
             FROM worksheet_spml_junction j
             JOIN checklist_spml_ref c ON c.id = f.checklist_spml_id
             LEFT JOIN komponen_spml_ref k ON k.id = c.komponen_spml_id
             LEFT JOIN subkomponen_spml_ref s ON s.id = c.subkomponen_spml_id
             LEFT JOIN matrix_data_peraturan_2 m2 ON m2.id = f.matrix_peraturan_2_id
            WHERE f.worksheet_type = 'SPML' AND j.junction_id = f.ws_spml_junction_id
         ) row_data(ws_junction, checklist, matrix, komponen, subkomponen, opsi)
        WHERE f.worksheet_id = $1 AND f.matrix_id IS NULL AND f.worksheet_type IN ('PB', 'CK', 'SPML')
          AND (f.ws_junction_id IS NOT NULL OR f.ws_ck_junction_id IS NOT NULL OR f.ws_spml_junction_id IS NOT NULL)
        ORDER BY f.id`,
      [worksheetId]
    );
    return rows;
  }

  async updateRegulation2FollowUpScore(id: number, score: number | null, side: 'KPPN' | 'KANWIL', userName: string) {
    const column = side === 'KPPN' ? 'follow_up_kppn_score' : 'score_after';
    const { rows } = await pool.query(
      `UPDATE findings_data SET ${column} = $1, updated_by = $2, last_update = NOW()
        WHERE id = $3 AND matrix_id IS NULL AND worksheet_type IN ('PB', 'CK', 'SPML')
        RETURNING *`,
      [score, userName, id]
    );
    return rows[0];
  }

  async isRegulation2ScoreAllowed(finding: FindingsType, score: number | null): Promise<boolean> {
    if (score === null) return true;
    if (finding.worksheet_type === 'PB') {
      const result = await pool.query(
        `SELECT c.standardisasi,
                EXISTS (SELECT 1 FROM opsi_ref o WHERE o.checklist_id = c.id AND o.deleted IS NULL AND o.value = $2) AS is_option
           FROM checklist_ref c WHERE c.id = $1`,
        [finding.checklist_id, score]
      );
      if (!result.rows[0]) return false;
      return Number(result.rows[0].standardisasi) === 1
        ? score >= 0 && score <= 12
        : result.rows[0].is_option;
    }
    if (finding.worksheet_type === 'CK') {
      const result = await pool.query(
        `SELECT EXISTS (SELECT 1 FROM opsi_ck_ref o WHERE o.checklist_ck_id = $1 AND o.deleted IS NULL AND o.value = $2) AS is_option`,
        [finding.checklist_ck_id, score]
      );
      return result.rows[0]?.is_option === true;
    }
    return finding.worksheet_type === 'SPML' && (score === 0 || score === 10);
  }

  async updateRegulation2FollowUpFile(id: number, fileName: string | null, userName: string) {
    const { rows } = await pool.query(
      `UPDATE findings_data SET follow_up_file = $1, updated_by = $2, last_update = NOW()
        WHERE id = $3 AND matrix_id IS NULL RETURNING *`,
      [fileName, userName, id]
    );
    return rows[0];
  }

  async updateRegulation2FollowUpLink(id: number, link: string | null, userName: string) {
    const { rows } = await pool.query(
      `UPDATE findings_data SET follow_up_link_file = $1, updated_by = $2, last_update = NOW()
        WHERE id = $3 AND matrix_id IS NULL RETURNING *`,
      [link, userName, id]
    );
    return rows[0];
  }

  async updateFindingsResponse(id: number, kppnResponse: string, kanwilResponse: string, userName: string, poolTrx?: PoolClient){
    const poolInstance = poolTrx??pool;
    try{
      const updateTime = new Date(Date.now()).toISOString();
      const q = `UPDATE findings_data 
                 SET kppn_response = $1, kanwil_response = $2, updated_by = $3, last_update = $4
                 WHERE id = $5
                 RETURNING *`;
      const result = await poolInstance.query(q, [kppnResponse, kanwilResponse, userName, updateTime, id]);
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
