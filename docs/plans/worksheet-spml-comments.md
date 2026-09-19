# Rencana Fungsionalitas Komentar Worksheet SPML

## Tujuan

Menambahkan komentar per checklist pada Worksheet SPML dengan pengalaman UI seperti komentar Worksheet PB:

- melihat daftar komentar;
- menambahkan komentar;
- menghapus komentar milik sendiri;
- menampilkan nama, avatar, dan waktu komentar.

Kolom database `comment_data.ws_spml_junction_id` sudah ditambahkan oleh user dan tidak memerlukan migration dari agent.

## 1. Backend Model Komentar

File: `backend/src/model/comment.model.ts`

### Tipe

- Menambahkan `ws_spml_junction_id: number | null` pada `CommentType`.
- Menyesuaikan `ws_junction_id` agar dapat bernilai `null`, karena komentar SPML hanya mengisi foreign key SPML.
- Menyamakan field foto dengan hasil query (`picture`, bukan `avatar`).

### Query baru

- `getByWsSPMLJunctionId(wsSPMLJunctionId)`:
  - filter `comment_data.ws_spml_junction_id`;
  - hanya mengambil `active = 1`;
  - join `user_ref` untuk nama dan foto;
  - urut berdasarkan `created_at ASC, id ASC`.
- `addSPML(wsSPMLJunctionId, userId, commentBody)`:
  - insert ke `ws_spml_junction_id`, `user_id`, `comment`, dan `active`;
  - `ws_junction_id` dibiarkan `NULL`.
- Menambahkan lookup komentar berdasarkan ID untuk validasi delete.

Query PB lama dipertahankan dan diberi pengurutan eksplisit yang sama.

## 2. Backend Controller dan Route

### Controller

File: `backend/src/controller/comment.controller.ts`

Menambahkan handler:

- `getByWsSPMLJunctionId`
- `addSPML`

Validasi:

- junction ID harus integer positif;
- komentar harus string, setelah trim tidak boleh kosong;
- panjang komentar dibatasi, direncanakan maksimum 2.000 karakter;
- junction SPML harus benar-benar tersedia;
- user KPPN hanya dapat mengakses junction milik KPPN-nya;
- user Kanwil dapat mengakses junction KPPN dalam ruang lingkup akses yang saat ini direpresentasikan oleh akun Kanwil.

Penghapusan komentar:

- endpoint delete yang sama dapat dipakai PB dan SPML;
- backend akan memverifikasi bahwa `comment.user_id` sama dengan user login sebelum soft delete, sehingga pembatasan tidak hanya bergantung pada UI.

### Route

File: `backend/src/routes/commentRoute.ts`

Menambahkan:

- `GET /comment/getByWsSPMLJunctionId/:wsSPMLJunctionId`
- `POST /comment/addSPML`

Keduanya memakai `authenticate`; route insert memakai activity log komentar yang sama seperti PB.

## 3. UI Komentar SPML

### Popover komentar

Membuat komponen SPML, misalnya:

`frontend/src/sections/worksheetSPML/components/CommentPopoverSPML.tsx`

Perilaku mengikuti PB:

- fetch komentar ketika popover dibuka;
- loading indicator selama fetch;
- empty state jika belum ada komentar;
- daftar komentar dengan avatar, nama, tanggal/jam, dan isi;
- form komentar baru;
- tombol kirim disabled selama request atau ketika isi kosong;
- link Delete hanya terlihat untuk pembuat komentar;
- setelah add/delete, daftar dimuat ulang;
- error ditampilkan melalui snackbar;
- lebar dibuat responsif agar tidak keluar viewport pada tabel.

### Tombol komentar per checklist

Membuat komponen kecil, misalnya:

`WorksheetSPMLTable/components/CommentAction.tsx`

- Menyimpan state open dan anchor untuk setiap row checklist.
- Tombol memakai ikon chat yang sudah dipilih.
- Klik tombol membuka popover untuk `junction_id` terkait.
- KPPN dan Kanwil sama-sama dapat melihat/menambahkan komentar, sama seperti PB.

## 4. Integrasi WorksheetSPMLTable

File: `frontend/src/sections/worksheetSPML/components/WorksheetSPMLTable/WorksheetSPMLTable.tsx`

- Mengganti tombol ikon tanpa handler dengan `CommentAction` pada checklist pertama dan checklist tambahan.
- Mempertahankan kolom Comment yang sudah ditambahkan.
- Mengubah `colSpan` row Komponen dan Subkomponen dari `6` menjadi `7` agar sesuai jumlah kolom tabel.
- Tidak mengubah rowspan No/Aspek, score, file, atau navigasi drawer.

## 5. Hak Akses dan Periode

- KPPN dan Kanwil dapat membaca serta menambahkan komentar.
- Hanya pembuat komentar yang dapat menghapus komentarnya.
- Komentar mengikuti perilaku PB dan tetap tersedia tanpa pembatasan `close_period`, karena fungsi komentar berperan sebagai komunikasi/catatan.

## 6. Verifikasi

### Backend

- Build TypeScript backend.
- Verifikasi get komentar SPML hanya mengembalikan komentar junction terkait.
- Verifikasi insert mengisi `ws_spml_junction_id` dan tidak mengisi `ws_junction_id`.
- Verifikasi komentar kosong/terlalu panjang ditolak.
- Verifikasi user tidak dapat membaca junction KPPN lain tanpa kewenangan.
- Verifikasi user tidak dapat menghapus komentar milik user lain.
- Pastikan route komentar PB lama tetap berfungsi.

### Frontend

- Lint komponen komentar dan tabel SPML.
- Build frontend.
- Uji UI:
  1. tombol membuka popover pada checklist yang tepat;
  2. daftar komentar tampil;
  3. tambah komentar merefresh daftar;
  4. delete hanya tampil bagi pembuat dan merefresh daftar;
  5. tombol tiap row tidak berbagi anchor/junction yang salah;
  6. row Komponen/Subkomponen tetap memenuhi seluruh 7 kolom.

## Batas Perubahan

- Tidak membuat migration karena kolom FK sudah ditambahkan.
- Tidak menambah websocket real-time; sinkronisasi mengikuti pola PB melalui refetch setelah add/delete.
- Tidak menambah jumlah komentar pada badge tombol dalam tahap ini.
- Implementasi dimulai setelah rencana disetujui.
