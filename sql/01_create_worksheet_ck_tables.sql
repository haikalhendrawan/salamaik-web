-- Struktur data Kertas Kerja Capaian Kinerja (CK)
-- PostgreSQL
--
-- Keputusan desain:
--   1. CK menggunakan worksheet_ref sebagai master worksheet/periode.
--   2. Hierarki referensi hanya Komponen -> Checklist.
--   3. Status N/A menggunakan satu kolom excluded untuk KPPN dan Kanwil.
--   4. Bukti dukung disimpan langsung pada junction melalui file_1 dan link_file.
--   5. Nilai konversi dan nilai akhir dihitung oleh server, tidak disimpan.

BEGIN;

CREATE TABLE IF NOT EXISTS komponen_ck_ref (
  id          SERIAL PRIMARY KEY,
  peraturan  INTEGER NOT NULL,
  urut        TEXT NOT NULL,
  title       TEXT NOT NULL,
  alias       TEXT,
  detail      TEXT,
  deleted     TIMESTAMP WITHOUT TIME ZONE,
  created_at  TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT komponen_ck_ref_peraturan_fk
    FOREIGN KEY (peraturan)
    REFERENCES peraturan_ref (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT komponen_ck_ref_urut_not_blank_ck
    CHECK (BTRIM(urut) <> ''),

  CONSTRAINT komponen_ck_ref_title_not_blank_ck
    CHECK (BTRIM(title) <> '')
);

CREATE TABLE IF NOT EXISTS checklist_ck_ref (
  id                   SERIAL PRIMARY KEY,
  komponen_ck_id       INTEGER NOT NULL,
  urut                 INTEGER NOT NULL,
  materi               TEXT NOT NULL,
  kriteria_penilaian   TEXT NOT NULL,
  bukti_dukung         TEXT,
  deleted              TIMESTAMP WITHOUT TIME ZONE,
  created_at           TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT checklist_ck_ref_komponen_fk
    FOREIGN KEY (komponen_ck_id)
    REFERENCES komponen_ck_ref (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT checklist_ck_ref_urut_positive_ck
    CHECK (urut > 0),

  CONSTRAINT checklist_ck_ref_materi_not_blank_ck
    CHECK (BTRIM(materi) <> ''),

  CONSTRAINT checklist_ck_ref_kriteria_not_blank_ck
    CHECK (BTRIM(kriteria_penilaian) <> '')
);

CREATE TABLE IF NOT EXISTS opsi_ck_ref (
  id                SERIAL PRIMARY KEY,
  checklist_ck_id   INTEGER NOT NULL,
  label             TEXT NOT NULL,
  description       TEXT,
  value             SMALLINT NOT NULL,
  urut              SMALLINT NOT NULL,
  deleted           TIMESTAMP WITHOUT TIME ZONE,
  created_at        TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT opsi_ck_ref_checklist_fk
    FOREIGN KEY (checklist_ck_id)
    REFERENCES checklist_ck_ref (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT opsi_ck_ref_value_ck
    CHECK (value IN (0, 5, 10)),

  CONSTRAINT opsi_ck_ref_urut_positive_ck
    CHECK (urut > 0),

  CONSTRAINT opsi_ck_ref_label_not_blank_ck
    CHECK (BTRIM(label) <> '')
);

CREATE TABLE IF NOT EXISTS worksheet_ck_junction (
  junction_id      SERIAL PRIMARY KEY,
  worksheet_id     UUID NOT NULL,
  checklist_ck_id  INTEGER NOT NULL,
  kppn_score       SMALLINT,
  kanwil_score     SMALLINT,
  excluded         SMALLINT NOT NULL DEFAULT 0,
  file_1           TEXT,
  link_file        TEXT,
  kppn_note        TEXT,
  kanwil_note      TEXT,
  last_update      TIMESTAMP WITH TIME ZONE,
  updated_by       TEXT,
  created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT worksheet_ck_junction_worksheet_fk
    FOREIGN KEY (worksheet_id)
    REFERENCES worksheet_ref (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT worksheet_ck_junction_checklist_fk
    FOREIGN KEY (checklist_ck_id)
    REFERENCES checklist_ck_ref (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT worksheet_ck_junction_worksheet_checklist_uq
    UNIQUE (worksheet_id, checklist_ck_id),

  CONSTRAINT worksheet_ck_junction_kppn_score_ck
    CHECK (kppn_score IS NULL OR kppn_score IN (0, 5, 10)),

  CONSTRAINT worksheet_ck_junction_kanwil_score_ck
    CHECK (kanwil_score IS NULL OR kanwil_score IN (0, 5, 10)),

  CONSTRAINT worksheet_ck_junction_excluded_ck
    CHECK (excluded IN (0, 1))
);

-- comment_data saat ini menggunakan FK nullable yang berbeda untuk setiap jenis
-- worksheet. Kolom CK mengikuti pola tersebut agar fitur komentar lama tetap
-- kompatibel.
ALTER TABLE comment_data
  ADD COLUMN IF NOT EXISTS ws_ck_junction_id INTEGER;

COMMIT;
