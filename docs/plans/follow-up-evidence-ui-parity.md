# Rencana: Samakan Kontrol Bukti Dukung Tindak Lanjut dengan Worksheet

## Tujuan

Mengurangi kepadatan tombol pada bagian bukti dukung menu tindak lanjut dan menyamakan interaksinya dengan kartu PB serta tabel CK/SPML pada menu worksheet.

## Perubahan UI

- Gunakan kembali komponen/pola visual worksheet yang sudah ada untuk tombol file, preview, dan popover link (dimensi, typography, spacing, warna, dan posisi harus sama), bukan Dialog/popover baru dengan styling berbeda.
- Jika komponen worksheet terikat langsung pada endpoint pengisian awal, refactor agar dapat menerima handler/adapter tindak lanjut tanpa mengubah tampilan dan perilaku halaman worksheet.
- Untuk setiap slot file yang sudah berisi, tampilkan hanya satu tombol file untuk membuka preview.
- Aksi hapus tersedia di dalam preview file, bukan sebagai tombol terpisah di samping setiap file.
- Tombol tambah hanya muncul untuk slot kosong berikutnya. Untuk PB, kapasitas tetap tiga file; untuk CK/SPML satu file. Untuk mengganti file, hapus file lama dari preview lalu tambahkan file pengganti.
- Link tetap diwakili satu tombol. Popover/dialog link menangani buka, edit, simpan, dan hapus.
- Pertahankan endpoint khusus tindak lanjut, validasi otorisasi dan periode, serta refresh data setelah aksi. Tidak ada perubahan backend kecuali dibutuhkan untuk membuat modal preview memakai endpoint hapus khusus.

## Kriteria penerimaan

- Tidak ada tombol edit/hapus terpisah yang ditampilkan berdampingan dengan setiap tombol file.
- Perilaku buka dan hapus file konsisten dengan preview worksheet.
- Setelah penghapusan, tombol tambah muncul dan unggahan berikutnya mengisi slot kosong yang benar.
- Kelola link tampil sebagai satu tombol dengan tindakan link di popover.
- Ukuran, typography, spacing, dan tampilan popover/preview sama dengan halaman worksheet untuk PB, CK, dan SPML.
- Aturan akses dan batas periode follow-up tetap ditegakkan.
