# Rencana Auto-fit Tinggi Row Excel SPML

## Tujuan

Mengoptimalkan tinggi setiap row checklist pada workbook SPML agar mengikuti isi cell, seperti hasil double-click pada batas row di Microsoft Excel. Row yang berisi teks pendek tidak lagi memiliki ruang kosong berlebih, sedangkan row dengan uraian, bukti dukung, atau link panjang tetap membesar sesuai kebutuhan.

## Hasil analisis

- Generator saat ini mengatur tinggi row checklist secara manual melalui `row.height`.
- Tinggi awal dihitung dari `Uraian Kegiatan`, kemudian dapat diperbesar kembali dari jumlah baris link.
- Pada ExcelJS, pemberian `row.height` menghasilkan atribut OpenXML `customHeight="1"`. Akibatnya Excel mempertahankan tinggi buatan aplikasi dan tidak melakukan auto-fit seperti ketika tinggi row belum ditentukan.
- ExcelJS yang digunakan proyek tidak menyediakan API publik `autoFitRows()`.

## Pendekatan

### 1. Biarkan row checklist memakai tinggi otomatis Excel

Pada row data checklist:

- hapus assignment `row.height` hasil estimasi;
- hapus perubahan tinggi berdasarkan jumlah baris link;
- pertahankan lebar kolom yang sudah ditetapkan;
- pertahankan `wrapText: true` pada seluruh kolom teks;
- pertahankan line break pada daftar bernomor dan pemisah link.

Dengan tidak adanya tinggi eksplisit, file tidak akan menandai row checklist sebagai `customHeight`. Microsoft Excel dapat menghitung tinggi berdasarkan lebar kolom, line break, font, dan wrap text ketika workbook dibuka.

### 2. Pertahankan tinggi row struktural

Tinggi eksplisit tetap digunakan pada:

- header tabel;
- baris Komponen dan Subkomponen;
- footer Total Nilai dan Rata-Rata Total Nilai.

Row tersebut merupakan bagian desain dengan isi singkat dan bukan target auto-fit.

### 3. Hapus estimator yang tidak lagi digunakan

Fungsi `calculateTextRowHeight` akan dihapus karena perhitungannya hanya berupa perkiraan jumlah karakter. Hal ini menghindari ruang kosong berlebih akibat perbedaan lebar karakter, font, dan layout aktual Excel.

## Batasan kompatibilitas

- Hasil utama ditujukan untuk Microsoft Excel, yang melakukan penghitungan layout cell saat workbook dibuka.
- Viewer spreadsheet lain dapat mempunyai cara perhitungan tinggi otomatis yang sedikit berbeda.
- Cell dengan merge vertikal pada kolom No dan Aspek tidak menjadi sumber utama tinggi row; sumber tinggi berasal dari kolom C–E yang tidak di-merge.

## File yang berubah

- `frontend/src/sections/excel/useExcelWorksheetSPML.ts`

Tidak diperlukan perubahan backend maupun perubahan pada UI tabel.

## Verifikasi

1. Row checklist yang dihasilkan tidak mempunyai atribut tinggi manual/custom height.
2. Uraian pendek menghasilkan row yang lebih padat.
3. Daftar bernomor dengan beberapa baris tetap terbaca seluruhnya.
4. Bukti dukung panjang tetap menggunakan wrap text.
5. Satu atau dua link tetap tampil pada baris terpisah dan menggunakan wrap text.
6. Header, section, dan footer mempertahankan tinggi desainnya.
7. Kedua sheet, `Nilai Kanwil` dan `Nilai KPPN`, mempunyai perilaku yang sama.
8. Build TypeScript dan ESLint terarah berhasil.

