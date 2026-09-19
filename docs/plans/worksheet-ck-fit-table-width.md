# Rencana Penyesuaian Lebar Tabel CK agar Fit Halaman

## Temuan

- Tabel CK memiliki `minWidth: 1300`, sehingga horizontal scroll dipaksakan ketika area konten lebih sempit dari 1300 px.
- Kolom Materi, Kriteria Penilaian, dan Dokumen mempunyai gabungan `minWidth` sebesar 830 px.
- Kolom nilai dan komentar juga menggunakan lebar pixel tetap.
- `ScoreSelectCK` memiliki `minWidth: 76`, yang masih sesuai untuk menampilkan nilai 0, 5, 10, dan N/A.

## Perubahan

1. Menghapus `minWidth: 1300` dan menggunakan `width: '100%'` serta `tableLayout: 'fixed'`.
2. Menambahkan `colgroup` agar tujuh kolom mendapat lebar proporsional:
   - No: 4%
   - Materi: 14%
   - Kriteria Penilaian: 27%
   - Dokumen: 27%
   - Nilai KPPN: 10%
   - Nilai Kanwil: 10%
   - Comment: 8%
3. Menghapus `minWidth` dan `maxWidth` pixel pada body cell agar tidak melawan lebar proporsional.
4. Menambahkan pemenggalan kata dan wrapping pada cell supaya teks panjang memperbesar tinggi row, bukan lebar tabel.
5. Merapatkan padding horizontal cell secukupnya agar select nilai dan tombol dokumen tetap muat.
6. Mempertahankan horizontal overflow sebagai pengaman pada viewport sangat kecil, tetapi pada layout desktop normal seluruh kolom akan fit tanpa scroll samping.

## Verifikasi

- Menjalankan ESLint pada tabel CK.
- Menjalankan production build frontend.
- Memastikan header, body, row komponen, dan footer tetap sejajar.
- Memastikan select nilai, tombol dokumen, komentar, sticky header, dan drawer navigation tetap berfungsi.
