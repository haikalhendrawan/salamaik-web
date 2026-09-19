# Rencana Penyesuaian Lebar Kolom Tabel SPML

## Tujuan

Memperbesar kolom **Catatan Kanwil** dan mengurangi lebar kolom **Kegiatan** pada tabel kertas kerja SPML tanpa menambah horizontal scroll pada tampilan desktop.

## Kondisi Saat Ini

Tabel SPML belum memiliki `colgroup` atau pembagian lebar kolom yang eksplisit. Browser menentukan lebar berdasarkan isi cell, sehingga teks Kegiatan yang panjang mengambil ruang lebih besar dan textarea Catatan Kanwil menjadi sempit.

## Perubahan

- Tambahkan konfigurasi lebar untuk delapan kolom dengan total 100%:
  - No: 4%
  - Aspek: 13%
  - Kegiatan: 24%
  - Nilai KPPN: 9%
  - Nilai Kanwil: 9%
  - Dokumen Dukung: 15%
  - Catatan Kanwil: 20%
  - Comment: 6%
- Render pembagian tersebut melalui `colgroup` agar header dan body mengikuti ukuran yang sama.
- Gunakan `tableLayout: 'fixed'` dan `width: '100%'` supaya persentase diterapkan secara konsisten.
- Pertahankan text wrapping pada isi Kegiatan, Dokumen, dan Catatan Kanwil sehingga konten panjang turun ke baris berikutnya, bukan memperlebar tabel.
- Tidak mengubah urutan kolom, `rowSpan`, `colSpan`, footer, penyimpanan catatan, atau fungsi komentar.

## Verifikasi

- Catatan Kanwil memperoleh ruang yang terlihat lebih besar daripada sebelumnya.
- Kegiatan menjadi lebih sempit tetapi seluruh teks tetap terbaca melalui wrapping.
- Select nilai dan tombol Comment tidak terpotong.
- Tabel tetap berada dalam lebar container pada layar desktop.
- Jalankan lint dan production build frontend.

