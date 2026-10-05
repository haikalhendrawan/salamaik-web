# Rencana: Keterangan Tambahan pada Aspek SPML

## Tujuan

Menambahkan kolom `keterangan_tambahan` bertipe `TEXT` pada referensi aspek SPML. Jika berisi teks, kertas kerja menampilkan judul aspek lalu keterangan tambahan dengan jarak visual yang jelas. Ekspor Excel kertas kerja SPML menampilkan format serupa.

## Cakupan Perubahan

1. **Database**
   - Buat migrasi SQL idempotent untuk menambahkan `aspek_spml_ref.keterangan_tambahan TEXT`.
   - Nilai awal tetap `NULL`, sehingga perilaku aspek lama tidak berubah.

2. **Backend dan referensi**
   - Perluas tipe model aspek SPML.
   - Sertakan kolom pada create/update aspek SPML dan validasi bahwa nilainya string atau `null`.
   - Endpoint `getAllAspekSpml` sudah mengambil seluruh kolom (`SELECT *`), sehingga tidak perlu perubahan query baca.

3. **Pengelolaan referensi di UI**
   - Perluas tipe `AspekSpmlRefType`.
   - Tambahkan field textarea opsional pada modal tambah/edit Aspek SPML dan kirim nilainya ke API.
   - Tampilkan keterangan pada tabel referensi agar admin dapat melihat isi yang tersimpan.

4. **Worksheet dan Excel**
   - Tampilkan `title` dan `keterangan_tambahan` pada cell aspek SPML, dengan baris/spacing terpisah dan gaya yang tetap terbaca pada light/dark mode.
   - Saat ekspor, gabungkan keduanya dalam satu cell aspek dengan line break dan aktifkan `wrapText`; pertahankan merge cell aspek yang sudah ada.
   - Pastikan export dari toolbar dan selection card yang memakai generator Excel yang sama ikut tercakup.

## Verifikasi

- Pastikan aspek tanpa keterangan tampil persis seperti sebelumnya.
- Pastikan keterangan tampil pada UI dan Excel ketika tersedia, termasuk teks panjang/multiline.
- Pastikan create/edit referensi menyimpan dan membaca ulang nilai.
- Jalankan TypeScript check frontend/backend yang relevan.
