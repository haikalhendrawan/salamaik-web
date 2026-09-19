-- Menghapus constraint relasi antara excluded dan score pada worksheet CK.
-- Konsistensi N/A ditangani oleh service backend agar tabel tetap loose.

BEGIN;

ALTER TABLE worksheet_ck_junction
  DROP CONSTRAINT IF EXISTS worksheet_ck_junction_excluded_score_ck;

COMMIT;
