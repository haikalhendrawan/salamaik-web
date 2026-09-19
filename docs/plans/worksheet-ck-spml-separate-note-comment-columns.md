# Rencana Pemisahan Kolom Catatan Kanwil dan Comment

## Tujuan

Mengubah tabel kertas kerja CK dan SPML agar textarea `kanwil_note` dan tombol komentar berada pada dua kolom yang berbeda:

1. **Catatan Kanwil** — berisi textarea catatan Kanwil.
2. **Comment** — berisi tombol komentar dan badge jumlah komentar yang sudah tersedia.

Perubahan ini hanya mengatur struktur dan layout UI. Mekanisme penyimpanan catatan, hak akses, periode tutup, komentar, dan live-sync tetap menggunakan implementasi yang sudah ada.

## Perubahan Tabel CK

- Jumlah kolom berubah dari 7 menjadi 8:
  - No
  - Materi
  - Kriteria Penilaian
  - Dokumen
  - Nilai KPPN
  - Nilai Kanwil
  - Catatan Kanwil
  - Comment
- Pindahkan `KanwilNoteCK` ke kolom **Catatan Kanwil**.
- Kolom **Comment** hanya berisi `CommentActionCK`.
- Sesuaikan `COLUMN_WIDTHS` agar total tetap 100% dan semua kolom tetap muat dalam halaman.
- Ubah `colSpan` row header komponen dan keadaan data kosong dari 7 menjadi 8.
- Footer tetap menempatkan skor pada kolom Nilai KPPN dan Nilai Kanwil:
  - label footer tetap `colSpan={4}`;
  - setelah dua cell skor, tambahkan dua cell kosong untuk Catatan Kanwil dan Comment.

## Perubahan Tabel SPML

- Jumlah kolom berubah dari 7 menjadi 8:
  - No
  - Aspek
  - Kegiatan
  - Nilai KPPN
  - Nilai Kanwil
  - Dokumen Dukung
  - Catatan Kanwil
  - Comment
- Tambahkan header **Catatan Kanwil** sebelum **Comment**.
- Pindahkan `KanwilNote` ke cell tersendiri.
- Kolom Comment hanya berisi `CommentAction`.
- Ubah `colSpan` pada row komponen dan subkomponen dari 7 menjadi 8.
- Footer tetap menempatkan skor pada kolom Nilai KPPN dan Nilai Kanwil:
  - label tetap `colSpan={3}`;
  - dua cell skor tidak berubah;
  - cell kosong setelah skor berubah dari `colSpan={2}` menjadi `colSpan={3}` untuk Dokumen, Catatan Kanwil, dan Comment.

## Perilaku yang Dipertahankan

- Textarea hanya dapat diedit oleh role Kanwil dan hanya selama periode dibuka.
- Catatan disimpan saat textarea kehilangan fokus.
- Draft yang sedang diketik tidak ditimpa oleh live refresh.
- User KPPN tetap dapat membaca catatan dalam keadaan disabled.
- Tombol komentar tetap dapat dibuka dan badge jumlah komentar tetap diperbarui.
- Ketika periode ditutup, komentar masih dapat dibaca tetapi operasi mutasi mengikuti aturan yang sudah ada.

## Pengujian

- Pastikan header dan setiap body row CK/SPML memiliki tepat delapan kolom efektif.
- Pastikan row komponen, row subkomponen, data kosong, dan footer tidak bergeser akibat perubahan `colSpan`.
- Pastikan tabel CK tetap fit dalam halaman tanpa horizontal scroll pada ukuran layar desktop yang sebelumnya didukung.
- Pastikan textarea hanya muncul di Catatan Kanwil dan tombol komentar hanya muncul di Comment.
- Pastikan penyimpanan catatan, badge komentar, pembatasan role, close period, dan live-sync tetap berfungsi.
- Jalankan TypeScript build dan lint frontend.

## Di Luar Ruang Lingkup

- Format export Excel CK/SPML tidak diubah karena permintaan ini khusus format tabel UI.
- Backend dan migrasi database tidak memerlukan perubahan tambahan.

