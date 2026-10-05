BEGIN;

DO $$
BEGIN
  CREATE TYPE kppn_tipe_enum AS ENUM ('A1', 'A2', 'Kh', 'K1', 'K2', 'K3');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE kppn_ref
  ADD COLUMN IF NOT EXISTS tipe kppn_tipe_enum,
  ADD COLUMN IF NOT EXISTS provinsi SMALLINT NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'kppn_ref_provinsi_check'
      AND conrelid = 'kppn_ref'::regclass
  ) THEN
    ALTER TABLE kppn_ref
      ADD CONSTRAINT kppn_ref_provinsi_check
      CHECK (provinsi IN (0, 1));
  END IF;
END
$$;

UPDATE kppn_ref SET provinsi = 1 WHERE id IN ('010', '03010');
UPDATE kppn_ref SET tipe = 'A1' WHERE id IN ('010', '011', '090');
UPDATE kppn_ref SET tipe = 'A2' WHERE id IN ('091', '077', '142');

COMMENT ON COLUMN kppn_ref.tipe IS
  'Tipe KPPN: A1, A2, Kh, K1, K2, atau K3';

COMMENT ON COLUMN kppn_ref.provinsi IS
  'Penanda provinsi dalam bentuk numerik: 0 = tidak, 1 = ya';

COMMIT;
