# Rencana Perbaikan Upload PDF dan Popover Link CK

## Temuan

### Upload PDF

- Nama multipart field sudah sesuai: frontend dan Multer sama-sama menggunakan `wsCKJunctionFile`.
- Batas ukuran CK menggunakan batas worksheet sebesar 20 MB.
- CK memakai `wsJunctionFileFilter`, yang hanya menerima MIME PDF apabila nilainya tepat `application/pdf`.
- Beberapa browser/perangkat dapat mengirim PDF dengan MIME kompatibel lain. Saat ditolak, filter memanggil `callback(null, false)`, sehingga controller hanya menerima `req.file` kosong dan menampilkan pesan umum `File type is not allowed`.

### Popover link

- Popover CK saat ini memiliki lebar, ukuran teks, susunan tombol, warna tombol edit, ikon, dan form input yang berbeda dari popover link SPML/PB.
- Fungsionalitas CK sudah memakai refresh tanpa overlay dan status live-sync; perilaku ini perlu dipertahankan.

## Perubahan Backend

1. Membuat filter upload khusus CK atau memperjelas utilitas filter bersama agar PDF kompatibel dapat dikenali tanpa membuka penerimaan semua MIME secara bebas.
2. Mendukung MIME PDF standar dan alias PDF yang umum digunakan.
3. Memastikan ekstensi file CK tetap disimpan sebagai `.pdf` untuk MIME PDF yang diterima.
4. Mengubah penolakan file menjadi error eksplisit dari Multer yang memuat jenis MIME yang diterima, sehingga tidak lagi diterjemahkan sebagai `req.file` kosong tanpa konteks.
5. Mempertahankan batas 20 MB serta daftar file worksheet lain yang sudah diperbolehkan.

## Perubahan Frontend

1. Menyamakan `LinkFilePopoverCK` dengan tampilan `LinkFilePopover` SPML:
   - Lebar 300 px, radius 8 px, dan spacing yang sama.
   - Judul 13 px dan tampilan URL 11 px dengan pemotongan kata.
   - Tombol Buka, Edit, dan Hapus memakai ikon serta warna yang sama.
   - Input multiline 4–6 baris dengan tombol Batal dan Simpan.
   - Tooltip pada setiap aksi.
2. Mempertahankan endpoint/event CK, refresh tanpa overlay, validasi panjang link, live-sync, dan pembatasan edit ketika periode ditutup.
3. Memperbaiki pembacaan error upload Axios agar pesan backend ditampilkan pada snackbar, bukan hanya pesan generik client.

## Verifikasi

- Menambahkan atau menyesuaikan test untuk filter PDF CK dan penolakan tipe file lain.
- Menjalankan backend build dan seluruh backend test.
- Menjalankan ESLint serta production build frontend.
- Memastikan PDF, JPEG, PNG, ZIP, dan RAR tetap mengikuti aturan upload yang ditentukan.

## Ruang Lingkup

Tidak ada perubahan skema database. Perubahan terbatas pada konfigurasi upload/controller CK dan UI popover link CK.
