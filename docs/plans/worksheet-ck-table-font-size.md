# Rencana Penyamaan Ukuran Teks Tabel CK dengan SPML

## Temuan

- Cell isi tabel CK dan SPML sama-sama menggunakan ukuran dasar 12 px.
- Beberapa teks CK dibungkus oleh `Typography variant="body2"`, sehingga ukuran font tema menimpa ukuran 12 px dari parent cell.
- Bagian yang terdampak terutama judul kriteria penilaian dan teks bukti dukung.
- Opsi kriteria, row komponen, dan select nilai CK sudah menggunakan ukuran 12 px.
- Header tabel SPML tetap menggunakan ukuran standar komponen tabel, sehingga header CK tidak perlu diperkecil secara terpisah.

## Perubahan

1. Menetapkan `fontSize={12}` secara eksplisit pada judul kriteria penilaian CK.
2. Menetapkan `fontSize="12px"` pada teks bukti dukung di `FileActionsCK` seperti implementasi SPML.
3. Menetapkan ukuran 12 px pada pesan tabel kosong agar konsisten dengan body tabel.
4. Mempertahankan ukuran header, tombol aksi, ikon, dan popover karena bukan bagian tipografi isi tabel.

## Verifikasi

- Menjalankan ESLint pada komponen tabel CK yang berubah.
- Menjalankan production build frontend.
- Memastikan tidak ada perubahan pada fungsi skor, file, link, komentar, dan live-sync.
