# Rencana Perbaikan Scoring dan Struktur Export Excel Kertas Kerja

## Tujuan

1. Memastikan footer export kertas kerja PB menggunakan hasil perhitungan `ScoringEngine`, sehingga formula peraturan 1 dan peraturan 2 diterapkan dengan benar.
2. Menghilangkan merge/colspan horizontal pada band komponen, subkomponen, dan label footer export PB, CK, serta SPML agar operasi fill/drag vertikal di Excel tidak terhalang merged cell.
3. Mempertahankan tampilan band sebagai satu baris penuh berwarna abu-abu tanpa garis pemisah antar-cell.

## Perbaikan sumber nilai PB

### Alur data baru

1. `KPPNSelectionCard` tetap mengambil detail junction PB terlebih dahulu.
2. `worksheet_id` diambil dari hasil junction dan digunakan untuk memanggil endpoint resmi Scoring Engine:

   `GET /scoringEngine/pb/:worksheetPBId?peraturan=:peraturanId`

3. Response Scoring Engine menjadi satu-satunya sumber nilai export PB:
   - `nilaiKPPN` dan `nilaiKanwil` untuk nilai akhir;
   - `detailKPPN.totalSkorKonversi` dan `detailKanwil.totalSkorKonversi` untuk total nilai;
   - `detailKPPN.detailKomponen` dan `detailKanwil.detailKomponen` untuk rincian per komponen pada format peraturan 1.
4. Request lama `/getWsJunctionScoreAndProgress` tidak lagi digunakan oleh proses export PB.
5. Bila detail junction kosong atau `worksheet_id` tidak tersedia, proses export dihentikan dengan error yang jelas dan tidak menghasilkan workbook berisi nilai nol yang menyesatkan.

### Kompatibilitas peraturan

- Peraturan 1 memakai hasil Scoring Engine berskala 10, termasuk standardisasi dan bobot komponen.
- Peraturan 2 memakai hasil Scoring Engine berskala 100, tanpa standardisasi dan tanpa bobot komponen.
- Generator Excel lama peraturan 1 akan dipetakan ke struktur detail baru tanpa mengubah susunan workbook yang sudah digunakan untuk histori.
- Generator Excel PB peraturan 2 akan memakai nilai dan total dari server, bukan menghitung ulang rata-rata pada browser.

## Tipe frontend

Tambahkan tipe response scoring PB yang mencakup:

- `peraturan`;
- `nilaiKPPN` dan `nilaiKanwil`;
- detail KPPN/Kanwil;
- rincian nilai per komponen untuk peraturan 1.

Tipe ini digunakan oleh kedua generator PB sehingga nama properti mengikuti kontrak Scoring Engine dan tidak lagi bergantung pada `MatrixScoreAndProgressType`.

## Penggantian merged section bands

### Mekanisme tampilan

Untuk setiap band komponen/subkomponen dan rentang label footer:

1. Hapus pemanggilan `mergeCells` horizontal.
2. Isi warna latar pada seluruh cell di sepanjang rentang band.
3. Hilangkan border vertikal internal.
4. Pertahankan border atas dan bawah, serta border kiri pada cell pertama dan border kanan pada cell terakhir.
5. Gunakan alignment Excel `centerContinuous` atau *Center Across Selection* pada rentang kosong sehingga judul terlihat membentang sebagai satu kesatuan tanpa cell benar-benar digabung.
6. Pertahankan font, warna, dan tinggi baris yang ada.

Dengan struktur ini, pengguna dapat menarik formula atau menyalin satu cell secara vertikal melewati band tersebut.

### Export PB

Pada `useExcelWorksheet2.tsx`:

- ubah band komponen dan subkomponen `A:M` menjadi cell biasa;
- ubah rentang label footer yang saat ini digabung menjadi cell biasa dengan tampilan kontinu;
- pertahankan merge pada header dua tingkat karena diperlukan untuk grup Self Assessment KPPN dan Penilaian Kanwil.

### Export CK

Pada `useExcelWorksheetCK.ts`:

- ubah band komponen `A:K` menjadi cell biasa;
- ubah rentang label footer `A:F` menjadi cell biasa dengan tampilan kontinu;
- pertahankan merge pada header pengelompokan nilai KPPN/Kanwil.

### Export SPML

Pada `useExcelWorksheetSPML.ts`:

- ubah band komponen dan subkomponen `A:K` menjadi cell biasa;
- ubah rentang label footer `A:F` menjadi cell biasa dengan tampilan kontinu;
- pertahankan merge vertikal kolom nomor/aspek untuk beberapa checklist dalam satu aspek karena itu merupakan rowspan data, bukan section band horizontal;
- pertahankan merge pada header pengelompokan nilai KPPN/Kanwil.

## File yang diperkirakan berubah

- `frontend/src/sections/worksheet/component/KPPNSelectionCard.tsx`
- `frontend/src/sections/worksheet/types.ts` atau tipe scoring bersama yang relevan
- `frontend/src/sections/excel/useExcelWorksheet.tsx`
- `frontend/src/sections/excel/useExcelWorksheet2.tsx`
- `frontend/src/sections/excel/useExcelWorksheetCK.ts`
- `frontend/src/sections/excel/useExcelWorksheetSPML.ts`

Backend Scoring Engine tidak perlu diubah selama kontrak endpoint PB yang tersedia tetap sama.

## Verifikasi

1. Jalankan build TypeScript backend bila kontrak endpoint disentuh dan build frontend setelah seluruh perubahan.
2. Export PB dengan peraturan 1 dan cocokkan nilai akhir serta rincian komponen dengan response Scoring Engine.
3. Export PB dengan peraturan 2 dan cocokkan:
   - total nilai konversi KPPN/Kanwil;
   - jumlah checklist pembagi;
   - nilai akhir KPPN/Kanwil.
4. Export CK dan SPML untuk memastikan format dan isi tidak berubah selain struktur merged cell yang diminta.
5. Periksa daftar merge pada workbook hasil export:
   - merge header dua tingkat tetap ada;
   - merge vertikal aspek SPML tetap ada;
   - tidak ada merge horizontal pada band komponen/subkomponen atau label footer.
6. Buka workbook di Excel dan uji fill/drag satu cell secara vertikal melewati band abu-abu.
7. Pastikan band tetap berwarna penuh, tidak memiliki border vertikal internal, judul terbaca, dan batas luar baris tetap terlihat.

## Batas perubahan

- Tidak mengubah formula Scoring Engine yang sudah tersedia.
- Tidak mengubah data database atau membuat migrasi.
- Tidak menghilangkan merge header yang bermakna sebagai pengelompokan kolom.
- Tidak menghilangkan merge vertikal aspek SPML.
- Implementasi dimulai setelah rencana ini disetujui.
