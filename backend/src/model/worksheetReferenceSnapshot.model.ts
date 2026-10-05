import { PoolClient } from 'pg';
import pool from '../config/db';
import ErrorDetail from './error.model';

export type WorksheetRegulation = 1 | 2;

export interface WorksheetReferenceData {
  pb: {
    komponen: Record<string, unknown>[];
    subkomponen: Record<string, unknown>[];
    subsubkomponen: Record<string, unknown>[];
    checklist: Record<string, unknown>[];
    opsi: Record<string, unknown>[];
  };
  ck: {
    komponen: Record<string, unknown>[];
    checklist: Record<string, unknown>[];
    opsi: Record<string, unknown>[];
  } | null;
  spml: {
    komponen: Record<string, unknown>[];
    subkomponen: Record<string, unknown>[];
    aspek: Record<string, unknown>[];
    checklist: Record<string, unknown>[];
  } | null;
}

export interface WorksheetReferenceSnapshot {
  id: string;
  period_id: number;
  regulation_id: WorksheetRegulation;
  formula_version: string;
  reference_version: string;
  status: 'SNAPSHOTTED' | 'MIGRATED_VERIFIED';
  source: 'ASSIGNMENT' | 'MIGRATION';
  reference_data: WorksheetReferenceData;
  created_at: string;
  created_by: string | null;
  verification_note: string | null;
}

type SnapshotJunctionRow = Record<string, any> & { checklist_id?: number; checklist_ck_id?: number; checklist_spml_id?: number };

export const hydratePBRowsFromSnapshot = <T extends SnapshotJunctionRow>(rows: T[], snapshot: WorksheetReferenceSnapshot) => {
  const data = snapshot.reference_data.pb;
  return rows.map((row) => {
    const checklist = data.checklist.find((item) => Number(item.id) === Number(row.checklist_id));
    if (!checklist) throw new ErrorDetail(409, `PB checklist ${row.checklist_id} missing from period snapshot`);
    return {
      ...row,
      ...checklist,
      id: checklist.id,
      checklist_id: row.checklist_id,
      opsi: data.opsi.filter((item) => Number(item.checklist_id) === Number(row.checklist_id)),
    };
  });
};

export const hydratePBMatrixRowsFromSnapshot = <T extends Record<string, any>>(rows: T[], snapshot: WorksheetReferenceSnapshot) => rows.map((row) => {
  const checklist = snapshot.reference_data.pb.checklist.find((item) => Number(item.id) === Number(row.checklist_id));
  if (!checklist) throw new ErrorDetail(409, `PB checklist ${row.checklist_id} missing from period snapshot`);
  const component = snapshot.reference_data.pb.komponen.find((item) => Number(item.id) === Number(checklist.komponen_id));
  const subcomponent = snapshot.reference_data.pb.subkomponen.find((item) => Number(item.id) === Number(checklist.subkomponen_id));
  return {
    ...row,
    ...checklist,
    checklist_id: row.checklist_id,
    checklist: [checklist],
    opsi: snapshot.reference_data.pb.opsi.filter((item) => Number(item.checklist_id) === Number(row.checklist_id)),
    komponen_string: component?.title || '',
    subkomponen_string: subcomponent?.title || '',
    standardisasi: checklist.standardisasi,
    standardisasi_id: checklist.standardisasi_id,
  };
});

export const hydrateCKRowsFromSnapshot = <T extends SnapshotJunctionRow>(rows: T[], snapshot: WorksheetReferenceSnapshot) => {
  if (!snapshot.reference_data.ck) throw new ErrorDetail(409, 'CK reference data missing from period snapshot');
  const data = snapshot.reference_data.ck;
  return rows.map((row) => {
    const checklist = data.checklist.find((item) => Number(item.id) === Number(row.checklist_ck_id));
    if (!checklist) throw new ErrorDetail(409, `CK checklist ${row.checklist_ck_id} missing from period snapshot`);
    const component = data.komponen.find((item) => Number(item.id) === Number(checklist.komponen_ck_id));
    if (!component) throw new ErrorDetail(409, `CK component for checklist ${row.checklist_ck_id} missing from period snapshot`);
    return {
      ...row,
      ...checklist,
      checklist_ck_id: row.checklist_ck_id,
      checklist_urut: checklist.urut,
      materi: checklist.materi,
      kriteria_penilaian: checklist.kriteria_penilaian,
      bukti_dukung: checklist.bukti_dukung,
      komponen_ck_id: checklist.komponen_ck_id,
      komponen_urut: component.urut,
      komponen_title: component.title,
      komponen_alias: component.alias,
      komponen_detail: component.detail,
      opsi: data.opsi.filter((item) => Number(item.checklist_ck_id) === Number(row.checklist_ck_id)),
    };
  });
};

export const hydrateSPMLRowsFromSnapshot = <T extends SnapshotJunctionRow>(rows: T[], snapshot: WorksheetReferenceSnapshot) => {
  if (!snapshot.reference_data.spml) throw new ErrorDetail(409, 'SPML reference data missing from period snapshot');
  const data = snapshot.reference_data.spml;
  return rows.map((row) => {
    const checklist = data.checklist.find((item) => Number(item.id) === Number(row.checklist_spml_id));
    if (!checklist) throw new ErrorDetail(409, `SPML checklist ${row.checklist_spml_id} missing from period snapshot`);
    return { ...row, ...checklist, checklist_spml_id: row.checklist_spml_id };
  });
};

class WorksheetReferenceSnapshotModel {
  async createForAssignment(
    client: PoolClient,
    periodId: number,
    regulationId: WorksheetRegulation,
    createdBy: string | null
  ): Promise<WorksheetReferenceSnapshot> {
    // Serialize first assignment requests per period; the unique key remains a
    // second line of defense and conflicting regulation choices fail closed.
    await client.query('SELECT pg_advisory_xact_lock($1, $2)', [156680, periodId]);
    const existing = await client.query<WorksheetReferenceSnapshot>(
      'SELECT * FROM worksheet_reference_snapshot WHERE period_id = $1 FOR UPDATE',
      [periodId]
    );

    if (existing.rows[0]) {
      if (Number(existing.rows[0].regulation_id) !== regulationId) {
        throw new ErrorDetail(409, `Period ${periodId} already uses regulation ${existing.rows[0].regulation_id}`);
      }
      return existing.rows[0];
    }

    const referenceData = await this.readActiveReferences(client, regulationId);
    if (referenceData.pb.checklist.length === 0) {
      throw new ErrorDetail(409, `No active PB checklist references found for regulation ${regulationId}`);
    }
    if (regulationId === 2 && (referenceData.ck?.checklist.length === 0 || referenceData.spml?.checklist.length === 0)) {
      throw new ErrorDetail(409, 'Peraturan 2 requires active CK and SPML checklist references');
    }

    const formulaVersion = regulationId === 1 ? 'PER1_V1' : 'PER2_V1';
    const referenceVersion = `PER-${regulationId}-PERIOD-${periodId}-V1`;
    const inserted = await client.query<WorksheetReferenceSnapshot>(
      `INSERT INTO worksheet_reference_snapshot
         (period_id, regulation_id, formula_version, reference_version, status, source, reference_data, created_by)
       VALUES ($1, $2, $3, $4, 'SNAPSHOTTED', 'ASSIGNMENT', $5::jsonb, $6)
       RETURNING *`,
      [periodId, regulationId, formulaVersion, referenceVersion, JSON.stringify(referenceData), createdBy]
    );
    return inserted.rows[0];
  }

  async getByWorksheetId(worksheetId: string): Promise<WorksheetReferenceSnapshot | undefined> {
    const result = await pool.query<WorksheetReferenceSnapshot>(
      `SELECT snapshot.*
       FROM worksheet_reference_snapshot snapshot
       INNER JOIN worksheet_ref worksheet ON worksheet.period = snapshot.period_id
       WHERE worksheet.id = $1`,
      [worksheetId]
    );
    return result.rows[0];
  }

  private async readActiveReferences(
    client: PoolClient,
    regulationId: WorksheetRegulation
  ): Promise<WorksheetReferenceData> {
    const [komponen, subkomponen, subsubkomponen, checklist, opsi] = await Promise.all([
      client.query('SELECT * FROM komponen_ref WHERE peraturan = $1 AND deleted IS NULL ORDER BY id', [regulationId]),
      client.query(`SELECT s.* FROM subkomponen_ref s JOIN komponen_ref k ON k.id = s.komponen_id
                    WHERE k.peraturan = $1 AND k.deleted IS NULL AND s.deleted IS NULL ORDER BY s.id`, [regulationId]),
      client.query(`SELECT s.* FROM subsubkomponen_ref s JOIN komponen_ref k ON k.id = s.komponen_id
                    WHERE k.peraturan = $1 AND k.deleted IS NULL AND s.deleted IS NULL ORDER BY s.id`, [regulationId]),
      client.query(`SELECT c.* FROM checklist_ref c JOIN komponen_ref k ON k.id = c.komponen_id
                    WHERE k.peraturan = $1 AND k.deleted IS NULL AND c.deleted IS NULL ORDER BY c.id`, [regulationId]),
      client.query(`SELECT o.* FROM opsi_ref o
                    JOIN checklist_ref c ON c.id = o.checklist_id
                    JOIN komponen_ref k ON k.id = c.komponen_id
                    WHERE k.peraturan = $1 AND k.deleted IS NULL AND c.deleted IS NULL AND o.deleted IS NULL
                    ORDER BY o.checklist_id, o.value DESC, o.id`, [regulationId]),
    ]);

    const pb = {
      komponen: komponen.rows,
      subkomponen: subkomponen.rows,
      subsubkomponen: subsubkomponen.rows,
      checklist: checklist.rows,
      opsi: opsi.rows,
    };

    if (regulationId === 1) return { pb, ck: null, spml: null };

    const [ckKomponen, ckChecklist, ckOpsi, spmlKomponen, spmlSubkomponen, spmlAspek, spmlChecklist] = await Promise.all([
      client.query('SELECT * FROM komponen_ck_ref WHERE peraturan = 2 AND deleted IS NULL ORDER BY id'),
      client.query(`SELECT c.* FROM checklist_ck_ref c JOIN komponen_ck_ref k ON k.id = c.komponen_ck_id
                    WHERE k.peraturan = 2 AND k.deleted IS NULL AND c.deleted IS NULL ORDER BY c.id`),
      client.query(`SELECT o.* FROM opsi_ck_ref o
                    JOIN checklist_ck_ref c ON c.id = o.checklist_ck_id
                    JOIN komponen_ck_ref k ON k.id = c.komponen_ck_id
                    WHERE k.peraturan = 2 AND k.deleted IS NULL AND c.deleted IS NULL AND o.deleted IS NULL
                    ORDER BY o.checklist_ck_id, o.value DESC, o.id`),
      client.query('SELECT * FROM komponen_spml_ref WHERE peraturan = 2 AND deleted IS NULL ORDER BY id'),
      client.query(`SELECT s.* FROM subkomponen_spml_ref s JOIN komponen_spml_ref k ON k.id = s.komponen_spml_id
                    WHERE k.peraturan = 2 AND k.deleted IS NULL AND s.deleted IS NULL ORDER BY s.id`),
      client.query(`SELECT a.* FROM aspek_spml_ref a JOIN komponen_spml_ref k ON k.id = a.komponen_spml_id
                    WHERE k.peraturan = 2 AND k.deleted IS NULL AND a.deleted IS NULL ORDER BY a.id`),
      client.query(`SELECT c.* FROM checklist_spml_ref c JOIN komponen_spml_ref k ON k.id = c.komponen_spml_id
                    WHERE k.peraturan = 2 AND k.deleted IS NULL AND c.deleted IS NULL ORDER BY c.id`),
    ]);

    return {
      pb,
      ck: { komponen: ckKomponen.rows, checklist: ckChecklist.rows, opsi: ckOpsi.rows },
      spml: {
        komponen: spmlKomponen.rows,
        subkomponen: spmlSubkomponen.rows,
        aspek: spmlAspek.rows,
        checklist: spmlChecklist.rows,
      },
    };
  }
}

const worksheetReferenceSnapshot = new WorksheetReferenceSnapshotModel();
export default worksheetReferenceSnapshot;
