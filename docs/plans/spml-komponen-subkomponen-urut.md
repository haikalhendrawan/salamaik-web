# Rencana Penambahan `urut` Komponen dan Subkomponen SPML

## Tujuan

Menyesuaikan seluruh alur aplikasi setelah penambahan kolom database berikut:

- `komponen_spml_ref.urut TEXT DEFAULT NULL`
- `subkomponen_spml_ref.urut TEXT DEFAULT NULL`

Format tampilan yang digunakan:

- Jika `urut` tersedia: `<urut>. <title>`, contoh `I. Kualitas Pelayanan`.
- Jika `urut` `NULL`, kosong, atau hanya whitespace: tampilkan `<title>` saja untuk kompatibilitas data lama.

## 1. Backend Referensi SPML

### Tipe model

File: `backend/src/model/spmlRef.model.ts`

- Memastikan `KomponenSpmlType` dan `SubKomponenSpmlType` memiliki `urut: string | null`.
- Kolom tersebut sudah tampak pada interface saat analisis, tetapi belum diteruskan oleh operasi database.

### Query Komponen

- `createKomponenSpml` menerima `urut` dan memasukkannya ke kolom `urut`.
- `editKomponenSpml` memperbarui `urut` bersama field lain.
- Input kosong dinormalisasi menjadi `NULL`.
- Query get tetap menggunakan `SELECT *`, sehingga kolom otomatis dikembalikan.

### Query Subkomponen

- `createSubKomponenSpml` menerima dan menyimpan `urut`.
- `editSubKomponenSpml` memperbarui `urut`.
- Input kosong dinormalisasi menjadi `NULL`.

### Controller

File: `backend/src/controller/spmlRef.controller.ts`

- Endpoint create/edit Komponen membaca `urut` dari body dan meneruskannya ke model.
- Endpoint create/edit Subkomponen melakukan hal yang sama.
- `urut` tetap opsional karena default database adalah `NULL`.
- Nilai non-string ditolak; nilai string di-trim sebelum disimpan.

Tidak dibuat migration karena kolom telah ditambahkan langsung oleh user.

## 2. Tipe dan Dictionary Frontend

File: `frontend/src/hooks/useDictionary.tsx`

- Menambahkan `urut?: string | null` pada:
  - `KomponenSpmlRefType`;
  - `SubKomponenSpmlRefType`.
- Fetch dictionary tidak perlu endpoint baru karena response `SELECT *` sudah membawa kolom tersebut.

## 3. Pengelolaan Referensi Admin

### Komponen SPML

File: `frontend/src/sections/admin/worksheetRef/KomponenSpmlRef/KomponenSpmlRef.tsx`

- Menambahkan kolom tabel `Urut`.
- Menambahkan input teks `Urut` pada modal add/edit.
- Menambahkan `urut` pada empty form, reset form, pengisian data edit, payload create, dan payload edit.
- Field opsional; input kosong dikirim sebagai `null` atau string kosong yang dinormalisasi backend.

### Subkomponen SPML

File: `frontend/src/sections/admin/worksheetRef/SubKomponenSpmlRef/SubKomponenSpmlRef.tsx`

- Menambahkan kolom tabel `Urut`.
- Menambahkan input teks `Urut` pada modal add/edit.
- Menambahkan `urut` pada state form, reset, edit initialization, serta payload create/edit.
- Nama Komponen induk pada tabel dan dropdown ditampilkan menggunakan prefix `urut` bila tersedia.

## 4. Label Pilihan Referensi Berjenjang

File yang terdampak:

- `AspekSpmlRef/AspekSpmlRef.tsx`
- `ChecklistSpmlRef/ChecklistSpmlRef.tsx`
- `SubKomponenSpmlRef/SubKomponenSpmlRef.tsx`

Penyesuaian:

- Opsi pilihan Komponen ditampilkan sebagai `<urut>. <title>`.
- Opsi pilihan Subkomponen ditampilkan dengan format yang sama.
- Kolom relasi Komponen/Subkomponen pada tabel admin juga memakai label ber-prefix.
- Value/id dan logika filter tidak berubah.

## 5. Worksheet SPML

File: `frontend/src/sections/worksheetSPML/components/WorksheetSPMLTable/WorksheetSPMLTable.tsx`

- Row Komponen menampilkan `urut + ". " + title` bila `urut` tersedia.
- Row Subkomponen menggunakan format yang sama.
- Struktur row, colspan, score, dan dokumen tidak berubah.

## 6. Drawer Navigasi SPML

File: `frontend/src/sections/worksheetSPML/components/NavigationDrawerSPML.tsx`

- Judul Komponen dan Subkomponen memakai prefix `urut`.
- Nomor Aspek dan kotak status checklist tidak berubah.

## 7. Export Excel SPML

File: `frontend/src/sections/excel/useExcelWorksheetSPML.ts`

- Baris merged Komponen memakai `<urut>. <title>`.
- Baris merged Subkomponen memakai `<urut>. <title>`.
- Struktur dua sheet, merge `A:E`, nilai, dan dokumen tetap sama.

## 8. Helper Format Bersama

Untuk menghindari pengulangan dan format yang tidak konsisten, dibuat helper frontend kecil, misalnya:

`frontend/src/utils/formatOrderedTitle.ts`

Perilaku:

- menerima `urut` dan `title`;
- melakukan trim pada `urut`;
- menghindari titik ganda apabila nilai `urut` sudah berakhiran titik;
- fallback ke title ketika `urut` kosong/null.

Contoh:

- `I` + `Kualitas Pelayanan` → `I. Kualitas Pelayanan`
- `I.` + `Kualitas Pelayanan` → `I. Kualitas Pelayanan`
- `null` + `Kualitas Pelayanan` → `Kualitas Pelayanan`

## 9. Kompatibilitas dan Urutan Data

- Data historis dengan `urut = NULL` tetap tampil seperti sebelumnya.
- Kolom `urut` bertipe TEXT dipakai sebagai label, bukan sebagai kunci relasi.
- Query masih diurutkan berdasarkan `id ASC`; tidak diubah menjadi `ORDER BY urut` karena urutan teks/Romawi (`I`, `II`, `IV`, `X`) tidak aman bila disortir secara leksikografis. Jika urutan tampilan harus mengikuti kolom baru, diperlukan aturan sorting terpisah atau kolom urutan numerik.

## Verifikasi

### Backend

- Build TypeScript backend.
- Uji create/edit Komponen dengan `urut` berisi nilai dan kosong.
- Uji create/edit Subkomponen dengan `urut` berisi nilai dan kosong.
- Pastikan response get mengandung `urut`.

### Frontend

- Lint semua file yang diubah.
- Build frontend.
- Verifikasi:
  1. form admin dapat menyimpan dan mengedit `urut`;
  2. tabel admin menampilkan kolom `Urut`;
  3. dropdown berjenjang menampilkan prefix;
  4. worksheet menampilkan `I. Kualitas Pelayanan`;
  5. drawer menampilkan label yang sama;
  6. dua sheet Excel menampilkan prefix pada row merged;
  7. record `urut = NULL` tidak menghasilkan `null.`, `undefined.`, atau titik berlebih.

## Batas Perubahan

- Tidak membuat atau mengubah migration/schema database karena kolom sudah ditambahkan.
- Tidak mengubah ID, foreign key, dan logika assignment worksheet.
- Tidak mengubah urutan query menjadi berdasarkan teks `urut`.
- Implementasi dimulai setelah rencana disetujui.
