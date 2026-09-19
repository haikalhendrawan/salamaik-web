BEGIN;

ALTER TABLE worksheet_ck_junction
  ADD COLUMN IF NOT EXISTS kanwil_note TEXT;

ALTER TABLE worksheet_spml_junction
  ADD COLUMN IF NOT EXISTS kanwil_note TEXT;

COMMIT;
