BEGIN;

CREATE TABLE IF NOT EXISTS matrix_data_peraturan_2 (
  id SERIAL PRIMARY KEY,
  worksheet_id TEXT NOT NULL,
  worksheet_type TEXT NOT NULL CHECK (worksheet_type IN ('PB', 'CK', 'SPML')),
  ws_junction_id INTEGER,
  ws_ck_junction_id INTEGER,
  ws_spml_junction_id INTEGER,
  checklist_id INTEGER,
  checklist_ck_id INTEGER,
  checklist_spml_id INTEGER,
  hasil_implementasi TEXT,
  permasalahan TEXT,
  rekomendasi TEXT,
  peraturan TEXT,
  uic TEXT,
  tindak_lanjut TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT matrix_peraturan_2_source_ck CHECK (
    (worksheet_type = 'PB' AND ws_junction_id IS NOT NULL AND checklist_id IS NOT NULL
      AND ws_ck_junction_id IS NULL AND ws_spml_junction_id IS NULL)
    OR (worksheet_type = 'CK' AND ws_ck_junction_id IS NOT NULL AND checklist_ck_id IS NOT NULL
      AND ws_junction_id IS NULL AND ws_spml_junction_id IS NULL)
    OR (worksheet_type = 'SPML' AND ws_spml_junction_id IS NOT NULL AND checklist_spml_id IS NOT NULL
      AND ws_junction_id IS NULL AND ws_ck_junction_id IS NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS matrix_per2_pb_junction_uidx
  ON matrix_data_peraturan_2 (ws_junction_id) WHERE ws_junction_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS matrix_per2_ck_junction_uidx
  ON matrix_data_peraturan_2 (ws_ck_junction_id) WHERE ws_ck_junction_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS matrix_per2_spml_junction_uidx
  ON matrix_data_peraturan_2 (ws_spml_junction_id) WHERE ws_spml_junction_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS matrix_per2_worksheet_idx
  ON matrix_data_peraturan_2 (worksheet_id, worksheet_type);

ALTER TABLE findings_data
  ADD COLUMN IF NOT EXISTS matrix_peraturan_2_id INTEGER
    REFERENCES matrix_data_peraturan_2(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS findings_data_matrix_per2_idx
  ON findings_data (matrix_peraturan_2_id) WHERE matrix_peraturan_2_id IS NOT NULL;

-- Backfill already-posted Peraturan 2 findings as editable matrix snapshots.
INSERT INTO matrix_data_peraturan_2
  (worksheet_id, worksheet_type, ws_junction_id, checklist_id, hasil_implementasi,
   permasalahan, rekomendasi, peraturan, uic, tindak_lanjut)
SELECT worksheet_id::text, 'PB', ws_junction_id, checklist_id, finding_title,
       finding_description, rekomendasi_snapshot, peraturan_snapshot, uic_snapshot, NULL
  FROM findings_data
 WHERE worksheet_type = 'PB' AND ws_junction_id IS NOT NULL AND matrix_id IS NULL
ON CONFLICT (ws_junction_id) WHERE ws_junction_id IS NOT NULL DO NOTHING;

INSERT INTO matrix_data_peraturan_2
  (worksheet_id, worksheet_type, ws_ck_junction_id, checklist_ck_id, hasil_implementasi,
   permasalahan, rekomendasi, peraturan, uic, tindak_lanjut)
SELECT worksheet_id::text, 'CK', ws_ck_junction_id, checklist_ck_id, finding_title,
       finding_description, rekomendasi_snapshot, peraturan_snapshot, uic_snapshot, NULL
  FROM findings_data
 WHERE worksheet_type = 'CK' AND ws_ck_junction_id IS NOT NULL
ON CONFLICT (ws_ck_junction_id) WHERE ws_ck_junction_id IS NOT NULL DO NOTHING;

INSERT INTO matrix_data_peraturan_2
  (worksheet_id, worksheet_type, ws_spml_junction_id, checklist_spml_id, hasil_implementasi,
   permasalahan, rekomendasi, peraturan, uic, tindak_lanjut)
SELECT worksheet_id::text, 'SPML', ws_spml_junction_id, checklist_spml_id, finding_title,
       finding_description, rekomendasi_snapshot, peraturan_snapshot, uic_snapshot, NULL
  FROM findings_data
 WHERE worksheet_type = 'SPML' AND ws_spml_junction_id IS NOT NULL
ON CONFLICT (ws_spml_junction_id) WHERE ws_spml_junction_id IS NOT NULL DO NOTHING;

UPDATE findings_data f SET matrix_peraturan_2_id = m.id
  FROM matrix_data_peraturan_2 m
 WHERE f.worksheet_id::text = m.worksheet_id AND f.worksheet_type = m.worksheet_type
   AND ((f.worksheet_type = 'PB' AND f.ws_junction_id = m.ws_junction_id)
     OR (f.worksheet_type = 'CK' AND f.ws_ck_junction_id = m.ws_ck_junction_id)
     OR (f.worksheet_type = 'SPML' AND f.ws_spml_junction_id = m.ws_spml_junction_id));

COMMIT;
