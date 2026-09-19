# Rencana Frontend Pengisian Kertas Kerja CK

## Tujuan

Membuat modul pengisian Kertas Kerja Capaian Kinerja (CK) berbentuk tabel seperti SPML, tetapi menggunakan struktur referensi CK yang hanya memiliki satu tingkat komponen dan checklist. Modul mencakup halaman pemilihan KPPN, workspace, pengisian nilai, bukti dukung, komentar, live synchronization, toolbar, export Excel, drawer navigasi, serta footer skor sementara.

## Interpretasi kolom

Permintaan menyebut enam kolom, tetapi daftar yang diberikan berjumlah tujuh. Implementasi akan memakai tujuh kolom berikut:

1. No
2. Materi
3. Kriteria Penilaian
4. Dokumen
5. Nilai KPPN
6. Nilai Kanwil
7. Comment

Komponen tidak menjadi kolom tersendiri. Setiap komponen dirender sebagai baris section yang di-merge (`colSpan=7`), kemudian checklist komponen tersebut ditampilkan di bawahnya.

## Struktur modul dan routing

Tambahkan modul baru `frontend/src/sections/worksheetCK` yang terdiri dari:

- `WorksheetCKLanding.tsx`;
- `WorksheetCKWorkspace.tsx`;
- `useWsCKJunction.tsx` beserta provider state;
- `useWsCKLiveSync.ts`;
- `types.ts`;
- folder komponen tabel, toolbar, drawer, dokumen, preview, link, nilai, dan komentar.

Tambahkan:

- `frontend/src/pages/WorksheetCKPage.tsx` sebagai pembungkus provider;
- route `/worksheet/ck` dan `/worksheet/ck/kppn`;
- item navigasi `CK` pada submenu Kertas Kerja.

Alur landing mengikuti SPML:

- user KPPN langsung diarahkan ke workspace miliknya;
- user Kanwil melihat kartu seluruh KPPN dan memilih worksheet yang akan dibuka;
- kartu menampilkan progress pengisian KPPN dan Kanwil.

## Tambahan backend ringan untuk landing

Untuk menghindari satu request junction per KPPN, tambahkan endpoint agregat read-only:

- `GET /wsCKJunction/getProgressAllKPPN`
- role `99, 4, 3`;
- menggunakan periode pada token;
- response per KPPN berisi identitas worksheet/KPPN, jumlah checklist, jumlah yang sudah diisi KPPN, dan jumlah yang sudah diisi Kanwil;
- endpoint ini tidak menghitung skor CK dan tidak memakai scoring engine.

Checklist dianggap selesai bila skor pihak terkait tidak `NULL`; data N/A juga terhitung selesai karena backend menyimpan skor `10` dan `excluded = 1`.

## State dan pengambilan data

`WsCKJunctionProvider` menyimpan:

- `wsCKJunction`;
- detail master worksheet untuk tanggal penutupan;
- `lastRefreshedAt`;
- perubahan live terakhir;
- status sinkronisasi per `junctionId` dan jenis perubahan.

Provider memanggil endpoint CK yang telah tersedia:

- KPPN: `/wsCKJunction/getWsCKJunctionByWorksheetForKPPN`;
- Kanwil: `/wsCKJunction/getWsCKJunctionByWorksheetForKanwil?kppn=...`;
- detail periode: `/getWorksheetByPeriodAndKPPN/:kppnId`.

Initial load memakai loading overlay. Refetch akibat WebSocket atau sesudah mutasi dilakukan tanpa overlay agar halaman tidak terasa freeze. Hanya kontrol pada junction terkait yang dinonaktifkan sementara.

## Tabel CK

`WorksheetCKTable` menggunakan sticky header dan pengelompokan berdasarkan data komponen dari response junction.

Setiap baris checklist:

- mempunyai id DOM `ck-checklist-{junctionId}` untuk navigasi drawer;
- `No` menampilkan `checklist_urut`;
- `Materi` menampilkan materi checklist;
- `Kriteria Penilaian` menampilkan header `kriteria_penilaian`, lalu mapping `opsi` aktif berdasarkan urut;
- setiap opsi menampilkan nilai, label, dan description, misalnya `Nilai 10 – Hijau: ...`;
- `Dokumen` menampilkan teks `bukti_dukung`, lalu tombol file server dan link bukti dukung;
- kolom nilai memakai select dinamis berdasarkan `opsi`, ditambah pilihan `N/A`;
- kolom Comment memakai icon dengan badge jumlah komentar.

Baris section komponen memakai format `{urut}. {title}` dan warna section netral seperti tabel/export CK.

## Nilai KPPN dan Kanwil

Komponen `ScoreSelectCK`:

- membangun opsi `0`, `5`, dan `10` dari `junction.opsi`, bukan hard-coded dari `kriteria_penilaian`;
- menambahkan `N/A` setelah opsi referensi;
- jika `excluded === 1`, kedua select menampilkan `N/A`;
- N/A mengirim `excluded: 1` dan skor `10` melalui event CK;
- nilai biasa mengirim `excluded: 0` dengan skor opsi yang dipilih;
- user KPPN hanya dapat mengubah Nilai KPPN;
- user Kanwil hanya dapat mengubah Nilai Kanwil;
- kontrol dinonaktifkan selama penyimpanan, live refetch pada junction yang sama, atau periode sudah ditutup.

Event yang digunakan:

- `updateCKKPPNScore` dengan `kppnScore`;
- `updateCKKanwilScore` dengan `kanwilScore`.

## Dokumen

Komponen dokumen mengikuti pengalaman SPML:

- teks penjelasan berasal dari `bukti_dukung`;
- hanya satu `file_1` boleh tersimpan;
- tombol upload tidak muncul lagi setelah file tersedia; file harus dihapus sebelum upload baru;
- upload memakai `POST /wsCKJunction/editWsCKJunctionFile` dan field multipart `wsCKJunctionFile`;
- preview file server memakai URL `/worksheet/{file_1}`;
- link dapat ditambah, dibuka, diedit, dan dihapus melalui `updateCKLinkFile`;
- file dihapus melalui `deleteWsCKJunctionFile`;
- KPPN dan Kanwil dapat mengelola file/link selama periode terbuka;
- aksi dokumen hanya menonaktifkan kontrol junction terkait, bukan seluruh halaman.

## Komentar

Buat popover komentar CK dengan pola SPML:

- badge menggunakan `comment_count`;
- membaca `/comment/getByWsCKJunctionId/:junctionId`;
- menambah melalui `/comment/addCK`;
- menghapus melalui endpoint bersama `/comment/deleteById`;
- hanya pembuat komentar dapat menghapus komentarnya;
- setelah periode tutup, komentar masih dapat dibaca tetapi tambah/hapus dinonaktifkan;
- popover terbuka melakukan refresh ketika menerima event komentar untuk junction yang sama.

## Live synchronization

`useWsCKLiveSync` akan:

- join/leave room melalui `joinCKWorksheet` dan `leaveCKWorksheet`;
- mendengarkan `ckWorksheetChanged`;
- menggabungkan event berdekatan dengan debounce;
- melakukan silent refetch;
- menandai junction dan kontrol yang sedang disinkronkan;
- memperbarui `lastRefreshedAt` tanpa menampilkan loading overlay global.

## Toolbar

Toolbar CK mengikuti tampilan SPML dan menampilkan:

- Progress KPPN: `jumlah diisi/total (persen)`;
- Progress Kanwil: `jumlah diisi/total (persen)`;
- Refresh Terakhir;
- tombol export Excel dengan hover dan pointer yang konsisten dengan aplikasi.

Progress dihitung dari junction yang sudah dimuat, tanpa menunggu implementasi scoring engine CK.

## Drawer navigasi

Drawer kanan mengikuti drawer SPML:

- tombol pembuka menempel pada sisi kanan halaman;
- tombol penutup menempel di sisi kiri drawer;
- data dikelompokkan per komponen;
- setiap checklist mempunyai kotak bernomor sesuai `checklist_urut`;
- pink: belum diisi;
- warning: sudah diisi tetapi nilainya belum mencapai nilai maksimum pada opsi;
- success: nilai maksimum atau N/A;
- klik kotak menutup drawer dan scroll ke checklist terkait.

Status drawer mengikuti kolom nilai yang relevan dengan role user saat ini.

## Footer skor sementara

Tambahkan satu row footer:

- label `Nilai Kertas Kerja CK` memakai `colSpan=4`;
- sel Nilai KPPN menampilkan `-`;
- sel Nilai Kanwil menampilkan `-`;
- sel Comment kosong.

Footer belum memanggil scoring engine. Kontrak komponen dibuat sederhana agar nilai server dapat ditambahkan kemudian tanpa merombak tabel.

## Export Excel

Buat `frontend/src/sections/excel/useExcelWorksheetCK.ts` menggunakan ExcelJS dengan dua sheet:

- `Nilai Versi Kanwil`;
- `Nilai Versi KPPN`.

Struktur awal export:

- section komponen berupa merged row;
- kolom No, Materi, Kriteria Penilaian, Bukti Dukung, Link Bukti Dukung, dan Nilai;
- Kriteria Penilaian menggabungkan header dan daftar opsi pada baris-baris terpisah;
- Nilai berisi `0`, `5`, `10`, `N/A`, atau kosong;
- file server dan link eksternal dimasukkan pada kolom link dengan text wrap dan pemisah baris;
- seluruh area memiliki border, wrap text, alignment, dan tinggi baris yang dioptimalkan;
- footer `Nilai Kertas Kerja CK` tetap dibuat tetapi nilainya dikosongkan.

File `docs/kertas_kerja_ck.xlsx` telah tersedia dan diperiksa sebelum implementasi. Export mengikuti header dua tingkat, tujuh kolom, merged header nilai/nilai konversi, section komponen, border, wrapping, warna abu-abu/putih, dan footer pada workbook tersebut.

## Penutupan periode

Gunakan `close_period` dari worksheet master. Setelah melewati tanggal tersebut:

- select nilai disabled;
- upload/hapus file disabled;
- tambah/edit/hapus link disabled;
- tambah/hapus komentar disabled;
- preview dokumen dan membaca komentar tetap tersedia.

## Konsistensi seed

Seed saat ini masih membentuk `kriteria_penilaian` dengan teks nilai dan deskripsi opsi. Karena konvensi terbaru menyimpan header saja dan detail berasal dari `opsi_ck_ref`, sesuaikan `sql/02_seed_worksheet_ck_references.sql` agar future seeding tidak mengembalikan format lama.

## Verifikasi

1. Jalankan lint pada seluruh file CK yang baru/diubah.
2. Jalankan build frontend.
3. Jalankan build dan test backend bila endpoint progress ditambahkan.
4. Uji secara manual:
   - akses KPPN dan Kanwil;
   - pilihan `0/5/10/N/A`;
   - upload, preview, hapus file, dan link;
   - tambah/hapus komentar;
   - dua browser menerima perubahan live tanpa overlay;
   - drawer scroll ke row yang benar;
   - seluruh aksi terkunci setelah periode tutup;
   - workbook berisi dua sheet dan seluruh cell terformat dengan baik.
