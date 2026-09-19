# Rencana Perubahan Tampilan Toolbar SPML

## Tujuan

Mengubah toolbar informasi pada `WorksheetSPMLWorkspace` agar menyatu dengan background aplikasi dan tidak memenuhi lebar halaman.

## Perubahan

- Mengganti root `Card`/`CardContent` pada `WorksheetSPMLToolbar` dengan container `Box` tanpa warna background, border, atau elevation.
- Membatasi lebar toolbar sekitar `40%` pada layar desktop.
- Mempertahankan margin horizontal yang sejajar dengan Card tabel.
- Menggunakan lebar responsif agar toolbar tetap terbaca:
  - layar kecil: `100%` dikurangi margin halaman;
  - layar menengah: sekitar `60%`;
  - layar desktop: `40%`.
- Mempertahankan tiga row, progress bar, tooltip, nilai progress, dan tombol Excel tanpa perubahan fungsional.

## Verifikasi

- Menjalankan lint pada `WorksheetSPMLToolbar.tsx`.
- Menjalankan build frontend.

## Batas Perubahan

- Tidak mengubah perhitungan progress.
- Tidak mengubah fungsi export.
- Tidak mengubah layout tabel atau backend.
- Implementasi dimulai setelah rencana disetujui.
