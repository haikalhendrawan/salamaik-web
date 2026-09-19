# Rencana Frontend CRUD Referensi Kertas Kerja CK

## Tujuan

Menambahkan UI admin untuk mengelola referensi Kertas Kerja Capaian Kinerja (CK) dan memasukkan referensi CK ke `useDictionary`.

UI menggunakan endpoint backend `/ckRef` yang sudah tersedia dan ditempatkan pada halaman `Reference > Kertas Kerja` bersama referensi PB dan SPML.

## 1. Ruang Lingkup

### File baru

- `frontend/src/sections/admin/worksheetRef/KomponenCkRef/KomponenCkRef.tsx`
- `frontend/src/sections/admin/worksheetRef/KomponenCkRef/index.tsx`
- `frontend/src/sections/admin/worksheetRef/ChecklistCkRef/ChecklistCkRef.tsx`
- `frontend/src/sections/admin/worksheetRef/ChecklistCkRef/index.tsx`
- `frontend/src/sections/admin/worksheetRef/OpsiCkRef/OpsiCkRef.tsx`
- `frontend/src/sections/admin/worksheetRef/OpsiCkRef/index.tsx`
- `frontend/src/sections/admin/worksheetRef/WorksheetRefLanding/WorksheetCkGrid.tsx`

### File yang disesuaikan

- `frontend/src/hooks/useDictionary.tsx`
- `frontend/src/pages/admin/WorksheetRefPage.tsx`
- `frontend/src/sections/admin/worksheetRef/WorksheetRefLanding/WorksheetRefLanding.tsx`

Tidak membuat route halaman baru karena semua section dikelola oleh `WorksheetRefPage` melalui state `section`.

## 2. Tipe dan State useDictionary

Menambahkan tipe berikut dan mengekspornya untuk dipakai komponen admin.

### Komponen CK

```ts
export interface KomponenCkRefType {
  id: number;
  peraturan: number;
  urut: string;
  title: string;
  alias: string | null;
  detail: string | null;
}
```

### Checklist CK

```ts
export interface ChecklistCkRefType {
  id: number;
  komponen_ck_id: number;
  urut: number;
  materi: string;
  kriteria_penilaian: string;
  bukti_dukung: string | null;
  komponen_title: string;
  komponen_urut: string;
}
```

### Opsi CK

```ts
export interface OpsiCkRefType {
  id: number;
  checklist_ck_id: number;
  label: string;
  description: string | null;
  value: 0 | 5 | 10;
  urut: number;
  checklist_urut: number;
  checklist_materi: string;
  komponen_ck_id: number;
}
```

State baru:

- `komponenCkRef`
- `checklistCkRef`
- `opsiCkRef`

Request baru:

- `GET /ckRef/getAllKomponen`
- `GET /ckRef/getAllChecklist`
- `GET /ckRef/getAllOpsi`

Menambahkan fungsi `getCkDictionary(): Promise<void>` yang mengambil ketiga endpoint CK secara paralel. Fungsi ini diekspos oleh context agar mutasi CRUD CK tidak perlu memanggil ulang seluruh dictionary PB, SPML, user, periode, dan unit.

`getDictionary()` tetap memuat CK pada initial load aplikasi sehingga referensi tersedia untuk worksheet CK pada tahap berikutnya.

## 3. Landing Referensi CK

Membuat `WorksheetCkGrid.tsx` dengan gaya visual yang sama seperti `WorksheetSpmlGrid`.

Isi kartu:

- Komponen CK -> section `12`;
- Checklist CK -> section `13`;
- Opsi CK -> section `14`.

Kartu ditampilkan setelah SPML dan sebelum bagian periode agar alur landing menjadi PB, SPML, CK, lalu pengaturan umum.

## 4. Integrasi WorksheetRefPage

Menambahkan tiga komponen ke `SELECT_SECTION`:

- index 12: `KomponenCkRef`;
- index 13: `ChecklistCkRef`;
- index 14: `OpsiCkRef`.

Menambahkan label ke `SECTION_NAME` dengan urutan yang sama:

- `Komponen CK`;
- `Checklist CK`;
- `Opsi CK`.

Tombol global `Add`, breadcrumb, dialog provider, serta mekanisme kembali ke landing tetap memakai komponen yang sudah ada.

## 5. UI Komponen CK

Tabel menampilkan:

- No;
- Urut;
- Nama Komponen;
- Alias;
- Detail;
- Action.

Modal tambah/edit berisi:

- Urut, wajib;
- Nama Komponen, wajib;
- Alias, opsional;
- Detail, opsional dan multiline.

Endpoint:

- `POST /ckRef/createKomponen`;
- `POST /ckRef/editKomponen`;
- `POST /ckRef/deleteKomponen` dengan body `{ id }`.

Delete memakai dialog konfirmasi. Jika komponen masih memiliki checklist aktif, pesan HTTP 409 dari backend ditampilkan pada snackbar.

## 6. UI Checklist CK

Tabel menampilkan:

- No/Urut;
- Komponen (`komponen_urut. komponen_title`);
- Materi;
- Kriteria Penilaian;
- Bukti Dukung;
- Action.

Teks panjang memakai wrap dan batas lebar agar tabel tetap dapat dibaca melalui `Scrollbar`.

Modal tambah/edit berisi:

- Komponen CK, wajib, dari `komponenCkRef`;
- Urut, integer positif;
- Materi, wajib;
- Kriteria Penilaian, wajib dan multiline;
- Bukti Dukung, opsional dan multiline.

Endpoint:

- `POST /ckRef/createChecklist`;
- `POST /ckRef/editChecklist`;
- `POST /ckRef/deleteChecklist` dengan body `{ id }`.

## 7. UI Opsi CK

Opsi dibuat sebagai section tersendiri agar CRUD-nya jelas dan tidak bergantung pada modal bertingkat.

Tabel menampilkan:

- Checklist;
- Urut opsi;
- Nilai;
- Label;
- Deskripsi;
- Action.

Modal tambah/edit berisi:

- Checklist CK, wajib;
- Urut opsi, integer positif;
- Nilai berupa select terbatas `10`, `5`, atau `0`;
- Label, wajib;
- Deskripsi, opsional dan multiline.

Endpoint:

- `POST /ckRef/createOpsi`;
- `POST /ckRef/editOpsi`;
- `POST /ckRef/deleteOpsi` dengan body `{ id }`.

Warna label nilai:

- 10: success;
- 5: warning;
- 0: error.

## 8. State Request dan Error

Setiap section mempunyai state lokal `isSubmitting` untuk:

- mencegah double submit;
- men-disable tombol simpan selama request;
- men-disable tombol delete selama proses terkait.

Setelah mutasi berhasil:

1. panggil `await getCkDictionary()`;
2. tutup modal bila relevan;
3. reset form;
4. tampilkan snackbar sukses.

Jika backend mengembalikan error, UI menampilkan `err.response.data.message`; fallback menggunakan pesan network error.

Form tidak mengirim `peraturan` karena backend mengambil regulasi dari token user.

## 9. Perilaku Modal

- Satu modal digunakan untuk mode tambah dan edit pada setiap section;
- nilai edit diisi dari row dictionary berdasarkan `editID`;
- menutup modal mereset `addState` dari parent;
- tombol Reset mengembalikan form tambah ke kosong atau form edit ke nilai dictionary terakhir;
- tombol simpan tidak aktif jika field wajib belum lengkap.

## 10. Verifikasi

### TypeScript dan build

- jalankan build frontend;
- jalankan lint terarah pada file CK dan `useDictionary` bila konfigurasi lint mendukung.

### Skenario UI

- kartu CK tampil pada landing referensi;
- navigasi ke tiga section memiliki breadcrumb dan tombol Add yang benar;
- data seed menampilkan 7 komponen, 15 checklist, dan 45 opsi;
- tambah/edit/delete pada setiap referensi mengirim payload sesuai kontrak backend;
- error duplikasi dan dependency delete ditampilkan dari backend;
- select checklist dan komponen menggunakan row aktif regulasi saat ini;
- setelah mutasi, hanya dictionary CK yang direfresh;
- section PB dan SPML tetap bekerja.

## 11. Batas Tahap Ini

- belum menambahkan CK pada menu Kertas Kerja pengguna;
- belum membuat landing/workspace pengisian CK;
- belum membuat junction, file, link, komentar, scoring, Excel, atau WebSocket CK;
- tidak mengubah backend dan database;
- tidak menambah activity log frontend.

Implementasi dimulai setelah rencana ini disetujui.
