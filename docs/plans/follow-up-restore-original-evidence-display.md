# Rencana: Pulihkan Tampilan Bukti Dukung Asli pada Detail Tindak Lanjut

## Tujuan

Pada detail tindak lanjut, tampilkan kembali file bukti dukung yang tersimpan pada junction worksheet sumber (file 1–3), seperti tampilan `FollowUpCard` awal. Link file dari junction ditampilkan pada bagian **Bukti Dukung** yang sama. Jangan pisahkan bukti menjadi kategori awal dan tindak lanjut.

## Perubahan

1. Gunakan kembali `ws_junction.file_1`, `file_2`, `file_3`, dan `link_file` untuk isi bagian Bukti Dukung.
2. Pertahankan tombol buka/tambah file seperti perilaku `FollowUpCard` awal, dengan kontrol edit mengikuti aturan periode dan ketersediaan endpoint untuk tipe worksheet.
3. Sediakan buka/edit/hapus link di bagian yang sama dengan mekanisme yang sesuai untuk PB, CK, dan SPML.
4. Jangan ubah data temuan, skor, tanggapan, approval, atau aturan backend selain bila endpoint link/file per tipe memang diperlukan.

## Verifikasi

- File junction yang sudah ada muncul di detail PB/CK/SPML.
- Link junction yang sudah ada dapat dibuka dan tampil pada area Bukti Dukung yang sama.
- Tombol tambah file/link mengikuti periode dan izin yang berlaku.
- Detail Peraturan 1 dan alur tindak lanjut lainnya tidak berubah.
- Jalankan pemeriksaan TypeScript frontend.
