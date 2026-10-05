# Sinkronisasi Nilai Tindak Lanjut ke Junction Kertas Kerja

## Tujuan

Saat nilai KPPN atau Kanwil pada menu Tindak Lanjut Peraturan 2 diubah, simpan nilai tersebut pada `findings_data` sekaligus perbarui kolom skor yang sesuai pada junction PB, CK, atau SPML. Dengan begitu, worksheet asli dan scoring engine membaca skor terbaru, sementara data temuan tetap menyimpan konteks tindak lanjut.

## Kondisi Saat Ini

- UI Tindak Lanjut mengirim perubahan skor ke endpoint `updateFindingsScore`.
- Untuk temuan Peraturan 2 (`matrix_id IS NULL`), controller memanggil `updateRegulation2FollowUpScore`.
- Model hanya memperbarui `findings_data.follow_up_kppn_score` atau `findings_data.score_after`.
- Query tampilan Tindak Lanjut meng-overlay skor dari findings ke data junction, sehingga nilai terlihat berubah di Tindak Lanjut tetapi junction sumber tidak berubah. Worksheet asli dan scoring engine karena itu masih membaca nilai lama.
- Jalur Peraturan 1 sudah mengubah junction melalui event worksheet; perubahan ini akan menyamakan hasil akhirnya untuk Peraturan 2 tanpa mengubah kontrak perilaku Peraturan 1.

## Rencana Perubahan

1. **Perluas update model Peraturan 2**
   - Ambil temuan beserta `worksheet_type`, `worksheet_id`, dan ID junction sumber yang sesuai.
   - Validasi junction sumber berada di worksheet yang sama dengan temuan.
   - Dalam satu transaksi database, perbarui skor pada junction yang benar (`worksheet_junction`, `worksheet_ck_junction`, atau `worksheet_spml_junction`) dan kolom tindak lanjut yang sesuai di `findings_data`.
   - Untuk sisi KPPN, perbarui `kppn_score` dan `follow_up_kppn_score`; untuk sisi Kanwil, perbarui `kanwil_score` dan `score_after`.
   - Pertahankan `initial_kppn_score`, `score_before`, dan snapshot/nilai awal lainnya agar histori sebelum tindak lanjut tidak tertimpa.
   - Jika salah satu update gagal atau junction tidak ditemukan, rollback seluruh transaksi dan kembalikan error yang jelas.

2. **Pertahankan aturan validasi yang ada**
   - Tetap validasi hak akses unit, peran user, periode tindak lanjut, serta batas skor sesuai jenis kertas kerja.
   - Pertahankan perlakuan N/A/excluded yang berlaku pada masing-masing worksheet; update satu sisi tidak boleh tanpa sengaja mengubah sisi lain.

3. **Sinkronisasi UI dan live update**
   - Endpoint mengembalikan skor tersimpan agar komponen Tindak Lanjut dapat menampilkan nilai final dari server.
   - Setelah penyimpanan berhasil, broadcast perubahan junction ke ruang worksheet terkait (PB/CK/SPML), atau gunakan mekanisme live-sync yang sudah ada, agar user lain melihat pembaruan tanpa refresh penuh.
   - Pastikan pembaruan dari user sendiri tidak menyebabkan nilai terduplikasi atau tertimpa oleh event lama.

4. **Verifikasi dampak scoring**
   - Pastikan endpoint scoring PB/CK/SPML membaca skor junction terbaru tanpa perubahan formula.
   - Pastikan nilai di menu worksheet asli, Tindak Lanjut, dan hasil scoring konsisten setelah update.
   - Nilai awal temuan tetap tersedia untuk informasi histori sebelum tindak lanjut.

## Pengujian

- Unit test model untuk masing-masing jenis worksheet dan sisi KPPN/Kanwil.
- Uji rollback: paksa update findings gagal setelah update junction dan pastikan junction tidak berubah sebagian.
- Uji validasi junction/worksheet mismatch dan temuan/junction tidak ditemukan.
- Uji batas skor, role/unit, periode, serta skor `null` jika memang diizinkan oleh aturan yang berlaku.
- Uji integrasi: ubah nilai di Tindak Lanjut, periksa nilai junction, worksheet asli, `findings_data`, dan hasil scoring engine.
- Uji live update pada dua sesi browser untuk PB, CK, dan SPML.

## Di Luar Cakupan

- Tidak mengubah rumus scoring engine.
- Tidak mengubah mekanisme posting/sinkronisasi temuan ke matriks.
- Tidak mengubah perilaku temuan Peraturan 1 kecuali diperlukan untuk memakai helper transaksi bersama tanpa perubahan perilaku.

## Kriteria Selesai

Perubahan skor Peraturan 2 pada Tindak Lanjut tersimpan atomik pada findings dan junction yang benar; worksheet asli dan scoring engine menggunakan skor terbaru; nilai awal tetap terlacak; dan perubahan live terlihat oleh user lain.
