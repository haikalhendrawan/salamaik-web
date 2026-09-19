# Rencana Perubahan Junction ID CK dari BIGSERIAL ke SERIAL

## Tujuan

Mengubah `worksheet_ck_junction.junction_id` menjadi integer berbasis `SERIAL` agar nilai yang dikembalikan PostgreSQL diterima sebagai JavaScript `number` dan konsisten dengan kontrak frontend/backend CK saat ini.

## Perubahan Database

1. Mengubah definisi instalasi baru pada `01_create_worksheet_ck_tables.sql`:
   - `worksheet_ck_junction.junction_id`: `BIGSERIAL` menjadi `SERIAL`.
   - `comment_data.ws_ck_junction_id`: `BIGINT` menjadi `INTEGER`.
2. Menambahkan migration baru untuk database yang sudah berjalan:
   - Memastikan nilai `junction_id` dan `ws_ck_junction_id` tidak melewati batas `INTEGER` (`2147483647`).
   - Mengubah kolom junction dan kolom referensi komentar menjadi `INTEGER` dalam satu transaksi.
   - Menyesuaikan sequence junction menjadi sequence integer dan menyelaraskan nilainya dengan ID terbesar saat ini.
   - Menangani foreign key CK pada `comment_data` selama perubahan tipe, lalu memasangnya kembali.
3. Migration tidak menghapus data dan akan gagal dengan pesan yang jelas apabila terdapat ID di luar rentang integer.

## Penyesuaian Kode

1. Mempertahankan tipe `junction_id`/`junctionId` sebagai `number` pada frontend dan backend.
2. Mempertahankan validasi integer positif pada event Socket.IO.
3. Menormalisasi hasil/payload pada batas API bila diperlukan agar data lama atau response cache tidak mengirim string.
4. Menghapus `console.log(data)` yang tertinggal pada event perubahan skor CK.

## Verifikasi

- Memastikan SQL migration dapat dijalankan secara transaksional.
- Menjalankan backend build dan seluruh backend test.
- Menjalankan ESLint serta production build frontend.
- Memeriksa alur score, upload file, link file, delete file, komentar, drawer, dan live-sync menggunakan `junctionId` bertipe number.

## Catatan

`SERIAL` memiliki batas maksimal sekitar 2,1 miliar ID. Batas ini dinilai mencukupi untuk jumlah baris junction Kertas Kerja CK, tetapi migration tetap memasang pemeriksaan agar konversi tidak menyebabkan overflow.
