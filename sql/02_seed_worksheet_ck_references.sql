-- Seed referensi awal Kertas Kerja Capaian Kinerja (CK)
-- Sumber: docs/kertas_kerja_ck.xlsx
--
-- Default peraturan_id mengikuti referensi regulasi baru yang saat ini dipakai
-- oleh SPML. Ubah v_peraturan_id jika ID pada database target berbeda.

BEGIN;

DO $seed$
DECLARE
  v_peraturan_id INTEGER := 2;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM peraturan_ref
    WHERE id = v_peraturan_id
      AND deleted IS NULL
  ) THEN
    RAISE EXCEPTION
      'Peraturan aktif dengan id % tidak ditemukan. Sesuaikan v_peraturan_id sebelum menjalankan seed CK.',
      v_peraturan_id;
  END IF;

  -- Migration tidak menetapkan unique constraint pada referensi. Lock ini
  -- mencegah dua proses seed bersamaan membuat row aktif yang sama.
  LOCK TABLE komponen_ck_ref, checklist_ck_ref, opsi_ck_ref
    IN SHARE ROW EXCLUSIVE MODE;

  WITH komponen_source (urut, title, alias, detail) AS (
    VALUES
      ('A', 'Perbendaharaan Negara yang efisien dan akuntabel', NULL::TEXT, NULL::TEXT),
      ('B', 'Dukungan manajemen yang efektif', NULL::TEXT, NULL::TEXT),
      ('C', 'Pelaksanaan anggaran yang optimal', NULL::TEXT, NULL::TEXT),
      ('D', 'Pengelolaan kas yang prudent, efektif dan efisien', NULL::TEXT, NULL::TEXT),
      ('E', 'Pertanggungjawaban keuangan negara yang akuntabel', NULL::TEXT, NULL::TEXT),
      ('F', 'Pengelolaan organisasi dan SDM yang adaptif serta pengendalian internal yang efektif', NULL::TEXT, NULL::TEXT),
      ('G', 'Pengelolaan keuangan yang akuntabel, BMN yang produktif serta teknologi dan informasi yang berkualitas', NULL::TEXT, NULL::TEXT)
  ),
  updated AS (
    UPDATE komponen_ck_ref AS target
    SET
      title = source.title,
      alias = source.alias,
      detail = source.detail,
      updated_at = CURRENT_TIMESTAMP
    FROM komponen_source AS source
    WHERE target.peraturan = v_peraturan_id
      AND target.urut = source.urut
      AND target.deleted IS NULL
    RETURNING target.id
  )
  INSERT INTO komponen_ck_ref (
    peraturan,
    urut,
    title,
    alias,
    detail
  )
  SELECT
    v_peraturan_id,
    source.urut,
    source.title,
    source.alias,
    source.detail
  FROM komponen_source AS source
  WHERE NOT EXISTS (
    SELECT 1
    FROM komponen_ck_ref AS target
    WHERE target.peraturan = v_peraturan_id
      AND target.urut = source.urut
      AND target.deleted IS NULL
  );

  WITH checklist_source (
    komponen_urut,
    urut,
    materi,
    bukti_dukung
  ) AS (
    VALUES
      (
        'A',
        1,
        'Indeks Kualitas Nilai IKPA K/L',
        'Laporan Capaian IKI Indeks Kualitas Nilai IKPA K/L Periode (Triwulanan/ Semesteran/ Tahunan) Tahun XXXX'
      ),
      (
        'A',
        2,
        'Indeks Kualitas LK Kuasa BUN KPPN',
        'Laporan Capaian IKI Indeks Kualitas LK Kuasa BUN KPPN Periode (Semesteran/ Triwulanan/ Tahunan) Tahun XXXX'
      ),
      (
        'B',
        3,
        'Indeks kepuasan terhadap layanan KPPN',
        'Laporan Capaian IKI Indeks kepuasan terhadap layanan KPPN Periode (Semesteran/ Triwulanan/ Tahunan) Tahun XXXX'
      ),
      (
        'B',
        4,
        'Tingkat implementasi penajaman tugas Financial Advisory',
        'Laporan Capaian IKI Tingkat implementasi penajaman tugas Financial Advisory Periode (Semesteran/ Triwulanan/ Tahunan) Tahun XXXX'
      ),
      (
        'C',
        5,
        'Indeks kinerja penyaluran Dana Transfer ke Daerah pada KPPN',
        'Laporan Capaian IKI Indeks kepuasan terhadap layanan KPPN Periode (Semesteran/ Triwulanan/ Tahunan) Tahun XXXX'
      ),
      (
        'C',
        6,
        'Indeks Digitalisasi Pengelolaan Keuangan',
        'Laporan Capaian IKI Tingkat implementasi penajaman tugas Financial Advisory Periode (Semesteran/ Triwulanan/ Tahunan) Tahun XXXX'
      ),
      (
        'D',
        7,
        'Persentase akurasi perencanaan kas',
        'Laporan Capaian IKI Persentase akurasi perencanaan kas Periode (Semesteran/ Triwulanan/ Tahunan) Tahun XXXX'
      ),
      (
        'D',
        8,
        'Indeks kualitas penyelesaian SP2D',
        'Laporan Capaian IKI Indeks kualitas penyelesaian SP2D Periode (Semesteran/ Triwulanan/ Tahunan) Tahun XXXX'
      ),
      (
        'E',
        9,
        'Indeks Kualitas LPJ Bendahara Satker K/L',
        E'Laporan Capaian IKI Indeks Kualitas LPJ Bendahara Satker K/L\nPeriode (Semesteran/ Triwulanan/ Tahunan) Tahun XXXX'
      ),
      (
        'F',
        10,
        'Tingkat kualitas pengelolaan kinerja organisasi',
        'Laporan Capaian IKI Tingkat kualitas pengelolaan kinerja organisasi Periode (Semesteran/ Triwulanan/ Tahunan) Tahun XXXX'
      ),
      (
        'F',
        11,
        'Nilai kualitas pengelolaan SDM',
        'Laporan Capaian IKI Nilai kualitas pengelolaan SDM Periode (Semesteran/ Triwulanan/ Tahunan) Tahun XXXX'
      ),
      (
        'F',
        12,
        'Nilai Evaluasi Pelaksanaan Tugas Kepatuhan Internal',
        'Laporan Capaian IKI Nilai Evaluasi Pelaksanaan Tugas Kepatuhan Internal Periode (Semesteran/ Triwulanan/ Tahunan) Tahun XXXX'
      ),
      (
        'G',
        13,
        'Indeks kualitas pengelolaan keuangan KPPN',
        'Laporan Capaian IKI Indeks kualitas pengelolaan keuangan KPPN Periode (Semesteran/ Triwulanan/ Tahunan) Tahun XXXX'
      ),
      (
        'G',
        14,
        'Persentase Kualitas Pengelolaan BMN dan Pengadaan',
        'Laporan Capaian IKI Persentase Kualitas Pengelolaan BMN dan Pengadaan Periode (Semesteran/ Triwulanan/ Tahunan) Tahun XXXX'
      ),
      (
        'G',
        15,
        'Nilai Kinerja TIK KPPN',
        'Laporan Capaian IKI Nilai Kinerja TIK KPPN'
      )
  ),
  resolved AS (
    SELECT
      komponen.id AS komponen_ck_id,
      source.urut,
      source.materi,
      'Berdasarkan capaian IKI ' || source.materi AS kriteria_penilaian,
      source.bukti_dukung
    FROM checklist_source AS source
    INNER JOIN komponen_ck_ref AS komponen
      ON komponen.peraturan = v_peraturan_id
     AND komponen.urut = source.komponen_urut
     AND komponen.deleted IS NULL
  ),
  updated AS (
    UPDATE checklist_ck_ref AS target
    SET
      materi = source.materi,
      kriteria_penilaian = source.kriteria_penilaian,
      bukti_dukung = source.bukti_dukung,
      updated_at = CURRENT_TIMESTAMP
    FROM resolved AS source
    WHERE target.komponen_ck_id = source.komponen_ck_id
      AND target.urut = source.urut
      AND target.deleted IS NULL
    RETURNING target.id
  )
  INSERT INTO checklist_ck_ref (
    komponen_ck_id,
    urut,
    materi,
    kriteria_penilaian,
    bukti_dukung
  )
  SELECT
    source.komponen_ck_id,
    source.urut,
    source.materi,
    source.kriteria_penilaian,
    source.bukti_dukung
  FROM resolved AS source
  WHERE NOT EXISTS (
    SELECT 1
    FROM checklist_ck_ref AS target
    WHERE target.komponen_ck_id = source.komponen_ck_id
      AND target.urut = source.urut
      AND target.deleted IS NULL
  );

  WITH opsi_source (label, description, value, urut) AS (
    VALUES
      ('Hijau', 'Capaian IKI berwarna hijau', 10::SMALLINT, 1::SMALLINT),
      ('Kuning', 'Capaian IKI berwarna kuning', 5::SMALLINT, 2::SMALLINT),
      ('Merah', 'Capaian IKI berwarna merah', 0::SMALLINT, 3::SMALLINT)
  ),
  resolved AS (
    SELECT
      checklist.id AS checklist_ck_id,
      opsi.label,
      opsi.description,
      opsi.value,
      opsi.urut
    FROM checklist_ck_ref AS checklist
    INNER JOIN komponen_ck_ref AS komponen
      ON komponen.id = checklist.komponen_ck_id
     AND komponen.peraturan = v_peraturan_id
     AND komponen.deleted IS NULL
    CROSS JOIN opsi_source AS opsi
    WHERE checklist.deleted IS NULL
  ),
  updated AS (
    UPDATE opsi_ck_ref AS target
    SET
      label = source.label,
      description = source.description,
      urut = source.urut,
      updated_at = CURRENT_TIMESTAMP
    FROM resolved AS source
    WHERE target.checklist_ck_id = source.checklist_ck_id
      AND target.value = source.value
      AND target.deleted IS NULL
    RETURNING target.id
  )
  INSERT INTO opsi_ck_ref (
    checklist_ck_id,
    label,
    description,
    value,
    urut
  )
  SELECT
    source.checklist_ck_id,
    source.label,
    source.description,
    source.value,
    source.urut
  FROM resolved AS source
  WHERE NOT EXISTS (
    SELECT 1
    FROM opsi_ck_ref AS target
    WHERE target.checklist_ck_id = source.checklist_ck_id
      AND target.value = source.value
      AND target.deleted IS NULL
  );

  IF (
    SELECT COUNT(*)
    FROM komponen_ck_ref
    WHERE peraturan = v_peraturan_id
      AND deleted IS NULL
  ) < 7 THEN
    RAISE EXCEPTION 'Seed CK gagal: jumlah komponen aktif kurang dari 7.';
  END IF;

  IF (
    SELECT COUNT(*)
    FROM checklist_ck_ref AS checklist
    INNER JOIN komponen_ck_ref AS komponen
      ON komponen.id = checklist.komponen_ck_id
    WHERE komponen.peraturan = v_peraturan_id
      AND komponen.deleted IS NULL
      AND checklist.deleted IS NULL
  ) < 15 THEN
    RAISE EXCEPTION 'Seed CK gagal: jumlah checklist aktif kurang dari 15.';
  END IF;
END
$seed$;

COMMIT;
