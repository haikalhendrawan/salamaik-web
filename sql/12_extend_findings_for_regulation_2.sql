BEGIN;

-- Keep the existing Peraturan 1 columns usable, but allow findings sourced
-- from CK/SPML which do not have a PB matrix_data row.
ALTER TABLE findings_data
  ALTER COLUMN ws_junction_id DROP NOT NULL,
  ALTER COLUMN checklist_id DROP NOT NULL,
  ALTER COLUMN matrix_id DROP NOT NULL;

ALTER TABLE findings_data
  ADD COLUMN IF NOT EXISTS worksheet_type TEXT NOT NULL DEFAULT 'PB',
  ADD COLUMN IF NOT EXISTS ws_ck_junction_id INTEGER,
  ADD COLUMN IF NOT EXISTS ws_spml_junction_id INTEGER,
  ADD COLUMN IF NOT EXISTS checklist_ck_id INTEGER,
  ADD COLUMN IF NOT EXISTS checklist_spml_id INTEGER,
  ADD COLUMN IF NOT EXISTS initial_kppn_score NUMERIC,
  ADD COLUMN IF NOT EXISTS follow_up_kppn_score NUMERIC,
  ADD COLUMN IF NOT EXISTS follow_up_file TEXT,
  ADD COLUMN IF NOT EXISTS follow_up_link_file TEXT,
  ADD COLUMN IF NOT EXISTS finding_title TEXT,
  ADD COLUMN IF NOT EXISTS finding_description TEXT,
  ADD COLUMN IF NOT EXISTS rekomendasi_snapshot TEXT,
  ADD COLUMN IF NOT EXISTS peraturan_snapshot TEXT,
  ADD COLUMN IF NOT EXISTS uic_snapshot TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS findings_data_ws_ck_junction_uidx
  ON findings_data (ws_ck_junction_id)
  WHERE ws_ck_junction_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS findings_data_ws_spml_junction_uidx
  ON findings_data (ws_spml_junction_id)
  WHERE ws_spml_junction_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS findings_data_per2_pb_junction_uidx
  ON findings_data (ws_junction_id)
  WHERE ws_junction_id IS NOT NULL
    AND matrix_id IS NULL
    AND worksheet_type = 'PB';

CREATE INDEX IF NOT EXISTS findings_data_worksheet_type_idx
  ON findings_data (worksheet_id, worksheet_type);

COMMIT;
