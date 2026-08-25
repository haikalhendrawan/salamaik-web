/**
 * Salamaik API 
 * © Kanwil DJPb Sumbar 2026
 */

import pool from "../config/db";
import { PoolClient } from "pg";

export interface KomponenSpmlType {
  id: number;
  title: string;
  bobot: number;
  alias: string | null;
  detail: string | null;
  peraturan: number;
  deleted?: Date | string | null;
  urut: string | null;
}

export interface SubKomponenSpmlType {
  id: number;
  komponen_spml_id: number;
  title: string;
  detail: string | null;
  deleted?: Date | string | null;
  urut: string | null;
}

export interface AspekSpmlType {
  id: number;
  urut: number;
  urut_huruf: string | null;
  komponen_spml_id: number;
  subkomponen_spml_id: number;
  title: string;
  detail: string | null;
  deleted?: Date | string | null;
}

export interface ChecklistSpmlType {
  id: number;
  title: string | null;
  uraian: string;
  dokumen: string | null;
  komponen_spml_id: number;
  subkomponen_spml_id: number;
  aspek_spml_id: number;
  deleted?: Date | string | null;
}

// =============================================================================
// 1. KOMPONEN SPML CLASS
// =============================================================================
class KomponenSpml {
  async getAllKomponenSpml(peraturan?: number, poolTrx?: PoolClient) {
    const poolInstance = poolTrx ?? pool;
    try {
      let q = `SELECT * FROM komponen_spml_ref WHERE deleted IS NULL`;
      const params: any[] = [];
      if (peraturan !== undefined && peraturan !== null) {
        q += ` AND peraturan = $1`;
        params.push(peraturan);
      }
      q += ` ORDER BY id ASC`;
      const result = await poolInstance.query(q, params);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async createKomponenSpml(body: Omit<KomponenSpmlType, 'id'>) {
    try {
      const { title, bobot, alias, detail, peraturan, urut } = body;
      const q = `INSERT INTO komponen_spml_ref (title, bobot, alias, detail, peraturan, urut) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const result = await pool.query(q, [title, bobot ?? 0, alias ?? null, detail ?? null, peraturan ?? 2, urut ?? null]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async editKomponenSpml(body: Partial<KomponenSpmlType> & { id: number }) {
    try {
      const { id, title, bobot, alias, detail, urut } = body;
      const q = `UPDATE komponen_spml_ref 
                 SET title = $1, bobot = $2, alias = $3, detail = $4, urut = $5 
                 WHERE id = $6 RETURNING *`;
      const result = await pool.query(q, [title, bobot, alias, detail, urut ?? null, id]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async deleteKomponenSpml(id: number) {
    try {
      const q = `UPDATE komponen_spml_ref SET deleted = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
      const result = await pool.query(q, [id]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }
}

const komponenSpml = new KomponenSpml();

// =============================================================================
// 2. SUBKOMPONEN SPML CLASS
// =============================================================================
class SubKomponenSpml {
  async getAllSubKomponenSpml(poolTrx?: PoolClient) {
    const poolInstance = poolTrx ?? pool;
    try {
      const q = `SELECT * FROM subkomponen_spml_ref WHERE deleted IS NULL ORDER BY id ASC`;
      const result = await poolInstance.query(q);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async createSubKomponenSpml(body: Omit<SubKomponenSpmlType, 'id'>) {
    try {
      const { komponen_spml_id, title, detail, urut } = body;
      const q = `INSERT INTO subkomponen_spml_ref (komponen_spml_id, title, detail, urut) 
                 VALUES ($1, $2, $3, $4) RETURNING *`;
      const result = await pool.query(q, [komponen_spml_id, title, detail ?? null, urut ?? null]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async editSubKomponenSpml(body: Partial<SubKomponenSpmlType> & { id: number }) {
    try {
      const { id, komponen_spml_id, title, detail, urut } = body;
      const q = `UPDATE subkomponen_spml_ref 
                 SET komponen_spml_id = $1, title = $2, detail = $3, urut = $4 
                 WHERE id = $5 RETURNING *`;
      const result = await pool.query(q, [komponen_spml_id, title, detail, urut ?? null, id]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async deleteSubKomponenSpml(id: number) {
    try {
      const q = `UPDATE subkomponen_spml_ref SET deleted = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
      const result = await pool.query(q, [id]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }
}

const subKomponenSpml = new SubKomponenSpml();

// =============================================================================
// 3. ASPEK SPML CLASS
// =============================================================================
class AspekSpml {
  async getAllAspekSpml(poolTrx?: PoolClient) {
    const poolInstance = poolTrx ?? pool;
    try {
      const q = `SELECT * FROM aspek_spml_ref WHERE deleted IS NULL ORDER BY urut ASC, id ASC`;
      const result = await poolInstance.query(q);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async createAspekSpml(body: Omit<AspekSpmlType, 'id'>) {
    try {
      const { urut, urut_huruf, komponen_spml_id, subkomponen_spml_id, title, detail } = body;
      const q = `INSERT INTO aspek_spml_ref (urut, urut_huruf, komponen_spml_id, subkomponen_spml_id, title, detail) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const result = await pool.query(q, [urut, urut_huruf ?? null, komponen_spml_id, subkomponen_spml_id, title, detail ?? null]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async editAspekSpml(body: Partial<AspekSpmlType> & { id: number }) {
    try {
      const { id, urut, urut_huruf, komponen_spml_id, subkomponen_spml_id, title, detail } = body;
      const q = `UPDATE aspek_spml_ref 
                 SET urut = $1, urut_huruf = $2, komponen_spml_id = $3, subkomponen_spml_id = $4, title = $5, detail = $6 
                 WHERE id = $7 RETURNING *`;
      const result = await pool.query(q, [urut, urut_huruf, komponen_spml_id, subkomponen_spml_id, title, detail, id]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async deleteAspekSpml(id: number) {
    try {
      const q = `UPDATE aspek_spml_ref SET deleted = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
      const result = await pool.query(q, [id]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }
}

const aspekSpml = new AspekSpml();

// =============================================================================
// 4. CHECKLIST SPML CLASS
// =============================================================================
class ChecklistSpml {
  async getAllChecklistSpml(poolTrx?: PoolClient): Promise<ChecklistSpmlType[]> {
    const poolInstance = poolTrx ?? pool;
    try {
      const q = `SELECT checklist_spml_ref.* FROM checklist_spml_ref 
                 INNER JOIN komponen_spml_ref ON checklist_spml_ref.komponen_spml_id = komponen_spml_ref.id
                 WHERE checklist_spml_ref.deleted IS NULL
                   AND komponen_spml_ref.deleted IS NULL
                 ORDER BY checklist_spml_ref.id ASC`;
      const result = await poolInstance.query(q);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async createChecklistSpml(body: Omit<ChecklistSpmlType, 'id'>) {
    try {
      const { title, uraian, dokumen, komponen_spml_id, subkomponen_spml_id, aspek_spml_id } = body;
      const q = `INSERT INTO checklist_spml_ref (title, uraian, dokumen, komponen_spml_id, subkomponen_spml_id, aspek_spml_id) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const result = await pool.query(q, [title ?? null, uraian, dokumen ?? null, komponen_spml_id, subkomponen_spml_id, aspek_spml_id]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async editChecklistSpml(body: Partial<ChecklistSpmlType> & { id: number }) {
    try {
      const { id, title, uraian, dokumen, komponen_spml_id, subkomponen_spml_id, aspek_spml_id } = body;
      const q = `UPDATE checklist_spml_ref 
                 SET title = $1, uraian = $2, dokumen = $3, komponen_spml_id = $4, subkomponen_spml_id = $5, aspek_spml_id = $6 
                 WHERE id = $7 RETURNING *`;
      const result = await pool.query(q, [title, uraian, dokumen, komponen_spml_id, subkomponen_spml_id, aspek_spml_id, id]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  async deleteChecklistSpml(id: number) {
    try {
      const q = `UPDATE checklist_spml_ref SET deleted = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
      const result = await pool.query(q, [id]);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }
}

const checklistSpml = new ChecklistSpml();

export { komponenSpml, subKomponenSpml, aspekSpml, checklistSpml };
