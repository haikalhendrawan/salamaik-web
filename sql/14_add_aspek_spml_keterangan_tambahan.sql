BEGIN;

ALTER TABLE aspek_spml_ref
  ADD COLUMN IF NOT EXISTS keterangan_tambahan TEXT;

UPDATE aspek_spml_ref SET keterangan_tambahan = '*) jika salah satu tidak terpenuhi bernilai 0'
WHERE id IN (10, 81, 93, 94, 100);

COMMIT;
