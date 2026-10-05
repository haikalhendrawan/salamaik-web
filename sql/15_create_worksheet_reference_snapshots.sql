-- Snapshot historis referensi PB/CK/SPML per periode.
-- Periode yang sudah memiliki worksheet dibackfill dengan ketentuan:
-- period_id <= 16 => Peraturan 1; period_id > 16 => Peraturan 2.
-- Migration ini menyalin referensi aktif. Jalankan setelah memverifikasi bahwa
-- referensi Peraturan 1 dan 2 memang tidak pernah berubah untuk periode lama.

BEGIN;

CREATE TABLE IF NOT EXISTS worksheet_reference_snapshot (
  id BIGSERIAL PRIMARY KEY,
  period_id INTEGER NOT NULL UNIQUE REFERENCES period_ref(id) ON UPDATE CASCADE ON DELETE CASCADE,
  regulation_id INTEGER NOT NULL REFERENCES peraturan_ref(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  formula_version TEXT NOT NULL,
  reference_version TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('SNAPSHOTTED', 'MIGRATED_VERIFIED')),
  source TEXT NOT NULL CHECK (source IN ('ASSIGNMENT', 'MIGRATION')),
  reference_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,
  verification_note TEXT,
  CONSTRAINT worksheet_reference_snapshot_regulation_ck CHECK (regulation_id IN (1, 2))
);

CREATE INDEX IF NOT EXISTS worksheet_reference_snapshot_regulation_idx
  ON worksheet_reference_snapshot(regulation_id);

-- Fail closed if the known period-to-regulation mapping conflicts with actual
-- assignment topology. Peraturan 1 must not contain CK/SPML assignments;
-- Peraturan 2 requires both types for each assigned worksheet.
DO $$
DECLARE
  conflict_period INTEGER;
BEGIN
  SELECT p.id INTO conflict_period
  FROM period_ref p
  WHERE EXISTS (SELECT 1 FROM worksheet_ref w WHERE w.period = p.id)
    AND (
      EXISTS (
        SELECT 1 FROM worksheet_ref w
        WHERE w.period = p.id AND w.status = 1
          AND NOT EXISTS (SELECT 1 FROM worksheet_junction j WHERE j.worksheet_id = w.id)
      )
      OR
      (p.id <= 16 AND (
        EXISTS (
          SELECT 1 FROM worksheet_ref w
          JOIN worksheet_ck_junction j ON j.worksheet_id = w.id
          WHERE w.period = p.id AND w.status = 1
        ) OR EXISTS (
          SELECT 1 FROM worksheet_ref w
          JOIN worksheet_spml_junction j ON j.worksheet_id = w.id
          WHERE w.period = p.id AND w.status = 1
        )
      ))
      OR
      (p.id > 16 AND EXISTS (
        SELECT 1 FROM worksheet_ref w
        WHERE w.period = p.id AND w.status = 1
          AND (
            NOT EXISTS (SELECT 1 FROM worksheet_ck_junction j WHERE j.worksheet_id = w.id)
            OR NOT EXISTS (SELECT 1 FROM worksheet_spml_junction j WHERE j.worksheet_id = w.id)
          )
      ))
    )
  ORDER BY p.id
  LIMIT 1;

  IF conflict_period IS NOT NULL THEN
    RAISE EXCEPTION 'Worksheet assignments for period % conflict with the configured regulation mapping; resolve the period before applying reference snapshots', conflict_period;
  END IF;
END $$;

INSERT INTO worksheet_reference_snapshot (
  period_id, regulation_id, formula_version, reference_version, status,
  source, reference_data, verification_note
)
SELECT
  p.id,
  CASE WHEN p.id <= 16 THEN 1 ELSE 2 END,
  CASE WHEN p.id <= 16 THEN 'PER1_V1' ELSE 'PER2_V1' END,
  'MIGRATED-PERIOD-' || p.id || '-R' || CASE WHEN p.id <= 16 THEN '1' ELSE '2' END,
  'MIGRATED_VERIFIED',
  'MIGRATION',
  jsonb_build_object(
    'pb', jsonb_build_object(
      -- Include soft-deleted rows too: historical junctions may still reference them.
      -- Junction rows determine which checklist is actually shown for a worksheet.
      'komponen', COALESCE((SELECT jsonb_agg(to_jsonb(k) ORDER BY k.id) FROM komponen_ref k WHERE k.peraturan = CASE WHEN p.id <= 16 THEN 1 ELSE 2 END), '[]'::jsonb),
      'subkomponen', COALESCE((SELECT jsonb_agg(to_jsonb(s) ORDER BY s.id) FROM subkomponen_ref s JOIN komponen_ref k ON k.id = s.komponen_id WHERE k.peraturan = CASE WHEN p.id <= 16 THEN 1 ELSE 2 END), '[]'::jsonb),
      'subsubkomponen', COALESCE((SELECT jsonb_agg(to_jsonb(ss) ORDER BY ss.id) FROM subsubkomponen_ref ss JOIN komponen_ref k ON k.id = ss.komponen_id WHERE k.peraturan = CASE WHEN p.id <= 16 THEN 1 ELSE 2 END), '[]'::jsonb),
      'checklist', COALESCE((SELECT jsonb_agg(to_jsonb(c) ORDER BY c.id) FROM checklist_ref c JOIN komponen_ref k ON k.id = c.komponen_id WHERE k.peraturan = CASE WHEN p.id <= 16 THEN 1 ELSE 2 END), '[]'::jsonb),
      'opsi', COALESCE((SELECT jsonb_agg(to_jsonb(o) ORDER BY o.checklist_id, o.value DESC, o.id) FROM opsi_ref o JOIN checklist_ref c ON c.id = o.checklist_id JOIN komponen_ref k ON k.id = c.komponen_id WHERE k.peraturan = CASE WHEN p.id <= 16 THEN 1 ELSE 2 END), '[]'::jsonb)
    ),
    'ck', CASE WHEN p.id > 16 THEN jsonb_build_object(
      'komponen', COALESCE((SELECT jsonb_agg(to_jsonb(k) ORDER BY k.id) FROM komponen_ck_ref k WHERE k.peraturan = 2), '[]'::jsonb),
      'checklist', COALESCE((SELECT jsonb_agg(to_jsonb(c) ORDER BY c.id) FROM checklist_ck_ref c JOIN komponen_ck_ref k ON k.id = c.komponen_ck_id WHERE k.peraturan = 2), '[]'::jsonb),
      'opsi', COALESCE((SELECT jsonb_agg(to_jsonb(o) ORDER BY o.checklist_ck_id, o.value DESC, o.id) FROM opsi_ck_ref o JOIN checklist_ck_ref c ON c.id = o.checklist_ck_id JOIN komponen_ck_ref k ON k.id = c.komponen_ck_id WHERE k.peraturan = 2), '[]'::jsonb)
    ) ELSE NULL END,
    'spml', CASE WHEN p.id > 16 THEN jsonb_build_object(
      'komponen', COALESCE((SELECT jsonb_agg(to_jsonb(k) ORDER BY k.id) FROM komponen_spml_ref k WHERE k.peraturan = 2), '[]'::jsonb),
      'subkomponen', COALESCE((SELECT jsonb_agg(to_jsonb(s) ORDER BY s.id) FROM subkomponen_spml_ref s JOIN komponen_spml_ref k ON k.id = s.komponen_spml_id WHERE k.peraturan = 2), '[]'::jsonb),
      'aspek', COALESCE((SELECT jsonb_agg(to_jsonb(a) ORDER BY a.id) FROM aspek_spml_ref a JOIN komponen_spml_ref k ON k.id = a.komponen_spml_id WHERE k.peraturan = 2), '[]'::jsonb),
      'checklist', COALESCE((SELECT jsonb_agg(to_jsonb(c) ORDER BY c.id) FROM checklist_spml_ref c JOIN komponen_spml_ref k ON k.id = c.komponen_spml_id WHERE k.peraturan = 2), '[]'::jsonb)
    ) ELSE NULL END
  ),
  'Backfilled from stable Peraturan 1/2 references using period_id <= 16 => 1 and > 16 => 2.'
FROM period_ref p
WHERE EXISTS (SELECT 1 FROM worksheet_ref w WHERE w.period = p.id)
ON CONFLICT (period_id) DO NOTHING;

COMMIT;
