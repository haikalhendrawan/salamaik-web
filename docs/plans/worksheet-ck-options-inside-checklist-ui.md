# Rencana UI Opsi CK di Dalam Referensi Checklist

## Tujuan

Mengubah pengelolaan opsi CK agar mengikuti pola referensi Checklist Kertas Kerja PB:

- opsi terlihat langsung pada setiap row checklist;
- nilai opsi ditampilkan sebagai label berwarna;
- klik label membuka mode edit opsi;
- tombol tambah pada row membuka mode tambah opsi untuk checklist tersebut;
- tambah, edit, dan hapus dilakukan melalui modal opsi khusus.

## 1. Perubahan Tabel Checklist CK

File:

- `frontend/src/sections/admin/worksheetRef/ChecklistCkRef/ChecklistCkRef.tsx`

Menambahkan kolom `Opsi` di antara kolom Kriteria Penilaian dan Bukti Dukung.

Untuk setiap checklist:

- filter `opsiCkRef` berdasarkan `checklist_ck_id`;
- urutkan berdasarkan `urut`, lalu `id`;
- tampilkan opsi sebagai komponen `Label`;
- warna label:
  - nilai 10: `success`;
  - nilai 5: `warning`;
  - nilai 0: `pink`;
- klik label membuka modal edit untuk opsi tersebut;
- ikon `solar:add-square-bold` membuka modal tambah untuk checklist tersebut.

Kolom Action checklist tetap hanya menangani edit dan delete checklist.

## 2. Modal Opsi CK

Membuat file:

- `frontend/src/sections/admin/worksheetRef/ChecklistCkRef/OpsiCkModal.tsx`

Modal menerima:

- status open/close;
- checklist aktif;
- opsi aktif bila mode edit;
- mode `add` atau `edit`.

Bagian informasi atas menampilkan:

- nomor checklist;
- materi checklist;
- kriteria penilaian.

Form opsi berisi:

- urut opsi, integer positif;
- nilai berupa select `10`, `5`, atau `0`;
- label, wajib;
- deskripsi, opsional dan multiline.

Endpoint:

- `POST /ckRef/createOpsi`;
- `POST /ckRef/editOpsi`;
- `POST /ckRef/deleteOpsi`.

Payload otomatis memakai `checklist_ck_id` dari row checklist yang membuka modal, sehingga admin tidak perlu memilih checklist lagi.

## 3. Daftar Opsi di Dalam Modal

Seperti modal PB, bagian bawah modal menampilkan seluruh opsi aktif milik checklist tersebut.

- opsi yang sedang diedit diberi background pembeda;
- klik opsi eksisting memindahkan modal ke mode edit opsi tersebut;
- tombol hapus hanya tampil pada mode edit;
- hapus memakai dialog konfirmasi;
- setelah create/edit/delete, panggil `getCkDictionary()` agar label pada tabel dan daftar modal langsung berubah.

Modal tetap terbuka setelah mutasi agar admin dapat mengatur beberapa opsi pada checklist yang sama. Setelah delete, modal kembali ke mode tambah bila checklist masih tersedia.

## 4. State pada ChecklistCkRef

Menambahkan state terpisah dari modal checklist:

- `optionModalOpen`;
- `selectedChecklistId`;
- `selectedOptionId`;
- `optionMode: 'add' | 'edit'`.

Handler:

- `openAddOption(checklistId)`;
- `openEditOption(checklistId, optionId)`;
- `closeOptionModal()`.

State `isSubmitting` opsi dikelola di dalam `OpsiCkModal` agar pengelolaan opsi tidak men-disable seluruh action tabel checklist.

## 5. Menghapus UI Opsi CK Terpisah

Karena opsi sudah dikelola dari row Checklist CK, section terpisah menjadi duplikat dan akan dihapus.

Perubahan:

- hapus folder `frontend/src/sections/admin/worksheetRef/OpsiCkRef/`;
- hapus import dan section `OpsiCkRef` dari `WorksheetRefPage.tsx`;
- hapus label `Opsi CK` dari `SECTION_NAME`;
- hapus tombol `Opsi CK` dari `WorksheetCkGrid.tsx`.

Section CK yang tersisa:

- 12: Komponen CK;
- 13: Checklist CK.

`opsiCkRef` dan `getCkDictionary()` tetap berada di `useDictionary` karena dibutuhkan tabel dan modal checklist.

## 6. Error dan Loading

- tombol submit opsi disabled ketika request berjalan atau form belum valid;
- pesan HTTP 400/404/409 dari backend ditampilkan melalui snackbar;
- konflik nilai atau urut opsi ditampilkan tanpa menutup modal;
- tombol delete memakai `DialogProvider` yang sudah membungkus section referensi;
- fallback network error tetap tersedia.

## 7. Verifikasi

- build TypeScript/Vite frontend;
- ESLint terarah pada Checklist CK, modal opsi, landing, dan page reference;
- setiap checklist menampilkan tiga opsi seed (`10`, `5`, `0`);
- klik label membuka data opsi yang benar;
- klik ikon tambah mengunci `checklist_ck_id` yang benar;
- create menambah label pada row tanpa reload seluruh halaman;
- edit memperbarui label/nilai/deskripsi;
- delete menghilangkan label dari row;
- error duplikasi nilai atau urut ditampilkan;
- CRUD checklist tetap bekerja;
- Komponen CK dan referensi PB/SPML tidak berubah.

## Batas Perubahan

- tidak mengubah backend, database, atau `useDictionary` contract;
- tidak mengubah pengisian worksheet CK;
- tidak mengubah modal opsi PB.

Implementasi dimulai setelah rencana ini disetujui.
