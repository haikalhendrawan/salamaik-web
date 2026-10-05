# Rencana: Snapshot Referensi dan Formula Historis Kertas Kerja

## Tujuan

Menjamin hasil penilaian pada setiap periode tetap dapat ditampilkan dan dihitung ulang berdasarkan referensi serta formula yang berlaku ketika periode tersebut dibuat/diinisialisasi. Penambahan, perubahan, atau penghapusan referensi untuk periode mendatang tidak boleh mengubah histori periode sebelumnya.

## Keputusan dan asumsi

1. Satu periode menggunakan tepat satu peraturan dan satu snapshot referensi untuk seluruh worksheet KPPN pada periode tersebut.
2. Referensi yang digunakan transaksi harus berasal dari snapshot periode, bukan tabel referensi aktif yang dapat berubah.
3. Formula saat ini terdiri dari Peraturan 1 dan Peraturan 2. Identitas formula tetap disimpan eksplisit agar kelak revisi formula tidak menimpa hasil historis.
4. Referensi aktif (`*_ref`) tetap menjadi sumber pengelolaan admin untuk periode baru. Snapshot periode yang sudah di-assign dikunci; perubahan referensi aktif tidak mengubah snapshot atau worksheet lama dan akan berlaku pada snapshot periode baru.
5. Worksheet dan nilai lama tidak dihapus untuk mengubah referensi. Referensi versi baru membuat snapshot untuk periode baru; histori periode lama tetap utuh.
6. Data historis dipetakan: `period_id <= 16` menggunakan Peraturan 1; `period_id > 16` menggunakan Peraturan 2. Migrasi menandai snapshot hasil backfill sebagai terverifikasi berdasarkan pernyataan bahwa referensi Peraturan 1 dan 2 belum berubah.
7. Periode historis masih perlu diverifikasi bahwa formula masing-masing peraturan tidak berubah sejak dipakai. Snapshot menyimpan formula version agar perubahan formula masa depan tidak mengubah periode lama.

## Model data yang direncanakan

### 1. Header snapshot tingkat periode

Buat entitas, misalnya `worksheet_reference_snapshot`, dengan satu baris per periode:

| Kolom | Kegunaan |
|---|---|
| `id` | ID snapshot yang stabil |
| `period_id` | FK ke periode, diberi UNIQUE agar hanya satu snapshot per periode |
| `regulation_id` | Peraturan yang berlaku (1 atau 2) |
| `formula_version` | Versi algoritma penilaian, misalnya `PER1_V1` atau `PER2_V1` |
| `reference_version` | Label/revisi snapshot yang mudah dibaca, misalnya `2026-P1-R1` |
| `status` | `SNAPSHOTTED` atau `MIGRATED_VERIFIED` |
| `created_at`, `created_by` | Audit pembentukan snapshot |
| `reference_data` | Paket definisi referensi PB/CK/SPML dalam JSONB immutable |

`period_id UNIQUE` menegakkan asumsi bahwa semua worksheet KPPN dalam periode yang sama memakai referensi dan formula yang sama. `worksheet_ref` dapat mengarah ke header ini, atau mendapatkannya melalui relasi periode; jangan menyimpan pilihan peraturan yang dapat berbeda per worksheet.

### 2. Snapshot payload JSONB yang immutable

Header menyimpan paket referensi periode dalam `reference_data JSONB`, dikelompokkan sebagai berikut:

- PB: `komponen`, `subkomponen`, `subsubkomponen`, `checklist`, dan `opsi`.
- CK: `komponen`, `checklist`, dan `opsi` (null untuk Peraturan 1).
- SPML: `komponen`, `subkomponen`, `aspek`, dan `checklist` (null untuk Peraturan 1).

Setiap entri mempertahankan ID referensi sumber serta seluruh field yang dibutuhkan UI, scoring, export, dan matriks. JSONB dipilih agar satu paket hierarki dapat disalin atomik tanpa merombak primary key/foreign key tabel transaksi. Payload ini menjadi sumber authoritative setelah assignment.

### 3. Hubungan dengan junction

Junction tetap menyimpan ID checklist sumber dan data transaksi (nilai, excluded, file/link, catatan, komentar). `worksheet_ref.period` menghubungkan junction ke satu snapshot periode; backend mencocokkan ID checklist sumber dengan item di payload tersebut. Opsi dicocokkan berdasarkan ID checklist dalam payload. Metadata referensi tidak diduplikasi pada setiap junction.

## Alur yang direncanakan

### Pembuatan/assignment periode baru

1. Admin memilih peraturan untuk periode. Jangan mengambilnya dari profil user sebagai satu-satunya sumber kebenaran.
2. Dalam transaksi database, backend memvalidasi periode belum memiliki assignment/snapshot, membaca semua referensi aktif sesuai peraturan, lalu membuat header dan seluruh baris snapshot PB; untuk Peraturan 2 juga snapshot CK dan SPML.
3. Simpan versi formula yang tepat bersama header snapshot.
4. Buat worksheet KPPN untuk periode itu dan assignment junction dari checklist snapshot. Semua KPPN menggunakan `snapshot_id` yang sama.
5. Commit seluruh rangkaian secara atomik. Jika gagal, tidak boleh tertinggal snapshot setengah jadi atau worksheet yang tidak konsisten.
6. Assignment PB/CK/SPML mengambil daftar checklist dari payload snapshot yang sama, bukan membaca ulang tabel aktif. Setelah transaksi commit, snapshot dikunci. Perubahan referensi aktif selanjutnya hanya memengaruhi snapshot periode baru.

### Pembacaan UI dan dokumen

API worksheet memetakan junction ke teks, opsi, dan hierarki dari snapshot periode. UI, dropdown, Excel, navigasi checklist, dan matriks harus menggunakan payload yang sama. KPPN dan Kanwil membaca snapshot identik; jangan mencampur snapshot dengan `*_ref` aktif dalam satu respons.

### Scoring historis

Scoring engine menerima/menemukan `snapshot_id` dari periode worksheet, kemudian memilih formula dari `formula_version` yang tersimpan. Untuk versi awal, pemetaan misalnya:

- `PER1_V1`: formula PB Peraturan 1 (skala 10 per komponen, bobot komponen, aturan N/A yang berlaku untuk versi tersebut).
- `PER2_V1`: formula PB Peraturan 2 (konversi sesuai aturan Peraturan 2, tanpa bobot komponen).
- Komponen CK/SPML hanya dihitung bila snapshot menunjukkan Peraturan 2.

Parameter peraturan dari URL/token tidak lagi boleh menentukan ulang formula secara diam-diam untuk worksheet yang sudah memiliki snapshot. Bila API tetap menerima parameter, backend harus memvalidasinya sama dengan snapshot dan mengembalikan konflik bila berbeda. Formula lama tetap tersedia untuk snapshot historis yang menunjuk versinya.

## Penandaan dan migrasi data historis

1. Periode setelah fitur aktif mendapat status `SNAPSHOTTED` dan menjadi histori authoritative.
2. Migrasi lama membuat satu snapshot per periode yang ada, dengan pemetaan tetap `period_id <= 16` = Peraturan 1 dan `period_id > 16` = Peraturan 2.
3. Karena referensi pada kedua peraturan diyakini tidak pernah berubah, migrasi menyalin referensi aktif yang sesuai dan menandai status `MIGRATED_VERIFIED`, mencatat waktu migrasi serta metode pemetaan.
4. Sebelum migrasi, validasi bahwa periode 1–16 dan >16 yang memiliki worksheet konsisten dengan jumlah/jenis assignment. Ketidaksesuaian tidak boleh diam-diam dipetakan; migrasi berhenti dengan laporan konflik.
5. Untuk periode legacy, formula ditetapkan dari pemetaan peraturan tersebut. Pastikan implementasi rumus saat ini sesuai dengan rumus historis; formula version tetap disimpan.
6. Tambahkan indikator di API/UI/Excel bahwa metadata referensi periode berasal dari snapshot migrasi yang diverifikasi, bukan snapshot yang dibuat saat periode berlangsung.

## Status implementasi

Implementasi awal telah dibuat pada:

- `sql/15_create_worksheet_reference_snapshots.sql` untuk metadata snapshot dan backfill periode lama.
- `backend/src/model/worksheetReferenceSnapshot.model.ts` untuk snapshot atomik saat assignment dan lookup/hydration.
- Assignment PB/CK/SPML mengambil checklist dari snapshot yang sama dalam transaksi; snapshot kedua dengan aturan berbeda untuk periode yang sama ditolak.
- Pembacaan worksheet PB/CK/SPML, kalkulasi PB/AKK, progress score, dan data turunan temuan mulai diarahkan ke snapshot.
- Frontend memuat snapshot sebelum junction dan export; jika snapshot tidak ditemukan, pembacaan worksheet gagal tertutup (fail closed).

Masih diperlukan validasi migrasi pada salinan database dan audit lanjutan untuk seluruh tampilan/export matriks historis yang mengambil definisi checklist dari jalur lain. Data backfill ditandai `MIGRATED_VERIFIED` berdasarkan pemetaan yang disetujui, tetapi sebelum produksi tetap perlu memastikan kondisi referensi aktif/soft-deleted sesuai histori nyata.

## Perubahan backend yang diperlukan

- Model/migrasi snapshot JSONB tingkat periode beserta metadata peraturan/formula.
- Assignment membuat snapshot dan junction berdasarkan snapshot dalam satu transaksi.
- Endpoint referensi worksheet membaca snapshot; endpoint admin tetap membaca/mengelola referensi aktif.
- Scoring engine PB/CK/SPML/AKK menerima worksheet/periode, mencari formula dan metadata referensi dari snapshot, bukan join definisi aktif.
- Validasi agar satu periode tidak dapat diberi dua peraturan/snapshot, dan snapshot tidak dapat diubah setelah dipakai.
- Endpoint administrasi untuk melihat status snapshot/historis dan, bila dibutuhkan, menjalankan backfill secara terkontrol.

## Perubahan frontend yang diperlukan

- Alur pembuatan periode/assignment menetapkan peraturan periode secara eksplisit.
- Seluruh halaman worksheet, pilihan skor, catatan, drawer, export Excel, halaman nilai, dan matriks memakai data snapshot dari API.
- Tampilkan badge/status referensi dan peraturan periode, terutama untuk data legacy.
- Jangan menyimpulkan peraturan worksheet dari profil user bila metadata periode tersedia dari server.

## Urutan implementasi

1. Audit skema periode, constraint, seluruh query PB/CK/SPML, matrix/findings, export, dan scoring untuk daftar field yang harus disalin.
2. Finalisasi nama relasi snapshot, pemetaan formula versi, kebijakan periode yang sudah punya assignment, dan kategori status histori.
3. Buat migrasi additive: tabel header snapshot JSONB, indeks, constraint satu snapshot per periode, dan backfill histori. Pertahankan kolom junction/ID sumber lama.
4. Implementasikan pembuatan snapshot atomik dan assignment untuk periode baru.
5. Ubah endpoint pembacaan dan scoring supaya snapshot menjadi sumber authoritative; pertahankan kompatibilitas periode legacy dengan status eksplisit.
6. Ubah seluruh consumer frontend dan export agar memakai kontrak snapshot.
7. Backfill historis dari aturan pemetaan dan referensi yang telah diverifikasi; gagalkan migrasi jika topology assignment bertentangan.
8. Pertahankan ID sumber pada junction dan metadata metode backfill untuk audit.

## Pengujian dan kriteria penerimaan

- Periode Peraturan 1 hanya memuat PB snapshot; periode Peraturan 2 memuat PB, CK, SPML snapshot.
- Seluruh worksheet KPPN dalam satu periode mengacu ke `snapshot_id` dan `formula_version` yang sama.
- Mengubah judul, urutan, bobot, opsi, menambah, atau menonaktifkan referensi aktif setelah snapshot dibuat tidak mengubah worksheet lama, Excel lama, matriks lama, maupun hasil scoring lama.
- Periode baru menangkap perubahan referensi dan menggunakan formula yang dipilih untuk periode tersebut.
- N/A, standardisasi, opsi nilai 15, bobot komponen, CK/SPML, dan komponen AKK diuji pada masing-masing formula version.
- Request dengan `peraturan` yang tidak sama dengan snapshot ditolak secara konsisten.
- Backfill dapat dijalankan ulang secara aman dan tidak mengubah status/isi snapshot yang sudah tervalidasi.
- Data legacy yang belum terverifikasi terlihat berbeda statusnya dan tidak diklaim sebagai histori akurat.

## Risiko dan hal yang perlu diputuskan sebelum implementasi

- Ukuran tabel snapshot bertambah seiring periode; dampaknya wajar karena satu set kecil referensi disalin per periode.
- Beberapa referensi saat ini memakai soft delete, tetapi update judul/opsi tetap mengubah data live; snapshot menyelesaikan keduanya untuk periode baru.
- Jika worksheet/snapshot periode lama perlu dikoreksi, jangan edit snapshot secara langsung. Perlu prosedur revisi terpisah dengan audit dampak agar revisi tidak menimpa histori secara diam-diam.
