# Rencana Penyelarasan Format Excel CK dengan SPML

## Tujuan

Mengubah export Excel kertas kerja CK agar menggunakan satu sheet gabungan, header dua tingkat, dua versi nilai, catatan Kanwil, separator visual, serta warna kelompok yang sama dengan export SPML.

## Struktur Workbook

Saat ini export CK menghasilkan dua sheet terpisah untuk KPPN dan Kanwil. Setelah perubahan, workbook akan memiliki satu sheet bernama **Kertas Kerja CK** karena kedua versi nilai ditampilkan berdampingan pada setiap checklist.

## Struktur Kolom

Tabel memiliki 11 kolom fisik, termasuk satu separator kosong:

| Kolom | Isi |
|---|---|
| A | No |
| B | Materi |
| C | Kriteria Penilaian |
| D | Bukti Dukung Kegiatan |
| E | Link Bukti Dukung |
| F | Nilai KPPN |
| G | Nilai Konversi KPPN |
| H | Catatan Hasil Reviu Kanwil |
| I | Separator kosong |
| J | Nilai Kanwil |
| K | Nilai Konversi Kanwil |

## Header Dua Tingkat

### Row 1

- `A1:A2`: No
- `B1:B2`: Materi
- `C1:C2`: Kriteria Penilaian
- `D1:D2`: Bukti Dukung Kegiatan
- `E1:E2`: Link Bukti Dukung
- `F1:G1`: Berdasarkan Self Assessment KPPN
- `H1:H2`: Catatan Hasil Reviu Kanwil
- `I1:I2`: separator kosong
- `J1:K1`: Berdasarkan Penilaian Kanwil DJPb

### Row 2

- F2: Nilai
- G2: Nilai Konversi
- J2: Nilai
- K2: Nilai Konversi

Catatan bantuan N/A pada header Nilai CK yang sudah ada dapat tetap dipertahankan pada kedua kolom Nilai jika masih relevan terhadap aturan pengisian CK.

## Warna

- Header `F1:H2` menggunakan warna kuning untuk Self Assessment dan Catatan Kanwil.
- Header `J1:K2` menggunakan warna hijau untuk Penilaian Kanwil.
- Header `A1:E2` tetap abu-abu.
- Separator `I1:I2` berwarna putih/netral.
- Isi checklist tetap putih agar mudah dibaca.

## Mapping Data

- F: `kppn_score`, atau N/A jika `excluded = 1`.
- G: nilai KPPN dikali 10, atau N/A.
- H: `kanwil_note`.
- J: `kanwil_score`, atau N/A.
- K: nilai Kanwil dikali 10, atau N/A.
- Score `NULL` tetap menghasilkan cell kosong.
- Kriteria penilaian tetap menggabungkan header kriteria dan daftar opsi CK seperti sekarang.

## Label Hyperlink Bukti Dukung

Text hyperlink tidak lagi menampilkan URL panjang. Label dasarnya dibuat dengan format:

```text
CK_KPPN_<namaKPPN>
```

Contoh:

```text
CK_KPPN_Bukittinggi
```

Nama KPPN dinormalisasi: awalan `KPPN` dihapus dan spasi/simbol diganti underscore.

Jika hanya ada satu bukti, cell menampilkan label dasar tersebut. Jika file server dan link eksternal tersedia bersamaan, keduanya dipisahkan whitespace dengan suffix:

- `CK_KPPN_Bukittinggi_File_Server`
- `CK_KPPN_Bukittinggi_Link_Eksternal`

Hyperlink tetap mengarah ke URL file server atau link eksternal. Mengikuti keterbatasan representasi hyperlink cell yang saat ini digunakan, ketika terdapat dua link, hyperlink utama cell tetap mengarah ke link pertama dan seluruh URL dicantumkan pada tooltip.

## Perubahan Generator

- Hapus tipe dan parameter `ScoreOwner`.
- Ganti dua pemanggilan `createSheet` menjadi satu sheet gabungan.
- Bangun header secara eksplisit agar merge dua tingkat dapat diterapkan.
- Frozen pane tetap berada setelah row 2.
- Tambahkan `kanwil_note`, separator, nilai Kanwil, dan konversi Kanwil pada setiap row.
- Perluas merge row komponen dan loop border dari kolom G ke K.
- Perbarui kalkulasi tinggi row untuk 11 lebar kolom.
- Perbarui posisi alignment angka menjadi F, G, J, dan K.

## Footer

Footer tetap memiliki dua row:

- Total Nilai
- Rata-Rata Total Nilai

Penempatan:

- label digabung pada `A:F`;
- nilai KPPN berada di G;
- H sampai J kosong tetapi tetap memiliki border;
- nilai Kanwil berada di K;
- total menggunakan format angka tanpa desimal;
- rata-rata menggunakan dua angka desimal.

## Verifikasi

- Workbook hanya memiliki satu sheet Kertas Kerja CK.
- Header memiliki dua row dan 11 kolom fisik.
- Data KPPN, catatan, dan Kanwil berada di kolom yang benar.
- Warna header sama dengan pola export SPML.
- Nilai N/A dan `NULL` ditampilkan dengan benar.
- Link menampilkan label `CK_KPPN_<nama>` dan tetap dapat diklik.
- Link ganda memiliki whitespace pemisah dan tooltip URL.
- Merge komponen, border, tinggi row, dan footer mencapai kolom K.
- Workbook dapat dibuka Excel tanpa repair warning.
- Jalankan lint dan production build frontend.

