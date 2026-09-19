# Rencana Penyamaan Desain Tombol Dokumen Kertas Kerja CK

## Tujuan

Menyamakan tampilan dan perilaku tombol upload file serta link file pada tabel Kertas Kerja CK dengan tombol dokumen pada Kertas Kerja SPML.

## Temuan

- Komponen CK saat ini menggunakan `IconButton`, sehingga bentuk, ukuran, warna, dan efek hover berbeda dengan modul lain.
- Komponen SPML menggunakan `StyledButton` berukuran kecil dengan sudut membulat.
- File yang belum tersedia ditampilkan sebagai tombol putih dengan ikon abu-abu.
- File yang sudah tersedia ditampilkan sebagai tombol berwarna `secondary`.
- Link yang belum tersedia menggunakan tombol putih, sedangkan link yang sudah tersedia menggunakan tombol `primary`.
- Tombol SPML memakai ikon duotone dan pembungkus `Tooltip`/`span` agar tooltip tetap bekerja saat tombol disabled.

## Perubahan

1. Memperbarui `FileActionsCK.tsx` agar menggunakan `StyledButton` dan `VisuallyHiddenInput` seperti implementasi SPML.
2. Menyamakan ikon dan warna berdasarkan status:
   - Upload baru: tombol putih, ikon `add-circle-bold` abu-abu.
   - File tersedia: tombol `secondary`, ikon `file-bold-duotone`.
   - Link kosong: tombol putih dengan ikon link abu-abu.
   - Link tersedia: tombol `primary` dengan ikon link putih.
3. Mempertahankan seluruh perilaku CK yang sudah ada, termasuk satu file per checklist, preview file, live-sync indicator/disable, serta pembatasan ketika periode ditutup.
4. Menambahkan atribut aksesibilitas dan tooltip yang sama dengan pola SPML.

## Verifikasi

- Menjalankan ESLint pada komponen yang diubah.
- Menjalankan production build frontend.
- Memastikan aksi upload, preview, dan link tetap memakai endpoint CK yang sudah tersedia.

## Ruang Lingkup

Perubahan hanya menyentuh presentasi tombol dan integrasi input file pada `FileActionsCK.tsx`; tidak diperlukan perubahan backend atau struktur data.
