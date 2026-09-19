# Rencana Penambahan Catatan Kanwil pada Kertas Kerja CK dan SPML

## Tujuan

Menampilkan dan mengelola `kanwil_note` pada setiap checklist kertas kerja CK dan SPML melalui kolom **Comment**. Catatan hanya dapat diubah oleh user Kanwil selama periode kertas kerja masih dibuka. Tombol komentar yang sudah tersedia tetap ditampilkan di bawah editor catatan dan tetap menggunakan mekanisme komentar yang ada.

## Kondisi Kode Saat Ini

- Kertas kerja PB sudah memiliki pola editor `kanwil_note`: nilai ditampilkan dalam textarea, disimpan saat textarea kehilangan fokus, dan pengeditan dibatasi untuk Kanwil serta periode yang masih dibuka.
- Tabel `worksheet_ck_junction` sudah memiliki kolom nullable `kanwil_note TEXT` pada migrasi awal.
- Model, tipe frontend, serta websocket CK sudah mendukung `kanwil_note` melalui event `updateCKKanwilNote` dan live-sync bertipe `note`. CK hanya memerlukan integrasi komponen UI dan pengujian alur yang sudah tersedia.
- Tabel/model/tipe/event SPML belum mendukung `kanwil_note`.
- Kolom Comment CK dan SPML saat ini hanya berisi tombol pembuka popover komentar.

## Perubahan yang Direncanakan

### 1. Migrasi database

Buat migrasi baru yang memastikan kedua junction memiliki kolom catatan Kanwil:

```sql
ALTER TABLE worksheet_ck_junction
  ADD COLUMN IF NOT EXISTS kanwil_note TEXT;

ALTER TABLE worksheet_spml_junction
  ADD COLUMN IF NOT EXISTS kanwil_note TEXT;
```

Penggunaan `IF NOT EXISTS` menjaga migrasi aman pada database yang sudah memiliki kolom CK. Kolom tetap nullable dan tidak diberi constraint tambahan agar konsisten dengan kertas kerja PB.

Assignment worksheet tidak memerlukan perubahan nilai insert karena record baru otomatis memperoleh `NULL`.

### 2. Dukungan backend SPML

Perbarui `wsSPMLJunction.model.ts` untuk:

- menambahkan `kanwil_note` pada interface junction;
- menambahkan method update catatan berdasarkan pasangan `junction_id` dan `worksheet_id`;
- mengisi `last_update` dan `updated_by` pada saat penyimpanan;
- mengembalikan record hasil update agar frontend dapat memvalidasi keberhasilan operasi.

Perbarui `wsSPMLJunctionEvent.ts` dengan event `updateSPMLKanwilNote`:

- memvalidasi `worksheetId`, integer `junctionId`, dan catatan string dengan batas panjang yang sama seperti CK (maksimal 5.000 karakter);
- mengubah string kosong/whitespace menjadi `NULL`;
- memastikan junction berada pada worksheet yang diminta;
- membatasi mutasi hanya untuk role Kanwil (`99`, `4`, dan `3`), bukan sekadar berdasarkan panjang kode KPPN;
- mempertahankan pengecekan akses worksheet;
- mencatat activity log;
- mengirim event khusus perubahan catatan serta event generik `spmlWorksheetChanged` dengan `changeType: 'note'` ke room worksheet supaya user lain memperoleh perubahan secara live.

Endpoint HTTP baru tidak diperlukan untuk alur UI karena CK/SPML sudah memakai Socket.IO untuk mutasi nilai/link/note. Pembacaan `kanwil_note` otomatis ikut dalam query junction karena query menggunakan `worksheet_*_junction.*`.

### 3. Pengetatan otorisasi CK

Gunakan dukungan backend CK yang sudah tersedia dan verifikasi bahwa event `updateCKKanwilNote` tetap:

- hanya menerima role Kanwil (`99`, `4`, `3`);
- memvalidasi kepemilikan/akses worksheet;
- menormalisasi catatan kosong menjadi `NULL`;
- mengirim `ckWorksheetChanged` dengan tipe `note`.

Tidak dibuat method atau endpoint CK duplikat. Perubahan dilakukan hanya jika hasil verifikasi menemukan ketidakkonsistenan dengan aturan di atas.

### 4. Tipe data dan live sync frontend SPML

Perbarui tipe frontend SPML:

- tambahkan `kanwil_note: string | null` pada `WsSPMLJunctionType`;
- tambahkan `'note'` pada `SPMLChangeType`.

Dengan perubahan tersebut, `useWsSPMLLiveSync` dapat melakukan silent refresh saat catatan diedit user lain. Target sinkronisasi hanya checklist dan tipe `note` terkait, sehingga tidak memunculkan loading overlay dan tidak memblokir kontrol lain pada tabel.

### 5. Komponen editor catatan Kanwil

Buat komponen textarea terpisah untuk CK dan SPML atau satu komponen generik bertipe kuat jika dependensinya cukup seragam. Komponen akan:

- menampilkan nilai `kanwil_note` terbaru;
- menggunakan ukuran teks 12px agar konsisten dengan tabel SPML/CK;
- menyediakan multiline textarea yang ringkas di dalam cell;
- menyimpan perubahan pada `onBlur`, mengikuti perilaku PB dan menghindari event websocket pada setiap ketikan;
- tidak mengirim request bila isi tidak berubah;
- menonaktifkan editor saat user bukan Kanwil, periode sudah ditutup, operasi lokal sedang disimpan, atau checklist sedang menerima live-sync bertipe `note`;
- tetap menampilkan isi catatan secara read-only kepada user KPPN;
- memperbarui nilai tersimpan setelah callback sukses dan menampilkan snackbar ketika koneksi/penyimpanan gagal;
- menyelaraskan local draft hanya ketika data server berubah dan field tidak sedang aktif, sehingga refresh websocket tidak menutup editor atau menimpa teks yang sedang diketik.

### 6. Integrasi pada tabel CK dan SPML

Pada setiap cell kolom **Comment**, ubah susunannya menjadi vertikal:

1. textarea `kanwil_note`;
2. tombol komentar beserta badge jumlah komentar yang sudah tersedia.

Tombol komentar tidak diganti dan aturan akses komentar tetap seperti sekarang. Hanya editor `kanwil_note` yang eksklusif untuk Kanwil.

Lebar kolom Comment dan tinggi textarea akan disesuaikan secukupnya agar editor dapat digunakan tanpa membuat tabel melebar keluar halaman. Footer dan `colSpan` tidak berubah karena jumlah kolom tetap sama.

### 7. Periode ditutup

- Textarea catatan dinonaktifkan ketika `isPastDue` bernilai benar.
- Tombol komentar tetap dapat dibuka untuk membaca komentar, tetapi operasi tambah/hapus mengikuti aturan periode tertutup yang sudah berlaku.
- Backend tetap menjadi lapisan otorisasi role; pembatasan periode yang saat ini bersifat UI mengikuti pola CK/SPML yang sudah ada. Jika dibutuhkan validasi periode juga pada server, itu sebaiknya menjadi hardening terpisah dan diterapkan konsisten ke seluruh mutasi worksheet.

## Alur Data

1. Query junction mengirim `kanwil_note` bersama data checklist.
2. Textarea menggunakan nilai tersebut sebagai nilai awal.
3. Kanwil mengubah catatan dan keluar dari textarea.
4. Frontend mengirim event `updateCKKanwilNote` atau `updateSPMLKanwilNote`.
5. Backend memvalidasi role dan junction, menyimpan catatan, lalu membalas callback.
6. Backend menyiarkan event perubahan ke user lain dalam room worksheet.
7. Client lain melakukan silent refresh untuk checklist terkait; textarea catatan dinonaktifkan sementara tanpa loading overlay global.

## Pengujian

### Backend

- penyimpanan catatan CK dan SPML berhasil untuk role Kanwil;
- role KPPN ditolak walaupun mengirim event secara manual;
- junction/worksheet yang tidak cocok ditolak;
- catatan lebih dari 5.000 karakter ditolak;
- string kosong disimpan sebagai `NULL`;
- event live-sync `note` dipancarkan ke room yang benar;
- `last_update` dan `updated_by` ikut berubah.

### Frontend

- catatan awal tampil pada row yang sesuai;
- Kanwil dapat mengedit dan penyimpanan hanya terjadi saat blur serta saat nilai berubah;
- KPPN dapat membaca tetapi tidak dapat mengedit;
- editor dinonaktifkan setelah close period;
- tombol komentar dan badge tetap berada di bawah textarea serta tetap berfungsi;
- perubahan dari browser/user lain muncul tanpa overlay global;
- refresh live tidak menghilangkan draft yang sedang diketik;
- TypeScript build dan lint/test terkait CK/SPML berhasil.

## Di Luar Ruang Lingkup

- Menambahkan `kanwil_note` ke export Excel tidak termasuk perubahan ini karena format export tidak diminta.
- Mengubah isi, model, atau hak akses komentar yang sudah ada tidak termasuk perubahan ini.
- Menambahkan `kppn_note` pada SPML tidak termasuk perubahan ini.

