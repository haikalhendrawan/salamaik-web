# Rencana Perbaikan Tombol Excel Toolbar SPML

## Penyebab

Tombol Excel pada `WorksheetSPMLToolbar` menggunakan properti `disabled`. Kondisi disabled dari MUI menghilangkan cursor pointer dan efek hover, sehingga tampil berbeda dari tombol Excel lain di aplikasi.

## Perubahan

- Menghapus properti `disabled` dari `IconButton`.
- Menghapus wrapper `span` yang sebelumnya hanya diperlukan agar tooltip dapat bekerja pada tombol disabled.
- Mengikuti pola tombol Excel lain di aplikasi: `Tooltip` langsung membungkus `IconButton` yang aktif.
- Menambahkan handler klik placeholder agar tombol tetap bersifat interaktif selama fungsi export SPML belum diimplementasikan.
- Mempertahankan ikon `vscode-icons:file-type-excel` dan label aksesibel.

## Hasil

- Cursor berubah menjadi pointer ketika diarahkan ke tombol.
- Efek hover/ripple MUI kembali terlihat.
- Tooltip tetap tampil.
- Belum ada proses pembuatan file Excel pada perubahan ini.

## Verifikasi

- Menjalankan lint pada `WorksheetSPMLToolbar.tsx`.
- Menjalankan build frontend.

Implementasi dimulai setelah rencana disetujui.
