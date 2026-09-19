# Rencana Header Bertingkat Export Excel SPML

## Tujuan

Mengubah header export Excel SPML menjadi dua tingkat agar kolom nilai KPPN dan Kanwil dikelompokkan dengan jelas, menambahkan satu kolom kosong sebagai separator, serta memberikan warna pembeda pada kelompok penilaian.

## Struktur 11 Kolom

Penambahan separator membuat tabel berubah dari 10 menjadi 11 kolom:

| Kolom | Isi |
|---|---|
| A | No |
| B | Aspek |
| C | Uraian Kegiatan |
| D | Bukti Dukung Kegiatan |
| E | Link Bukti Dukung Kegiatan |
| F | Nilai KPPN |
| G | Nilai Konversi KPPN |
| H | Catatan Hasil Reviu Kanwil |
| I | Separator kosong |
| J | Nilai Kanwil |
| K | Nilai Konversi Kanwil |

## Header Dua Tingkat

Header terdiri dari row 1 dan row 2.

### Row 1

- `A1:A2`: No
- `B1:B2`: Aspek
- `C1:C2`: Uraian Kegiatan
- `D1:D2`: Bukti Dukung Kegiatan
- `E1:E2`: Link Bukti Dukung Kegiatan
- `F1:G1`: Berdasarkan Self Assessment KPPN
- `H1:H2`: Catatan Hasil Reviu Kanwil
- `I1:I2`: kosong sebagai separator
- `J1:K1`: Berdasarkan Penilaian Kanwil DJPb

### Row 2

- F2: Nilai
- G2: Nilai Konversi
- J2: Nilai
- K2: Nilai Konversi

Dengan struktur ini, teks “(versi KPPN)” dan “(versi Kanwil)” dihapus dari judul kolom anak.

## Warna Header

- Header kelompok KPPN `F1:G2` menggunakan warna kuning.
- Header Catatan Hasil Reviu Kanwil `H1:H2` menggunakan warna kuning.
- Header kelompok Kanwil `J1:K2` menggunakan warna hijau.
- Header umum `A1:E2` tetap menggunakan tema abu-abu.
- Separator `I1:I2` menggunakan warna putih/netral agar terlihat sebagai pemisah visual.
- Isi data tetap berlatar putih agar mudah dibaca; warna kuning/hijau diterapkan pada header kelompok.

Semua header tetap memiliki border, font tebal, alignment tengah, dan text wrapping.

## Penyesuaian Generator

- Header tidak lagi dibuat otomatis melalui properti `header` pada `sheet.columns`; header row 1 dan 2 akan dibuat secara eksplisit agar merge dapat dikontrol.
- Frozen pane berubah dari `ySplit: 1` menjadi `ySplit: 2`.
- Data checklist mulai pada row 3.
- Tambahkan key kolom separator kosong pada posisi I.
- Posisi nilai Kanwil bergeser dari I/J menjadi J/K.
- Alignment angka diperbarui untuk kolom F, G, J, dan K.
- Catatan tetap berada di H dan menggunakan text wrapping.
- Merge row komponen/subkomponen diperluas dari `A:J` menjadi `A:K`.
- Loop styling dan border diperluas sampai kolom K.
- Merge rowspan No dan Aspek tetap bekerja berdasarkan nomor row aktual setelah header menjadi dua row.

## Footer

Footer tetap memiliki dua row:

- Total Nilai
- Rata-Rata Total Nilai

Penempatan nilai:

- label tetap digabung pada `A:F`;
- nilai KPPN berada di G;
- H sampai J menjadi area kosong/pemisah dengan border;
- nilai Kanwil bergeser ke K;
- number format diterapkan pada G dan K.

## Verifikasi

- Workbook memiliki tepat dua row header dan sebelas kolom.
- Merge vertikal dan horizontal dapat dibuka Excel tanpa repair warning.
- Frozen pane berada tepat di bawah row header kedua.
- Header KPPN dan Catatan berwarna kuning; header Kanwil berwarna hijau.
- Separator I kosong dan terlihat memisahkan catatan dari penilaian Kanwil.
- Data nilai, konversi, catatan, dan hyperlink tidak bergeser ke kolom yang salah.
- Merge komponen/subkomponen, merge No/Aspek, border, dan footer mencapai kolom K.
- Jalankan lint dan production build frontend.

