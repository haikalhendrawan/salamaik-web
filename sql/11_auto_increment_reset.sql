-- Sinkronisasi sequence kolom id agar nilai berikutnya dimulai setelah ID terbesar.
-- Jika tabel belum memiliki sequence yang terhubung ke kolom id (misalnya tabel
-- SPML yang dibuat dengan CREATE TABLE ... LIKE tanpa INCLUDING DEFAULTS),
-- script ini membuat dan menghubungkan sequence standar terlebih dahulu.

BEGIN;

DO $$
DECLARE
  table_name TEXT;
  sequence_name TEXT;
  max_id BIGINT;
  table_names TEXT[] := ARRAY[
    'komponen_ref',
    'subkomponen_ref',
    'subsubkomponen_ref',
    'opsi_ref',
    'checklist_ref',
    'komponen_spml_ref',
    'subkomponen_spml_ref',
    'aspek_spml_ref',
    'checklist_spml_ref',
    'komponen_ck_ref',
    'checklist_ck_ref',
    'opsi_ck_ref'
  ];
BEGIN
  FOREACH table_name IN ARRAY table_names LOOP
    IF to_regclass(format('%I.%I', current_schema(), table_name)) IS NULL THEN
      RAISE EXCEPTION 'Tabel %.% tidak ditemukan', current_schema(), table_name;
    END IF;

    sequence_name := pg_get_serial_sequence(
      format('%I.%I', current_schema(), table_name),
      'id'
    );

    -- Beberapa tabel SPML dibuat menggunakan LIKE tanpa menyalin DEFAULT serial.
    -- Pastikan kolom id tetap memiliki sequence sebelum melakukan setval.
    IF sequence_name IS NULL THEN
      sequence_name := format('%I.%I', current_schema(), table_name || '_id_seq');
      EXECUTE format('CREATE SEQUENCE IF NOT EXISTS %s', sequence_name);
      EXECUTE format(
        'ALTER SEQUENCE %s OWNED BY %I.%I.id',
        sequence_name,
        current_schema(),
        table_name
      );
      EXECUTE format(
        'ALTER TABLE %I.%I ALTER COLUMN id SET DEFAULT nextval(%L::regclass)',
        current_schema(),
        table_name,
        sequence_name
      );
    END IF;

    EXECUTE format(
      'SELECT COALESCE(MAX(id), 0) FROM %I.%I',
      current_schema(),
      table_name
    ) INTO max_id;

    IF max_id = 0 THEN
      -- Tabel kosong: nextval berikutnya menghasilkan 1.
      PERFORM setval(sequence_name::regclass, 1, FALSE);
    ELSE
      -- Tabel berisi data: nextval berikutnya menghasilkan max(id) + 1.
      PERFORM setval(sequence_name::regclass, max_id, TRUE);
    END IF;
  END LOOP;
END
$$;

COMMIT;
