-- Allow deleting a period that has a worksheet reference snapshot.
-- The snapshot belongs to the period and must not remain orphaned.
-- This migration intentionally does not alter worksheet/junction constraints.

BEGIN;

DO $$
DECLARE
  period_id_attnum SMALLINT;
  candidate RECORD;
BEGIN
  SELECT attnum
    INTO period_id_attnum
    FROM pg_attribute
   WHERE attrelid = 'public.worksheet_reference_snapshot'::regclass
     AND attname = 'period_id'
     AND NOT attisdropped;

  IF period_id_attnum IS NULL THEN
    RAISE EXCEPTION 'worksheet_reference_snapshot.period_id was not found';
  END IF;

  -- Drop only foreign keys from snapshot.period_id to period_ref.id.
  FOR candidate IN
    SELECT c.conname
      FROM pg_constraint c
     WHERE c.contype = 'f'
       AND c.conrelid = 'public.worksheet_reference_snapshot'::regclass
       AND c.confrelid = 'public.period_ref'::regclass
       AND c.conkey = ARRAY[period_id_attnum]::SMALLINT[]
  LOOP
    EXECUTE format(
      'ALTER TABLE public.worksheet_reference_snapshot DROP CONSTRAINT %I',
      candidate.conname
    );
  END LOOP;

  ALTER TABLE public.worksheet_reference_snapshot
    ADD CONSTRAINT worksheet_reference_snapshot_period_id_fkey
    FOREIGN KEY (period_id)
    REFERENCES public.period_ref(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;
END $$;

COMMIT;
