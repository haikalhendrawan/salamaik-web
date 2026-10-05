# Matriks Peraturan 2 yang Persisten dan Dapat Diedit

## Tujuan

Menyamakan perilaku matriks peraturan 2 dengan peraturan 1: setelah admin mem-posting temuan, setiap baris matriks disimpan sebagai data tersendiri dan dapat diedit. Perbedaan bisnisnya, peraturan 2 hanya mem-posting checklist yang menjadi temuan dari tiga sumber worksheet: PB, SPML, dan CK.

## Kondisi Saat Ini

- Endpoint `POST /createMatrix` untuk peraturan 2 memanggil `postRegulation2Findings`, yang menyimpan kandidat temuan ke `findings_data`.
- `GET /matrix/peraturan-2/:kppnId/:periodId` merakit tampilan matriks dari data worksheet dan `findings_data`; `MatrixTablePeraturan2` hanya menampilkan/export data dan tidak memiliki aksi edit.
- Endpoint `POST /updateMatrix` menolak peraturan 2 karena matriks saat ini tidak disimpan pada `matrix_data`.
- Dengan demikian, belum ada snapshot matriks persisten yang menjadi sumber utama kolom hasil implementasi, permasalahan, rekomendasi, peraturan, PIC, dan tindak lanjut.

## Rencana Perubahan

### 1. Skema database

- Buat migrasi untuk memperluas `matrix_data` agar satu baris dapat merujuk ke salah satu sumber worksheet PB, CK, atau SPML.
- Pertahankan kolom/relasi lama untuk peraturan 1 agar kompatibel ke belakang.
- Tambahkan diskriminator jenis worksheet (`PB`/`CK`/`SPML`) serta kolom junction dan checklist sumber untuk CK/SPML; relasi PB tetap memakai `ws_junction_id` dan `checklist_id` yang sudah ada.
- Sesuaikan nullability seperlunya tanpa menghapus data/constraint peraturan 1; tambahkan unique index terfilter agar satu junction sumber hanya memiliki satu baris matriks.
- Pastikan `findings_data.matrix_id` dapat menunjuk ke baris matriks peraturan 2, dengan constraint/index yang tidak merusak record temuan existing.

### 2. Posting dan sinkronisasi

- Ubah proses posting peraturan 2 dalam satu transaksi: ambil temuan PB/CK/SPML, buat atau perbarui baris `matrix_data` hanya untuk checklist yang memenuhi kriteria temuan, lalu hubungkan record `findings_data` ke `matrix_id` terkait.
- Simpan nilai awal kolom matriks dari snapshot/fallback referensi yang sekarang dipakai, termasuk nilai hasil implementasi, permasalahan, rekomendasi, peraturan, dan PIC.
- Saat sinkronisasi sebelum masa tindak lanjut, pertahankan perubahan manual matriks untuk temuan yang masih aktif; hapus atau arsipkan secara terdefinisi baris matriks yang tidak lagi menjadi temuan beserta relasi findings-nya.
- Buat posting berulang idempotent dan lindungi dari duplikasi dengan unique index dan upsert/transaksi.

### 3. Pengambilan data dan otorisasi

- Ubah query endpoint matriks peraturan 2 agar membaca kolom editable dari snapshot `matrix_data`, lalu menggabungkan metadata worksheet/checklist live untuk nomor, jenis worksheet, komponen, dan skor/status.
- Pastikan hasil dikelompokkan PB, SPML, lalu CK, dan hanya menampilkan temuan aktif yang sudah diposting.
- Tetap batasi akses per KPPN/peran sebagaimana endpoint saat ini; akses edit mengikuti kewenangan Kanwil/admin yang dipakai matriks peraturan 1.

### 4. UI edit

- Tambahkan tombol edit per baris pada `MatrixTablePeraturan2`, mengikuti pola tabel matriks peraturan 1.
- Sediakan modal edit untuk field matriks yang relevan: hasil implementasi, permasalahan, rekomendasi, peraturan/ketentuan, PIC, dan tindak lanjut.
- Setelah simpan, refresh data tabel. Nonaktifkan edit setelah batas waktu tindak lanjut, mengikuti aturan matriks peraturan 1.
- Pertahankan ekspor Excel dan susunan bagian PB/SPML/CK.

### 5. API dan integrasi tindak lanjut

- Tambahkan/ubah validasi endpoint update agar menerima baris matriks peraturan 2 dan memastikan ID tersebut milik worksheet/KPPN yang berwenang.
- Hapus penolakan unconditional peraturan 2 pada update; jangan mengizinkan update lintas KPPN atau setelah periode edit ditutup.
- Selaraskan `findings_data` dan endpoint tindak lanjut: nilai awal/metadata temuan tetap merepresentasikan saat posting, sedangkan field matriks editable menjadi sumber tampilan/export matriks. Perubahan kolom matriks tidak boleh mengubah histori skor temuan awal dan skor tindak lanjut.
- Perjelas relasi untuk tindak lanjut kanwil agar update tindak lanjut tetap tersimpan pada matriks yang benar.

## Validasi

- Uji posting peraturan 2 membuat baris matriks hanya untuk temuan PB, CK, dan SPML.
- Uji setiap tipe sumber dapat dibaca, diedit, disimpan, dan diekspor setelah refresh.
- Uji sinkronisasi tidak menggandakan baris dan mempertahankan edit manual pada temuan yang tetap aktif.
- Uji temuan yang tidak lagi memenuhi syarat ditangani konsisten sebelum periode tindak lanjut.
- Uji otorisasi peran/KPPN, periode edit, serta alur matriks peraturan 1 yang harus tetap berfungsi.
- Jalankan tes backend dan build frontend yang relevan.

## Asumsi yang Perlu Disepakati

Perubahan edit matriks mengikuti penutupan seperti peraturan 1: baris dapat diedit sampai `close_follow_up`. Sinkronisasi posting hanya tersedia sebelum periode tindak lanjut dimulai; setelah itu baris temuan dan isi matriks menjadi tetap, kecuali field tindak lanjut yang memang masih diizinkan oleh alur aplikasi.
