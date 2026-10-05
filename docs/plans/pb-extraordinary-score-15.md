# Peta Dampak: Opsi Skor PB 15

## Tujuan Bisnis

Opsi maksimum pada checklist tertentu dapat bernilai 15 sebagai penghargaan kinerja luar biasa. Pada konversi per checklist, nilai 15 menjadi 150. Nilai akhir rata-rata PB pada skala 100 tetap dibatasi maksimum 100.

## Kondisi Kode Saat Ini

1. Select skor PB merender nilai dari daftar opsi dan N/A memakai maksimum opsi secara dinamis. UI ini sudah dapat menampilkan 15 dan menyimpan N/A sebagai 15.
2. Backend `validateScore` masih menolak skor non-standardisasi di atas 10. Karena itu pemilihan 15 akan ditolak lewat REST maupun WebSocket.
3. Scoring peraturan 2 menghitung `(score / 10) * 100`; skor 15 menjadi 150, tetapi rata-rata yang dikembalikan belum dibatasi 100.
4. Scoring peraturan 1 memakai formula komponen berbobot dan skala 10. Standardisasi dinormalisasi dengan maksimum 12, sementara checklist lain memakai maksimum 10. Perubahan skor maksimum di sini berpengaruh pada formula historis dan tidak boleh otomatis disamakan dengan aturan peraturan 2.
5. Export PB peraturan 2 telah mengonversi nilai baris dengan `score * 10`, jadi skor 15 sudah tampil sebagai 150. Footer memakai nilai akhir dari backend.
6. Export PB peraturan 1 memakai rincian komponen hasil backend, sehingga setiap perubahan formula peraturan 1 juga mengubah nilai pada sheet ringkasan.
7. Penentuan temuan/periode tindak lanjut PB menggunakan ambang skor 10. Dengan aturan yang diminta, skor 10 dan 15 sama-sama bukan temuan; skor 15 adalah bonus untuk konversi dan tidak mengubah ambang tindak lanjut.
8. Form opsi referensi PB menyediakan nilai tetap sampai 10; admin belum bisa memilih 15.
9. Tipe kolom database opsi tidak didefinisikan pada migrasi PB di repository ini. Migrasi perlu dibuat hanya jika database aktual memiliki constraint yang membatasi nilai sampai 10; tanpa constraint, cukup tambah opsi 15 pada checklist terkait.

## Rencana Perubahan

1. Tambahkan opsi 15 di UI pengelolaan referensi PB dan pastikan warna/indikator nilai 15 diperlakukan sebagai nilai tertinggi.
2. Ubah validasi backend agar skor non-standardisasi divalidasi berdasarkan keanggotaan pada opsi checklist, tanpa batas global 10. Batas standardisasi tetap 0–12.
3. Pertahankan N/A: skor maksimum opsi disalin ke kedua sisi dan `excluded = 1`. Checklist N/A tidak ikut total konversi maupun pembagi.
4. Pada scoring peraturan 2, pertahankan konversi `score * 10` sehingga 15 menjadi 150. Batasi hanya `nilaiKPPN` dan `nilaiKanwil` akhir dengan `min(rataRataMentah, 100)`. `totalSkorKonversi` tetap menyimpan total sebenarnya, termasuk kontribusi 150.
5. Pertahankan formula peraturan 1 agar histori tidak berubah. Jika opsi 15 juga akan aktif untuk worksheet peraturan 1, tetapkan terpisah apakah nilai 15 dinormalisasi ke skala 10 atau menjadi nilai bonus yang kemudian dibatasi pada skala maksimum 10. Formula sekarang menormalisasi ke maksimum tetap 10.
6. Pertahankan ambang temuan 10 kecuali kebijakan bisnis menyatakan nilai 10 pada checklist bonus harus dianggap belum maksimal.
7. Periksa constraint `opsi_ref.value` di database aktual; buat migrasi hanya jika ada constraint maksimum 10.

## Contoh Peraturan 2

Misalnya 20 checklist tidak N/A: 19 checklist mendapat konversi 100 dan 1 checklist mendapat 150.

- Total konversi: `2.050`
- Rata-rata mentah: `102,5`
- Nilai akhir yang dikirim: `100`

Rincian total tetap menunjukkan 2.050 agar nilai bonus dapat diaudit.

## Keputusan yang Perlu Dipastikan sebelum Implementasi

Apakah opsi 15 hanya berlaku untuk worksheet peraturan 2? Rencana menjaga formula peraturan 1 tetap pada skala 10 dan tetap kompatibel dengan nilai historis. Jika opsi 15 juga diterapkan di peraturan 1, perlu aturan eksplisit untuk menanganinya dalam formula berbobot lama.
