-- Metadata matriks dinamis untuk kertas kerja CK dan SPML (PER-2).
BEGIN;

ALTER TABLE opsi_ck_ref
  ADD COLUMN IF NOT EXISTS positive_fallback TEXT,
  ADD COLUMN IF NOT EXISTS negative_fallback TEXT,
  ADD COLUMN IF NOT EXISTS rekomendasi TEXT;

ALTER TABLE checklist_ck_ref
  ADD COLUMN IF NOT EXISTS peraturan TEXT,
  ADD COLUMN IF NOT EXISTS uic TEXT;

ALTER TABLE checklist_spml_ref
  ADD COLUMN IF NOT EXISTS positive_fallback TEXT,
  ADD COLUMN IF NOT EXISTS negative_fallback TEXT,
  ADD COLUMN IF NOT EXISTS rekomendasi TEXT,
  ADD COLUMN IF NOT EXISTS peraturan TEXT,
  ADD COLUMN IF NOT EXISTS uic TEXT;

CREATE INDEX IF NOT EXISTS worksheet_junction_follow_up_idx
  ON worksheet_junction (worksheet_id, excluded, kanwil_score);
CREATE INDEX IF NOT EXISTS worksheet_ck_junction_follow_up_idx
  ON worksheet_ck_junction (worksheet_id, excluded, kanwil_score);
CREATE INDEX IF NOT EXISTS worksheet_spml_junction_follow_up_idx
  ON worksheet_spml_junction (worksheet_id, excluded, kanwil_score);

COMMIT;
