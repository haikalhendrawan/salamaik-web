# Rencana Struktur Data Kertas Kerja Capaian Kinerja (CK)

## Tujuan

Menambahkan struktur data Kertas Kerja Capaian Kinerja (CK) yang:

- mengikuti siklus periode dan assignment Kertas Kerja PB/SPML yang sudah ada;
- hanya mempunyai satu lapisan pengelompokan, yaitu Komponen -> Checklist;
- mendukung penilaian mandiri KPPN dan penilaian Kanwil;
- tidak mempunyai relasi ke Standardisasi KPPN;
- menjaga data historis dan dapat dikembangkan tanpa mengubah struktur PB/SPML.

Rencana ini disusun dari `docs/kertas_kerja_ck.xlsx` dan struktur aplikasi saat ini. Belum ada perubahan kode maupun database pada tahap ini.

## 1. Hasil Pembacaan Workbook

Workbook berisi satu sheet dengan struktur berikut:

| Bagian | Jumlah/isi |
| --- | --- |
| Komponen | 7 komponen, berurut A sampai G |
| Checklist | 15 checklist |
| Kolom data | No, Materi, Kriteria Penilaian, Bukti Dukung Kegiatan, Link Bukti Dukung Kegiatan, Nilai, Nilai Konversi |
| Nilai | `10`, `5`, `0`, atau `N/A` |
| Nilai konversi | `100`, `50`, `0`, atau `N/A` |
| Nilai akhir | Rata-rata nilai konversi checklist non-N/A |

Catatan kualitas data sumber:

- rumus total pada workbook adalah `SUM(G5:G24)` dan melewatkan checklist pertama pada baris 4;
- implementasi tidak boleh menyalin rentang tersebut secara literal;
- scoring harus menghitung seluruh junction aktif berdasarkan data database;
- nilai konversi merupakan nilai turunan (`nilai * 10`), sehingga tidak perlu disimpan di database.

## 2. Relasi Utama

```text
peraturan_ref
      |
      v
komponen_ck_ref 1 ---- n checklist_ck_ref
                              |
                              v
worksheet_ref 1 ---- n worksheet_ck_junction
                              |
                              +---- n comment_data
                              |
                              +---- n worksheet_ck_document (opsional, direkomendasikan)
```

`worksheet_ref` tetap digunakan sebagai master periode/assignment. CK tidak memerlukan tabel worksheet master baru karena saat ini PB dan SPML juga berada dalam satu siklus worksheet yang sama.

## 3. Tabel Referensi Komponen CK

Nama tabel: `komponen_ck_ref`

| Kolom | Tipe yang disarankan | Aturan | Keterangan |
| --- | --- | --- | --- |
| `id` | `SERIAL`/`INTEGER` | PK | ID komponen |
| `peraturan` | `INTEGER` | FK, NOT NULL | Versi regulasi; mengikuti pola referensi PB/SPML |
| `urut` | `TEXT` | NOT NULL | Nomor tampilan seperti `A`, `B`, ..., `G` |
| `title` | `TEXT` | NOT NULL | Judul komponen |
| `alias` | `TEXT` | NULL | Nama singkat bila dibutuhkan UI |
| `detail` | `TEXT` | NULL | Penjelasan tambahan |
| `deleted` | `TIMESTAMPTZ` | NULL | Soft delete |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, default now | Audit |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, default now | Audit |

Constraint/index:

- unique parsial `(peraturan, urut) WHERE deleted IS NULL`;
- index `(peraturan, deleted, urut)` untuk pemuatan dictionary;
- urutan query menggunakan `urut`, lalu `id`, bukan bergantung pada ID.

Tidak dibuat tabel subkomponen maupun subsubkomponen CK.

## 4. Tabel Referensi Checklist CK

Nama tabel: `checklist_ck_ref`

| Kolom | Tipe yang disarankan | Aturan | Keterangan |
| --- | --- | --- | --- |
| `id` | `SERIAL`/`INTEGER` | PK | ID checklist |
| `komponen_ck_id` | `INTEGER` | FK, NOT NULL | Relasi langsung ke satu komponen CK |
| `urut` | `INTEGER` | NOT NULL | Nomor checklist seperti 1–15 |
| `materi` | `TEXT` | NOT NULL | Isi kolom Materi pada workbook |
| `kriteria_penilaian` | `TEXT` | NOT NULL | Aturan/kriteria penentuan nilai |
| `bukti_dukung` | `TEXT` | NULL | Deskripsi dokumen yang wajib disediakan |
| `deleted` | `TIMESTAMPTZ` | NULL | Soft delete |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, default now | Audit |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL, default now | Audit |

Constraint/index:

- FK `komponen_ck_id -> komponen_ck_ref.id` memakai `ON DELETE RESTRICT` karena referensi menggunakan soft delete;
- unique parsial `(komponen_ck_id, urut) WHERE deleted IS NULL`;
- index `(komponen_ck_id, deleted, urut)`;
- tidak ada kolom `standardisasi`, `standardisasi_id`, `subkomponen_id`, atau `subsubkomponen_id`.

Kolom Link Bukti Dukung pada workbook bukan referensi checklist. Nilainya berbeda untuk setiap worksheet, sehingga disimpan pada data transaksi/dokumen, bukan `checklist_ck_ref`.

## 5. Opsi Nilai CK

Rekomendasi: membuat tabel `opsi_ck_ref` agar aturan nilai tidak di-hardcode di frontend dan masih dapat berubah pada regulasi berikutnya.

| Kolom | Tipe yang disarankan | Aturan | Keterangan |
| --- | --- | --- | --- |
| `id` | `SERIAL`/`INTEGER` | PK | ID opsi |
| `checklist_ck_id` | `INTEGER` | FK, NOT NULL | Checklist pemilik opsi |
| `label` | `TEXT` | NOT NULL | Contoh `Hijau`, `Kuning`, `Merah` |
| `description` | `TEXT` | NULL | Penjelasan opsi |
| `value` | `SMALLINT` | NOT NULL | Nilai mentah: 0, 5, atau 10 |
| `urut` | `SMALLINT` | NOT NULL | Urutan tampilan |
| `deleted` | `TIMESTAMPTZ` | NULL | Soft delete |

Constraint nilai awal: `CHECK (value IN (0, 5, 10))`.

Jika semua checklist dipastikan selamanya memakai opsi identik, tabel ini dapat ditunda dan opsi dapat disediakan oleh konfigurasi backend. Namun tabel referensi lebih aman terhadap perubahan regulasi dan sejalan dengan `opsi_ref` milik PB.

`N/A` tidak dimasukkan sebagai nilai opsi. N/A adalah status pengecualian dan disimpan terpisah pada junction agar tidak ambigu dengan skor.

## 6. Tabel Transaksi Worksheet CK

Nama tabel: `worksheet_ck_junction`

| Kolom | Tipe yang disarankan | Aturan | Keterangan |
| --- | --- | --- | --- |
| `junction_id` | `BIGSERIAL` | PK | ID transaksi checklist |
| `worksheet_id` | `UUID` | FK, NOT NULL | Menggunakan master `worksheet_ref` yang sama |
| `checklist_ck_id` | `INTEGER` | FK, NOT NULL | Checklist CK yang dinilai |
| `kppn_score` | `SMALLINT` | NULL | Nilai versi KPPN: 0, 5, atau 10 |
| `kanwil_score` | `SMALLINT` | NULL | Nilai versi Kanwil: 0, 5, atau 10 |
| `kppn_excluded` | `BOOLEAN` | NOT NULL, default false | Status N/A versi KPPN |
| `kanwil_excluded` | `BOOLEAN` | NOT NULL, default false | Status N/A versi Kanwil |
| `kppn_note` | `TEXT` | NULL | Catatan KPPN bila diperlukan |
| `kanwil_note` | `TEXT` | NULL | Catatan Kanwil |
| `last_update` | `TIMESTAMPTZ` | NULL | Waktu perubahan terakhir |
| `updated_by` | tipe sesuai `user_ref.id` | NULL/FK | User pengubah terakhir |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, default now | Audit |

Constraint penting:

- unique `(worksheet_id, checklist_ck_id)` untuk mencegah junction ganda;
- `CHECK (kppn_score IS NULL OR kppn_score IN (0, 5, 10))`;
- `CHECK (kanwil_score IS NULL OR kanwil_score IN (0, 5, 10))`;
- jika `kppn_excluded = true`, `kppn_score` harus `NULL`;
- jika `kanwil_excluded = true`, `kanwil_score` harus `NULL`;
- index `(worksheet_id, checklist_ck_id)` dan index pada masing-masing FK.

Status N/A dibuat terpisah untuk KPPN dan Kanwil. Dengan demikian, penilaian N/A dari satu pihak tidak otomatis menimpa keputusan pihak lain. Ini lebih aman dibanding satu kolom `excluded` bersama.

Tidak perlu menyalin `kppn_id` dan `period` ke junction karena keduanya sudah dapat diperoleh melalui FK `worksheet_id`. Menghindari duplikasi ini mencegah ketidakkonsistenan data.

## 7. Penyimpanan Bukti Dukung

Rekomendasi struktur normalisasi: `worksheet_ck_document`.

| Kolom | Tipe yang disarankan | Keterangan |
| --- | --- | --- |
| `id` | `BIGSERIAL` PK | ID dokumen |
| `ws_ck_junction_id` | `BIGINT` FK | Junction checklist CK |
| `document_type` | `TEXT`/enum | `server_file` atau `external_link` |
| `path_or_url` | `TEXT` | Nama/path file server atau URL |
| `display_name` | `TEXT` NULL | Nama yang tampil pada UI/Excel |
| `uploaded_by` | FK user | Pemilik perubahan |
| `created_at` | `TIMESTAMPTZ` | Audit |
| `deleted_at` | `TIMESTAMPTZ` NULL | Soft delete |

Keuntungan dibanding kolom `file_1`, `file_2`, `file_3`, dan `link_file`:

- jumlah dokumen tidak dikunci oleh jumlah kolom;
- file server dan link eksternal memakai satu mekanisme;
- delete dan audit lebih jelas;
- export Excel cukup mengambil daftar dokumen per junction.

Jika implementasi tahap pertama harus semirip mungkin dengan PB, alternatif minim perubahan adalah menyimpan `file_1`, `file_2`, `file_3`, dan `link_file` langsung di `worksheet_ck_junction`. Namun struktur dokumen terpisah direkomendasikan untuk CK baru.

## 8. Komentar

Untuk kompatibilitas dengan mekanisme komentar saat ini:

- tambahkan `comment_data.ws_ck_junction_id` sebagai FK nullable ke `worksheet_ck_junction.junction_id`;
- komentar CK mengisi `ws_ck_junction_id`, sedangkan FK PB/SPML tetap `NULL`;
- tambahkan index parsial pada `ws_ck_junction_id WHERE active = 1`;
- validasi aplikasi memastikan tepat satu target worksheet terisi pada setiap komentar.

Dalam refactor jangka panjang, target komentar dapat dipisah ke tabel relasi agar `comment_data` tidak terus bertambah satu FK untuk setiap jenis worksheet. Refactor tersebut tidak perlu menjadi blocker implementasi CK.

## 9. Aturan Scoring CK

Scoring dihitung server-side dan tidak menyimpan `nilai_konversi` maupun `nilai_akhir` sebagai sumber kebenaran.

Untuk masing-masing pihak (KPPN dan Kanwil):

1. ambil seluruh junction checklist aktif;
2. keluarkan checklist dengan status excluded/N/A pihak tersebut;
3. nilai `NULL` tanpa excluded berarti belum diisi dan tetap dibedakan dari N/A;
4. konversi skor dengan `score * 10` (`10 -> 100`, `5 -> 50`, `0 -> 0`);
5. `totalSkorKonversi = SUM(score * 10)` untuk skor yang telah diisi dan non-N/A;
6. `jumlahChecklistPembagi = jumlah checklist non-N/A`;
7. nilai akhir baru dianggap final jika seluruh checklist non-N/A sudah diisi;
8. `nilaiAkhir = totalSkorKonversi / jumlahChecklistPembagi`.

Response scoring yang disarankan mengikuti SPML, tetapi ditambah jumlah isian agar progress tidak memerlukan query lain:

```json
{
  "nilaiKPPN": 92.3077,
  "nilaiKanwil": 88.4615,
  "detailKPPN": {
    "jumlahChecklist": 15,
    "jumlahNA": 2,
    "jumlahChecklistPembagi": 13,
    "jumlahChecklistDiisi": 13,
    "totalSkorKonversi": 1200
  },
  "detailKanwil": {
    "jumlahChecklist": 15,
    "jumlahNA": 2,
    "jumlahChecklistPembagi": 13,
    "jumlahChecklistDiisi": 13,
    "totalSkorKonversi": 1150
  }
}
```

Kasus pembagi nol harus menghasilkan nilai `null`, bukan pembagian nol atau nilai 0 yang ambigu.

## 10. Mapping Data Awal dari Workbook

Seed awal terdiri dari:

- 7 row `komponen_ck_ref` untuk bagian A–G;
- 15 row `checklist_ck_ref` untuk checklist nomor 1–15;
- maksimal 3 opsi nilai per checklist (`10`, `5`, `0`) pada `opsi_ck_ref`;
- nilai contoh, link placeholder, Total Nilai, dan Rata-Rata pada workbook tidak ikut menjadi seed referensi.

Import/seed harus berada dalam satu transaksi dan memvalidasi:

- semua checklist mempunyai komponen;
- nomor checklist unik;
- semua komponen mempunyai setidaknya satu checklist;
- nilai contoh tidak tersimpan sebagai nilai transaksi pengguna.

## 11. Pengelolaan Referensi dan Dictionary

Tahap implementasi berikutnya perlu menambahkan:

- model/controller/route CRUD `komponen_ck_ref`, `checklist_ck_ref`, dan `opsi_ck_ref`;
- dictionary frontend: `komponenCKRef`, `checklistCKRef`, dan bila digunakan `opsiCKRef`;
- tipe TypeScript backend dan frontend khusus CK;
- UI admin referensi CK dengan pilihan Komponen langsung pada Checklist;
- soft delete yang menolak penghapusan komponen jika masih mempunyai checklist aktif;
- pengurutan berdasarkan kolom `urut`.

Referensi yang sudah dipakai worksheet historis sebaiknya tidak diedit secara destruktif. Perubahan regulasi dibuat sebagai referensi baru yang terikat ke `peraturan` baru agar histori tidak berubah.

## 12. Assignment dan Lifecycle

Pada assignment worksheet untuk regulasi yang memuat CK:

1. gunakan row `worksheet_ref` yang sama;
2. ambil semua checklist CK aktif untuk `peraturan` worksheet;
3. insert satu `worksheet_ck_junction` per checklist dalam transaksi yang sama dengan assignment PB/SPML;
4. gunakan unique constraint agar retry bersifat aman/idempotent;
5. periode buka/tutup mengikuti `worksheet_ref.open_period` dan `close_period`;
6. penghapusan worksheet membersihkan junction/dokumen CK melalui alur yang eksplisit atau FK cascade yang disepakati.

## 13. Urutan Implementasi yang Disarankan

1. Konfirmasi aturan scoring `0/5/10/N/A`, status N/A per pihak, dan jumlah file.
2. Buat migration tabel, constraint, index, dan seed referensi CK.
3. Tambahkan model/controller/route referensi serta dictionary.
4. Integrasikan CK ke assignment worksheet.
5. Tambahkan junction API untuk nilai, N/A, dokumen, link, dan komentar.
6. Tambahkan `ScoringEngine` CK beserta unit test, termasuk nilai 5 dan seluruh checklist N/A.
7. Bangun UI landing/workspace/table CK dan live update WebSocket dengan patch per junction.
8. Tambahkan export Excel dan footer scoring.
9. Uji regresi untuk memastikan PB/SPML serta histori lama tidak berubah.

## 14. Keputusan yang Perlu Disetujui

Rancangan ini memakai asumsi berikut:

- CK menggunakan satu `worksheet_ref` bersama PB dan SPML;
- KPPN dan Kanwil sama-sama memiliki skor dan status N/A masing-masing;
- nilai valid adalah `0`, `5`, dan `10` sesuai workbook;
- nilai konversi dihitung, bukan disimpan;
- bukti dukung direkomendasikan dalam tabel dokumen terpisah;
- tidak ada hubungan CK dengan Standardisasi KPPN.

Implementasi kode/database dilakukan setelah rancangan dan asumsi di atas disetujui.
