# Rencana Penambahan `tipe` dan `provinsi` pada `kppn_ref`

## Tujuan

Menambahkan metadata berikut ke tabel `kppn_ref`:

- `tipe`: salah satu dari `A1`, `A2`, `Kh`, `K1`, `K2`, atau `K3`.
- `provinsi`: penanda numerik `0` atau `1`.

## Keputusan Struktur Data

### Kolom `tipe`

Gunakan PostgreSQL enum baru bernama `kppn_tipe_enum` dengan nilai yang case-sensitive:

```sql
'A1', 'A2', 'Kh', 'K1', 'K2', 'K3'
```

Kolom dibuat nullable tanpa default. Alasannya, migrasi belum memiliki pemetaan tipe untuk setiap baris `kppn_ref` yang sudah ada. Dengan demikian migrasi tidak menebak data bisnis dan tidak gagal terhadap data lama.

### Kolom `provinsi`

Gunakan `SMALLINT NOT NULL DEFAULT 0` dengan `CHECK (provinsi IN (0, 1))`.

Walaupun secara konsep merupakan boolean, PostgreSQL `BOOLEAN` menyimpan dan mengirim `true`/`false`, bukan angka `0`/`1`. Karena kebutuhan secara eksplisit menyebut nilai numerik `0` atau `1`, dan aplikasi telah menggunakan pola `SMALLINT` untuk flag seperti `excluded`, tipe ini paling konsisten dengan kode yang ada.

## File Migrasi

Buat file baru:

`sql/06_add_tipe_provinsi_to_kppn_ref.sql`

Rancangan migrasi:

1. Mulai transaksi.
2. Buat enum `kppn_tipe_enum` secara aman.
3. Tambahkan kolom `tipe kppn_tipe_enum` bila belum tersedia.
4. Tambahkan kolom `provinsi SMALLINT NOT NULL DEFAULT 0` bila belum tersedia.
5. Tambahkan constraint bernama `kppn_ref_provinsi_check` secara idempotent agar hanya menerima `0` atau `1`.
6. Tambahkan komentar dokumentasi pada kedua kolom.
7. Commit transaksi.

Gambaran query utama:

```sql
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

-- Constraint ditambahkan melalui blok DO dengan pemeriksaan pg_constraint
-- agar migration aman ketika dijalankan ulang.

COMMIT;
```

Tidak diperlukan indeks baru pada tahap ini karena belum ada query yang memfilter atau mengurutkan data berdasarkan `tipe` maupun `provinsi`.

## Dampak dan Perubahan Kode

### 1. Backend: model unit

File: `backend/src/model/unit.model.ts`

- Tambahkan tipe union `KPPNTipe = 'A1' | 'A2' | 'Kh' | 'K1' | 'K2' | 'K3'`.
- Tambahkan `tipe: KPPNTipe | null` pada `UnitType`.
- Tambahkan `provinsi: 0 | 1` pada `UnitType`.
- Query `getAllUnit`, `getAllKPPN`, dan `getUnitById` tidak perlu diubah karena sudah memakai `SELECT *`.

### 2. Backend: controller unit

File: `backend/src/controller/unit.controller.ts`

- Hilangkan atau sesuaikan deklarasi `UnitType` lokal yang saat ini menduplikasi tipe dari model.
- Lebih aman mengimpor `UnitType` dari model agar perubahan kontrak berikutnya tidak kembali berbeda antara model dan controller.
- Bentuk response dan route tidak berubah; field baru akan ikut dalam `rows`.

### 3. Frontend: dictionary

File: `frontend/src/hooks/useDictionary.tsx`

- Tambahkan union type nilai `tipe`.
- Tambahkan `tipe: KPPNTipe | null` dan `provinsi: 0 | 1` pada `UnitType`.
- Fungsi `getKPPN()` tidak perlu diubah karena menyimpan seluruh `response.data.rows` ke `kppnRef.list`.
- Mapping `kppnRef[id] = alias` tetap kompatibel.

### 4. Konsumen data KPPN lainnya

Komponen worksheet, matrix, standardisasi, history, assignment, user reference, scoring engine, dan export Excel saat ini hanya memakai data seperti `id`, `name`, `alias`, `level`, atau `col_order`. Penambahan properti pada response tidak mengubah perilaku komponen-komponen tersebut.

Query backend yang memilih kolom KPPN secara eksplisit juga tidak perlu diubah selama fitur tersebut belum membutuhkan `tipe` atau `provinsi`.

### 5. Pengelolaan referensi KPPN

Saat ini backend hanya menyediakan endpoint baca untuk `kppn_ref`; belum ditemukan endpoint create/update/delete maupun halaman admin khusus referensi KPPN. Karena itu migrasi ini belum menyediakan cara mengisi `tipe` dari UI.

Pilihan tindak lanjut:

- Untuk kebutuhan awal, isi `tipe` dan `provinsi` melalui query backfill terpisah berdasarkan pemetaan resmi KPPN.
- Jika data perlu dikelola dari aplikasi, buat pekerjaan lanjutan berupa CRUD referensi KPPN, validasi enum pada controller, select `tipe`, serta switch/select `provinsi` pada UI admin.

Backfill tidak dimasukkan dalam migrasi ini karena belum tersedia pemetaan unit ke tipe/provinsi. Seluruh data lama akan memiliki `tipe = NULL`, sedangkan `provinsi = 0`.

## Kompatibilitas API

- Tidak ada endpoint atau field lama yang dihapus.
- Client lama tetap dapat menggunakan response seperti sebelumnya.
- Field baru bersifat additive.
- `tipe` perlu mengakomodasi `null` sampai backfill selesai.

## Verifikasi

1. Jalankan migrasi pada database pengembangan.
2. Periksa definisi enum dan kedua kolom melalui metadata PostgreSQL.
3. Pastikan seluruh baris lama memiliki `provinsi = 0` dan `tipe = NULL`.
4. Uji constraint dengan mencoba nilai `provinsi` selain `0`/`1` dan nilai `tipe` di luar enum; keduanya harus ditolak.
5. Panggil `/getAllUnit` dan `/getUnitById`; pastikan kedua properti baru ikut pada response.
6. Jalankan type-check/build backend dan frontend setelah interface diperbarui.

## Batas Lingkup Implementasi Berikutnya

Setelah rencana disetujui, implementasi mencakup:

- file migrasi `06_add_tipe_provinsi_to_kppn_ref.sql`;
- pembaruan tipe model/controller backend;
- pembaruan tipe dictionary frontend;
- pemeriksaan type-check/build yang relevan.

CRUD admin KPPN dan data backfill tidak dibuat tanpa pemetaan atau permintaan lanjutan karena keduanya merupakan perluasan fitur di luar penambahan kolom.
