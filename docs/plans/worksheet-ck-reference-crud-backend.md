# Rencana Backend CRUD Referensi Kertas Kerja CK

## Tujuan

Menyediakan backend awal agar admin dapat mengelola referensi Kertas Kerja Capaian Kinerja (CK), meliputi:

- Komponen CK;
- Checklist CK;
- Opsi nilai CK.

Tahap ini hanya mencakup pengelolaan referensi. Assignment, junction, pengisian nilai, file/link bukti dukung, komentar, scoring, dan WebSocket CK akan dikerjakan pada tahap berikutnya.

## 1. Ruang Lingkup File

### File baru

- `backend/src/model/ckRef.model.ts`
- `backend/src/controller/ckRef.controller.ts`
- `backend/src/routes/ckRefRoute.ts`

### File yang disesuaikan

- `backend/src/index.ts` untuk memasang route pada prefix `/ckRef`.

Tidak ada perubahan database pada tahap ini karena migration dan seed CK sudah berhasil dijalankan.

## 2. Model Referensi CK

File `ckRef.model.ts` akan mendefinisikan tipe sesuai schema database yang sudah dimigrasikan.

### Tipe Komponen CK

```ts
interface KomponenCkType {
  id: number;
  peraturan: number;
  urut: string;
  title: string;
  alias: string | null;
  detail: string | null;
  deleted: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
}
```

### Tipe Checklist CK

```ts
interface ChecklistCkType {
  id: number;
  komponen_ck_id: number;
  urut: number;
  materi: string;
  kriteria_penilaian: string;
  bukti_dukung: string | null;
  deleted: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
}
```

### Tipe Opsi CK

```ts
interface OpsiCkType {
  id: number;
  checklist_ck_id: number;
  label: string;
  description: string | null;
  value: 0 | 5 | 10;
  urut: number;
  deleted: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
}
```

### Komponen CK model

Metode yang dibuat:

- `getAll(peraturan)`
  - hanya mengambil `deleted IS NULL`;
  - filter berdasarkan `peraturan` dari token;
  - urut berdasarkan `urut`, lalu `id`.
- `getById(id, peraturan, poolTrx?)`
  - dipakai untuk validasi ownership regulasi dan keberadaan row aktif.
- `existsByUrut(peraturan, urut, excludeId?, poolTrx?)`
  - mencegah urutan komponen aktif yang sama pada satu regulasi;
  - diperlukan karena unique index referensi tidak ada pada migration final.
- `create(body)`
  - insert `peraturan`, `urut`, `title`, `alias`, dan `detail`;
  - mengembalikan satu row hasil insert.
- `edit(body, peraturan)`
  - update hanya jika row aktif dan berada pada regulasi user;
  - memperbarui `updated_at`.
- `hasActiveChecklist(id, poolTrx?)`
  - mencegah komponen dihapus ketika masih mempunyai checklist aktif.
- `delete(id, peraturan)`
  - soft delete dengan `deleted = CURRENT_TIMESTAMP`;
  - dilakukan dalam transaksi setelah pemeriksaan child checklist.

### Checklist CK model

Metode yang dibuat:

- `getAll(peraturan)`
  - join `komponen_ck_ref` untuk membatasi regulasi;
  - hanya mengambil komponen dan checklist aktif;
  - menyertakan `komponen_title` dan `komponen_urut` untuk kebutuhan UI admin;
  - urut berdasarkan komponen dan nomor checklist.
- `getById(id, peraturan, poolTrx?)`.
- `existsByUrut(komponenCkId, urut, excludeId?, poolTrx?)`.
- `create(body)`.
- `edit(body, peraturan)`
  - dapat memindahkan checklist ke komponen lain selama komponen tujuan aktif dan berada pada regulasi yang sama.
- `delete(id, peraturan)`
  - soft delete checklist;
  - opsi tidak ikut dihapus agar referensi historis tetap dapat dibaca.

### Opsi CK model

Metode yang dibuat:

- `getAll(peraturan, checklistCkId?)`
  - join Checklist -> Komponen untuk filter regulasi;
  - optional filter satu checklist;
  - urut berdasarkan nomor checklist dan `opsi.urut`.
- `getById(id, peraturan, poolTrx?)`.
- `existsByValue(checklistCkId, value, excludeId?, poolTrx?)`
  - satu checklist tidak boleh mempunyai dua opsi aktif dengan nilai yang sama.
- `existsByUrut(checklistCkId, urut, excludeId?, poolTrx?)`
  - satu checklist tidak boleh mempunyai dua opsi aktif dengan nomor urut yang sama.
- `create(body)`.
- `edit(body, peraturan)`.
- `delete(id, peraturan)` menggunakan soft delete.

Semua query menggunakan parameter binding PostgreSQL. Model tidak menerima `peraturan` dari body untuk operasi yang terikat user.

## 3. Controller dan Validasi

File `ckRef.controller.ts` akan mempunyai handler berikut.

### Komponen

- `getAllKomponenCk`
- `createKomponenCk`
- `editKomponenCk`
- `deleteKomponenCk`

Validasi:

- `peraturan` harus tersedia dan valid pada `req.payload`;
- `id` harus integer positif;
- `urut` dan `title` wajib berupa string non-kosong setelah `trim`;
- `alias` dan `detail` dinormalisasi menjadi string trim atau `null`;
- kombinasi `peraturan + urut` tidak boleh duplikat pada row aktif;
- edit/delete harus menolak row milik regulasi lain;
- delete ditolak dengan HTTP 409 jika masih mempunyai checklist aktif.

### Checklist

- `getAllChecklistCk`
- `createChecklistCk`
- `editChecklistCk`
- `deleteChecklistCk`

Validasi:

- `komponen_ck_id`, `urut`, dan `id` harus integer positif sesuai kebutuhan operasi;
- `materi` dan `kriteria_penilaian` wajib berupa string non-kosong;
- `bukti_dukung` dinormalisasi menjadi string atau `null`;
- komponen harus aktif dan berada pada `req.payload.peraturan`;
- nomor `urut` tidak boleh duplikat dalam komponen aktif yang sama;
- edit/delete harus menolak checklist dari regulasi lain.

### Opsi

- `getAllOpsiCk`
- `createOpsiCk`
- `editOpsiCk`
- `deleteOpsiCk`

Validasi:

- `checklist_ck_id`, `urut`, dan `id` harus integer positif sesuai kebutuhan;
- `label` wajib berupa string non-kosong;
- `description` dinormalisasi menjadi string atau `null`;
- `value` hanya dapat berupa angka `0`, `5`, atau `10`;
- checklist harus aktif dan berada pada regulasi user;
- nilai dan nomor urut opsi tidak boleh duplikat pada checklist yang sama.

Semua hasil mutasi yang tidak menemukan row aktif mengembalikan HTTP 404 melalui `ErrorDetail`. Konflik referensi/duplikasi menggunakan HTTP 409, sedangkan payload tidak valid menggunakan HTTP 400.

## 4. Route dan Hak Akses

File `ckRefRoute.ts` dipasang pada `/ckRef`.

### Komponen

- `GET /ckRef/getAllKomponen`
- `POST /ckRef/createKomponen`
- `POST /ckRef/editKomponen`
- `POST /ckRef/deleteKomponen`

### Checklist

- `GET /ckRef/getAllChecklist`
- `POST /ckRef/createChecklist`
- `POST /ckRef/editChecklist`
- `POST /ckRef/deleteChecklist`

### Opsi

- `GET /ckRef/getAllOpsi`
  - optional query `checklistCkId`.
- `POST /ckRef/createOpsi`
- `POST /ckRef/editOpsi`
- `POST /ckRef/deleteOpsi`

Middleware:

- seluruh endpoint memakai `authenticate`;
- endpoint GET dapat dibaca role `[99, 4, 3, 2, 1]` agar nantinya dictionary dan worksheet dapat memakai endpoint yang sama;
- endpoint create/edit/delete hanya dapat diakses super admin dan admin Kanwil: `[99, 4]`;
- delete hanya menggunakan POST, tidak menambahkan destructive GET route baru.

Activity log CK memerlukan ID baru pada `activity_ref`. Agar tidak mereferensikan ID yang belum tersedia, route awal tidak akan memasang `logActivity` dengan ID hasil asumsi. Audit activity dapat ditambahkan setelah referensi activity CK ditentukan/di-seed.

## 5. Konsistensi dan Transaksi

Karena migration final tidak mempunyai unique index pada tabel referensi:

- controller/model melakukan pengecekan duplikasi sebelum insert/update;
- operasi yang menggabungkan pemeriksaan dan mutasi memakai satu `PoolClient` dan transaksi;
- model dapat memakai lock transaksi pada tabel referensi terkait untuk mencegah dua request admin bersamaan melewati duplicate check;
- perlindungan aplikasi ini tidak menggantikan kekuatan unique constraint database, tetapi menjaga perilaku CRUD sesuai schema yang telah disepakati.

Soft delete dipilih agar:

- reference baru tidak lagi dipakai untuk assignment berikutnya;
- junction dan histori lama tetap dapat merujuk ID yang sama;
- tidak ada physical delete pada CRUD admin.

## 6. Format Response

Response mengikuti pola backend saat ini:

```json
{
  "success": true,
  "message": "Get checklist CK success",
  "rows": []
}
```

Create/edit/delete mengembalikan satu object pada `rows`, bukan array, agar kontraknya konsisten di seluruh CRUD CK.

## 7. Pengujian

### Build

- jalankan `npm run build` pada backend;
- pastikan tidak ada error TypeScript.

### Model/controller

- GET hanya mengembalikan row aktif untuk regulasi user;
- create komponen/checklist/opsi berhasil;
- payload kosong, ID non-integer, nilai di luar `0/5/10`, dan urut tidak valid ditolak;
- duplikasi urut/nilai ditolak dengan 409;
- komponen/checklist dari regulasi lain tidak dapat diedit atau dihapus;
- komponen dengan checklist aktif tidak dapat dihapus;
- soft delete menghilangkan row dari endpoint GET tanpa menghapus row database;
- menjalankan edit/delete terhadap row yang sudah dihapus menghasilkan 404.

### Regresi

- route SPML dan PB tetap terpasang dan tidak berubah;
- tidak ada query terhadap `worksheet_ck_junction` pada tahap CRUD referensi;
- tidak ada perubahan frontend.

## 8. Batas Implementasi Tahap Ini

- belum membuat model/controller junction CK;
- belum mengintegrasikan CK ke assignment worksheet;
- belum membuat scoring engine CK;
- belum membuat upload file/link, komentar, atau WebSocket CK;
- belum membuat UI admin atau menambah CK ke `useDictionary` frontend;
- belum membuat activity reference CK.

Implementasi dimulai setelah rencana ini disetujui.
