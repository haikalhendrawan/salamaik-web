-- Mengubah primary key worksheet CK dari BIGSERIAL (BIGINT) menjadi
-- SERIAL (INTEGER) pada database yang sudah dimigrasikan.

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM worksheet_ck_junction
     WHERE junction_id > 2147483647
        OR junction_id < 1
  ) THEN
    RAISE EXCEPTION
      'worksheet_ck_junction.junction_id berada di luar rentang INTEGER';
  END IF;

  IF EXISTS (
    SELECT 1
      FROM comment_data
     WHERE ws_ck_junction_id > 2147483647
        OR ws_ck_junction_id < 1
  ) THEN
    RAISE EXCEPTION
      'comment_data.ws_ck_junction_id berada di luar rentang INTEGER';
  END IF;
END
$$;

-- Simpan definisi foreign key yang mengarah ke worksheet_ck_junction agar
-- migration tetap bekerja walaupun nama constraint berbeda antar database.
CREATE TEMP TABLE ck_junction_foreign_keys_backup (
  table_schema TEXT NOT NULL,
  table_name TEXT NOT NULL,
  constraint_name TEXT NOT NULL,
  constraint_definition TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO ck_junction_foreign_keys_backup (
  table_schema,
  table_name,
  constraint_name,
  constraint_definition
)
SELECT namespace.nspname,
       relation.relname,
       constraint_data.conname,
       pg_get_constraintdef(constraint_data.oid)
  FROM pg_constraint AS constraint_data
  INNER JOIN pg_class AS relation
    ON relation.oid = constraint_data.conrelid
  INNER JOIN pg_namespace AS namespace
    ON namespace.oid = relation.relnamespace
 WHERE constraint_data.contype = 'f'
   AND constraint_data.confrelid = 'worksheet_ck_junction'::regclass;

DO $$
DECLARE
  foreign_key RECORD;
BEGIN
  FOR foreign_key IN
    SELECT * FROM ck_junction_foreign_keys_backup
  LOOP
    EXECUTE format(
      'ALTER TABLE %I.%I DROP CONSTRAINT %I',
      foreign_key.table_schema,
      foreign_key.table_name,
      foreign_key.constraint_name
    );
  END LOOP;
END
$$;

ALTER TABLE worksheet_ck_junction
  ALTER COLUMN junction_id TYPE INTEGER
  USING junction_id::INTEGER;

ALTER TABLE comment_data
  ALTER COLUMN ws_ck_junction_id TYPE INTEGER
  USING ws_ck_junction_id::INTEGER;

DO $$
DECLARE
  sequence_name TEXT;
  maximum_id INTEGER;
BEGIN
  sequence_name := pg_get_serial_sequence(
    'worksheet_ck_junction',
    'junction_id'
  );

  IF sequence_name IS NULL THEN
    RAISE EXCEPTION
      'Sequence untuk worksheet_ck_junction.junction_id tidak ditemukan';
  END IF;

  EXECUTE format(
    'ALTER SEQUENCE %s AS INTEGER MINVALUE 1 MAXVALUE 2147483647 NO CYCLE',
    sequence_name
  );

  SELECT COALESCE(MAX(junction_id), 0)
    INTO maximum_id
    FROM worksheet_ck_junction;

  IF maximum_id = 0 THEN
    PERFORM setval(sequence_name::regclass, 1, FALSE);
  ELSE
    PERFORM setval(sequence_name::regclass, maximum_id, TRUE);
  END IF;
END
$$;

DO $$
DECLARE
  foreign_key RECORD;
BEGIN
  FOR foreign_key IN
    SELECT * FROM ck_junction_foreign_keys_backup
  LOOP
    EXECUTE format(
      'ALTER TABLE %I.%I ADD CONSTRAINT %I %s',
      foreign_key.table_schema,
      foreign_key.table_name,
      foreign_key.constraint_name,
      foreign_key.constraint_definition
    );
  END LOOP;
END
$$;

COMMIT;
