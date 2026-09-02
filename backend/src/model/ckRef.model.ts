/**
 * Salamaik API
 * Reference model for Kertas Kerja Capaian Kinerja (CK)
 */

import { PoolClient } from 'pg';
import pool from '../config/db';
import ErrorDetail from './error.model';

type TimestampValue = Date | string;

export interface KomponenCkType {
  id: number;
  peraturan: number;
  urut: string;
  title: string;
  alias: string | null;
  detail: string | null;
  deleted: TimestampValue | null;
  created_at: TimestampValue;
  updated_at: TimestampValue;
}

export interface ChecklistCkType {
  id: number;
  komponen_ck_id: number;
  urut: number;
  materi: string;
  kriteria_penilaian: string;
  bukti_dukung: string | null;
  deleted: TimestampValue | null;
  created_at: TimestampValue;
  updated_at: TimestampValue;
}

export interface ChecklistCkWithKomponenType extends ChecklistCkType {
  komponen_title: string;
  komponen_urut: string;
}

export type CkScoreValue = 0 | 5 | 10;

export interface OpsiCkType {
  id: number;
  checklist_ck_id: number;
  label: string;
  description: string | null;
  value: CkScoreValue;
  urut: number;
  deleted: TimestampValue | null;
  created_at: TimestampValue;
  updated_at: TimestampValue;
}

export interface OpsiCkWithChecklistType extends OpsiCkType {
  checklist_urut: number;
  checklist_materi: string;
  komponen_ck_id: number;
}

export type CreateKomponenCkInput = Pick<
  KomponenCkType,
  'peraturan' | 'urut' | 'title' | 'alias' | 'detail'
>;

export type UpdateKomponenCkInput = Omit<CreateKomponenCkInput, 'peraturan'> & {
  id: number;
};

export type CreateChecklistCkInput = Pick<
  ChecklistCkType,
  'komponen_ck_id' | 'urut' | 'materi' | 'kriteria_penilaian' | 'bukti_dukung'
>;

export type UpdateChecklistCkInput = CreateChecklistCkInput & { id: number };

export type CreateOpsiCkInput = Pick<
  OpsiCkType,
  'checklist_ck_id' | 'label' | 'description' | 'value' | 'urut'
>;

export type UpdateOpsiCkInput = CreateOpsiCkInput & { id: number };

const getPoolInstance = (poolTrx?: PoolClient) => poolTrx ?? pool;

async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

class KomponenCk {
  async getAll(peraturan: number, poolTrx?: PoolClient): Promise<KomponenCkType[]> {
    const result = await getPoolInstance(poolTrx).query<KomponenCkType>(
      `SELECT *
         FROM komponen_ck_ref
        WHERE peraturan = $1
          AND deleted IS NULL
        ORDER BY urut ASC, id ASC`,
      [peraturan]
    );
    return result.rows;
  }

  async getById(
    id: number,
    peraturan: number,
    poolTrx?: PoolClient
  ): Promise<KomponenCkType | undefined> {
    const result = await getPoolInstance(poolTrx).query<KomponenCkType>(
      `SELECT *
         FROM komponen_ck_ref
        WHERE id = $1
          AND peraturan = $2
          AND deleted IS NULL`,
      [id, peraturan]
    );
    return result.rows[0];
  }

  async existsByUrut(
    peraturan: number,
    urut: string,
    excludeId?: number,
    poolTrx?: PoolClient
  ): Promise<boolean> {
    const params: Array<number | string> = [peraturan, urut];
    let query = `SELECT 1
                   FROM komponen_ck_ref
                  WHERE peraturan = $1
                    AND LOWER(BTRIM(urut)) = LOWER(BTRIM($2))
                    AND deleted IS NULL`;
    if (excludeId !== undefined) {
      params.push(excludeId);
      query += ` AND id <> $3`;
    }
    query += ` LIMIT 1`;

    const result = await getPoolInstance(poolTrx).query(query, params);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async hasActiveChecklist(id: number, poolTrx?: PoolClient): Promise<boolean> {
    const result = await getPoolInstance(poolTrx).query(
      `SELECT 1
         FROM checklist_ck_ref
        WHERE komponen_ck_id = $1
          AND deleted IS NULL
        LIMIT 1`,
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }

  async create(body: CreateKomponenCkInput): Promise<KomponenCkType> {
    return withTransaction(async (client) => {
      await client.query('LOCK TABLE komponen_ck_ref IN SHARE ROW EXCLUSIVE MODE');

      if (await this.existsByUrut(body.peraturan, body.urut, undefined, client)) {
        throw new ErrorDetail(409, 'Urut komponen CK sudah digunakan pada regulasi ini');
      }

      const result = await client.query<KomponenCkType>(
        `INSERT INTO komponen_ck_ref (peraturan, urut, title, alias, detail)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [body.peraturan, body.urut, body.title, body.alias, body.detail]
      );
      return result.rows[0];
    });
  }

  async edit(body: UpdateKomponenCkInput, peraturan: number): Promise<KomponenCkType> {
    return withTransaction(async (client) => {
      await client.query('LOCK TABLE komponen_ck_ref IN SHARE ROW EXCLUSIVE MODE');

      if (!(await this.getById(body.id, peraturan, client))) {
        throw new ErrorDetail(404, 'Komponen CK tidak ditemukan');
      }
      if (await this.existsByUrut(peraturan, body.urut, body.id, client)) {
        throw new ErrorDetail(409, 'Urut komponen CK sudah digunakan pada regulasi ini');
      }

      const result = await client.query<KomponenCkType>(
        `UPDATE komponen_ck_ref
            SET urut = $1,
                title = $2,
                alias = $3,
                detail = $4,
                updated_at = CURRENT_TIMESTAMP
          WHERE id = $5
            AND peraturan = $6
            AND deleted IS NULL
          RETURNING *`,
        [body.urut, body.title, body.alias, body.detail, body.id, peraturan]
      );
      return result.rows[0];
    });
  }

  async delete(id: number, peraturan: number): Promise<KomponenCkType> {
    return withTransaction(async (client) => {
      await client.query(
        'LOCK TABLE komponen_ck_ref, checklist_ck_ref IN SHARE ROW EXCLUSIVE MODE'
      );

      if (!(await this.getById(id, peraturan, client))) {
        throw new ErrorDetail(404, 'Komponen CK tidak ditemukan');
      }
      if (await this.hasActiveChecklist(id, client)) {
        throw new ErrorDetail(409, 'Komponen CK masih mempunyai checklist aktif');
      }

      const result = await client.query<KomponenCkType>(
        `UPDATE komponen_ck_ref
            SET deleted = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
            AND peraturan = $2
            AND deleted IS NULL
          RETURNING *`,
        [id, peraturan]
      );
      return result.rows[0];
    });
  }
}

class ChecklistCk {
  async getAll(
    peraturan: number,
    poolTrx?: PoolClient
  ): Promise<ChecklistCkWithKomponenType[]> {
    const result = await getPoolInstance(poolTrx).query<ChecklistCkWithKomponenType>(
      `SELECT checklist.*,
              komponen.title AS komponen_title,
              komponen.urut AS komponen_urut
         FROM checklist_ck_ref AS checklist
         INNER JOIN komponen_ck_ref AS komponen
           ON komponen.id = checklist.komponen_ck_id
          AND komponen.deleted IS NULL
        WHERE komponen.peraturan = $1
          AND checklist.deleted IS NULL
        ORDER BY komponen.urut ASC, checklist.urut ASC, checklist.id ASC`,
      [peraturan]
    );
    return result.rows;
  }

  async getById(
    id: number,
    peraturan: number,
    poolTrx?: PoolClient
  ): Promise<ChecklistCkType | undefined> {
    const result = await getPoolInstance(poolTrx).query<ChecklistCkType>(
      `SELECT checklist.*
         FROM checklist_ck_ref AS checklist
         INNER JOIN komponen_ck_ref AS komponen
           ON komponen.id = checklist.komponen_ck_id
          AND komponen.deleted IS NULL
        WHERE checklist.id = $1
          AND komponen.peraturan = $2
          AND checklist.deleted IS NULL`,
      [id, peraturan]
    );
    return result.rows[0];
  }

  async existsByUrut(
    komponenCkId: number,
    urut: number,
    excludeId?: number,
    poolTrx?: PoolClient
  ): Promise<boolean> {
    const params: number[] = [komponenCkId, urut];
    let query = `SELECT 1
                   FROM checklist_ck_ref
                  WHERE komponen_ck_id = $1
                    AND urut = $2
                    AND deleted IS NULL`;
    if (excludeId !== undefined) {
      params.push(excludeId);
      query += ` AND id <> $3`;
    }
    query += ` LIMIT 1`;

    const result = await getPoolInstance(poolTrx).query(query, params);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async create(body: CreateChecklistCkInput, peraturan: number): Promise<ChecklistCkType> {
    return withTransaction(async (client) => {
      await client.query(
        'LOCK TABLE komponen_ck_ref, checklist_ck_ref IN SHARE ROW EXCLUSIVE MODE'
      );

      if (!(await komponenCk.getById(body.komponen_ck_id, peraturan, client))) {
        throw new ErrorDetail(404, 'Komponen CK tidak ditemukan pada regulasi aktif');
      }
      if (await this.existsByUrut(body.komponen_ck_id, body.urut, undefined, client)) {
        throw new ErrorDetail(409, 'Urut checklist CK sudah digunakan pada komponen ini');
      }

      const result = await client.query<ChecklistCkType>(
        `INSERT INTO checklist_ck_ref
          (komponen_ck_id, urut, materi, kriteria_penilaian, bukti_dukung)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          body.komponen_ck_id,
          body.urut,
          body.materi,
          body.kriteria_penilaian,
          body.bukti_dukung,
        ]
      );
      return result.rows[0];
    });
  }

  async edit(
    body: UpdateChecklistCkInput,
    peraturan: number
  ): Promise<ChecklistCkType> {
    return withTransaction(async (client) => {
      await client.query(
        'LOCK TABLE komponen_ck_ref, checklist_ck_ref IN SHARE ROW EXCLUSIVE MODE'
      );

      if (!(await this.getById(body.id, peraturan, client))) {
        throw new ErrorDetail(404, 'Checklist CK tidak ditemukan');
      }
      if (!(await komponenCk.getById(body.komponen_ck_id, peraturan, client))) {
        throw new ErrorDetail(404, 'Komponen CK tujuan tidak ditemukan pada regulasi aktif');
      }
      if (await this.existsByUrut(body.komponen_ck_id, body.urut, body.id, client)) {
        throw new ErrorDetail(409, 'Urut checklist CK sudah digunakan pada komponen ini');
      }

      const result = await client.query<ChecklistCkType>(
        `UPDATE checklist_ck_ref
            SET komponen_ck_id = $1,
                urut = $2,
                materi = $3,
                kriteria_penilaian = $4,
                bukti_dukung = $5,
                updated_at = CURRENT_TIMESTAMP
          WHERE id = $6
            AND deleted IS NULL
          RETURNING *`,
        [
          body.komponen_ck_id,
          body.urut,
          body.materi,
          body.kriteria_penilaian,
          body.bukti_dukung,
          body.id,
        ]
      );
      return result.rows[0];
    });
  }

  async delete(id: number, peraturan: number): Promise<ChecklistCkType> {
    return withTransaction(async (client) => {
      await client.query(
        'LOCK TABLE komponen_ck_ref, checklist_ck_ref IN SHARE ROW EXCLUSIVE MODE'
      );

      if (!(await this.getById(id, peraturan, client))) {
        throw new ErrorDetail(404, 'Checklist CK tidak ditemukan');
      }

      const result = await client.query<ChecklistCkType>(
        `UPDATE checklist_ck_ref
            SET deleted = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
            AND deleted IS NULL
          RETURNING *`,
        [id]
      );
      return result.rows[0];
    });
  }
}

class OpsiCk {
  async getAll(
    peraturan: number,
    checklistCkId?: number,
    poolTrx?: PoolClient
  ): Promise<OpsiCkWithChecklistType[]> {
    const params: number[] = [peraturan];
    let checklistFilter = '';
    if (checklistCkId !== undefined) {
      params.push(checklistCkId);
      checklistFilter = ` AND opsi.checklist_ck_id = $2`;
    }

    const result = await getPoolInstance(poolTrx).query<OpsiCkWithChecklistType>(
      `SELECT opsi.*,
              checklist.urut AS checklist_urut,
              checklist.materi AS checklist_materi,
              checklist.komponen_ck_id
         FROM opsi_ck_ref AS opsi
         INNER JOIN checklist_ck_ref AS checklist
           ON checklist.id = opsi.checklist_ck_id
          AND checklist.deleted IS NULL
         INNER JOIN komponen_ck_ref AS komponen
           ON komponen.id = checklist.komponen_ck_id
          AND komponen.deleted IS NULL
        WHERE komponen.peraturan = $1
          AND opsi.deleted IS NULL
          ${checklistFilter}
        ORDER BY checklist.urut ASC, opsi.urut ASC, opsi.id ASC`,
      params
    );
    return result.rows;
  }

  async getById(
    id: number,
    peraturan: number,
    poolTrx?: PoolClient
  ): Promise<OpsiCkType | undefined> {
    const result = await getPoolInstance(poolTrx).query<OpsiCkType>(
      `SELECT opsi.*
         FROM opsi_ck_ref AS opsi
         INNER JOIN checklist_ck_ref AS checklist
           ON checklist.id = opsi.checklist_ck_id
          AND checklist.deleted IS NULL
         INNER JOIN komponen_ck_ref AS komponen
           ON komponen.id = checklist.komponen_ck_id
          AND komponen.deleted IS NULL
        WHERE opsi.id = $1
          AND komponen.peraturan = $2
          AND opsi.deleted IS NULL`,
      [id, peraturan]
    );
    return result.rows[0];
  }

  async existsByValue(
    checklistCkId: number,
    value: CkScoreValue,
    excludeId?: number,
    poolTrx?: PoolClient
  ): Promise<boolean> {
    return this.existsByField('value', checklistCkId, value, excludeId, poolTrx);
  }

  async existsByUrut(
    checklistCkId: number,
    urut: number,
    excludeId?: number,
    poolTrx?: PoolClient
  ): Promise<boolean> {
    return this.existsByField('urut', checklistCkId, urut, excludeId, poolTrx);
  }

  private async existsByField(
    field: 'value' | 'urut',
    checklistCkId: number,
    value: number,
    excludeId?: number,
    poolTrx?: PoolClient
  ): Promise<boolean> {
    const params: number[] = [checklistCkId, value];
    let query = `SELECT 1
                   FROM opsi_ck_ref
                  WHERE checklist_ck_id = $1
                    AND ${field} = $2
                    AND deleted IS NULL`;
    if (excludeId !== undefined) {
      params.push(excludeId);
      query += ` AND id <> $3`;
    }
    query += ` LIMIT 1`;

    const result = await getPoolInstance(poolTrx).query(query, params);
    return result.rowCount !== null && result.rowCount > 0;
  }

  private async validateUniqueFields(
    body: CreateOpsiCkInput,
    excludeId: number | undefined,
    client: PoolClient
  ): Promise<void> {
    if (await this.existsByValue(body.checklist_ck_id, body.value, excludeId, client)) {
      throw new ErrorDetail(409, 'Nilai opsi CK sudah digunakan pada checklist ini');
    }
    if (await this.existsByUrut(body.checklist_ck_id, body.urut, excludeId, client)) {
      throw new ErrorDetail(409, 'Urut opsi CK sudah digunakan pada checklist ini');
    }
  }

  async create(body: CreateOpsiCkInput, peraturan: number): Promise<OpsiCkType> {
    return withTransaction(async (client) => {
      await client.query(
        'LOCK TABLE komponen_ck_ref, checklist_ck_ref, opsi_ck_ref IN SHARE ROW EXCLUSIVE MODE'
      );

      if (!(await checklistCk.getById(body.checklist_ck_id, peraturan, client))) {
        throw new ErrorDetail(404, 'Checklist CK tidak ditemukan pada regulasi aktif');
      }
      await this.validateUniqueFields(body, undefined, client);

      const result = await client.query<OpsiCkType>(
        `INSERT INTO opsi_ck_ref
          (checklist_ck_id, label, description, value, urut)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [body.checklist_ck_id, body.label, body.description, body.value, body.urut]
      );
      return result.rows[0];
    });
  }

  async edit(body: UpdateOpsiCkInput, peraturan: number): Promise<OpsiCkType> {
    return withTransaction(async (client) => {
      await client.query(
        'LOCK TABLE komponen_ck_ref, checklist_ck_ref, opsi_ck_ref IN SHARE ROW EXCLUSIVE MODE'
      );

      if (!(await this.getById(body.id, peraturan, client))) {
        throw new ErrorDetail(404, 'Opsi CK tidak ditemukan');
      }
      if (!(await checklistCk.getById(body.checklist_ck_id, peraturan, client))) {
        throw new ErrorDetail(404, 'Checklist CK tujuan tidak ditemukan pada regulasi aktif');
      }
      await this.validateUniqueFields(body, body.id, client);

      const result = await client.query<OpsiCkType>(
        `UPDATE opsi_ck_ref
            SET checklist_ck_id = $1,
                label = $2,
                description = $3,
                value = $4,
                urut = $5,
                updated_at = CURRENT_TIMESTAMP
          WHERE id = $6
            AND deleted IS NULL
          RETURNING *`,
        [
          body.checklist_ck_id,
          body.label,
          body.description,
          body.value,
          body.urut,
          body.id,
        ]
      );
      return result.rows[0];
    });
  }

  async delete(id: number, peraturan: number): Promise<OpsiCkType> {
    return withTransaction(async (client) => {
      await client.query(
        'LOCK TABLE komponen_ck_ref, checklist_ck_ref, opsi_ck_ref IN SHARE ROW EXCLUSIVE MODE'
      );

      if (!(await this.getById(id, peraturan, client))) {
        throw new ErrorDetail(404, 'Opsi CK tidak ditemukan');
      }

      const result = await client.query<OpsiCkType>(
        `UPDATE opsi_ck_ref
            SET deleted = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
            AND deleted IS NULL
          RETURNING *`,
        [id]
      );
      return result.rows[0];
    });
  }
}

const komponenCk = new KomponenCk();
const checklistCk = new ChecklistCk();
const opsiCk = new OpsiCk();

export { komponenCk, checklistCk, opsiCk };
