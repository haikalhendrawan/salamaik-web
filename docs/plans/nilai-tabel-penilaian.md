# Rencana Komponen Tabel Penilaian

## Tujuan

Menambahkan komponen tabel baru pada section `nilai` yang meniru struktur `docs/tabel_penilaian.xlsx`. Data pada tahap ini berupa mock, tetapi bentuk tipe dan props disiapkan agar nantinya dapat diganti dengan response scoring engine tanpa mengubah struktur tabel.

## Struktur Tabel dari Excel

Workbook referensi memiliki satu sheet `REKAP` dengan tabel 11 kolom dan header bertingkat:

1. `Nama KPPN` menggunakan `rowSpan` tiga baris header.
2. `Penilaian Aspek Kinerja KPPN` menjadi header utama untuk sepuluh kolom nilai.
3. Kelompok `Proses Bisnis (PB) (50%)` memiliki tiga kolom:
   - Nilai Kertas Kerja PB
   - Bobot PB
   - Nilai PB
4. Kelompok `Sarana dan Prasarana Mutu Layanan (15%)` memiliki tiga kolom:
   - Nilai Kertas Kerja SPML
   - Bobot SPML
   - Nilai SPML
5. Kelompok `Capaian Kinerja (35%)` memiliki tiga kolom:
   - Nilai Kertas Kerja CK
   - Bobot CK
   - Nilai CK
6. `AKK KPPN` menggunakan `rowSpan` dua baris pada bagian header kelompok.
7. Isi dibagi menjadi dua section penuh:
   - Berdasarkan self assessment KPPN
   - Berdasarkan penilaian Kanwil

## Implementasi Frontend

### Komponen baru

Buat `frontend/src/sections/nilai/components/TabelPenilaian.tsx` dengan:

- MUI `Card`, `CardHeader`, `TableContainer`, `Table`, `TableHead`, `TableBody`, `TableRow`, dan `TableCell`;
- pola transisi dan tampilan Card mengikuti `RekapitulasiNilaiTable`;
- tiga baris header memakai kombinasi `rowSpan` dan `colSpan` sesuai workbook;
- header abu-abu, section self assessment biru muda, serta section penilaian Kanwil kuning;
- border tipis, teks header rata tengah, angka rata kanan/tengah, dan nama KPPN rata kiri;
- `TableContainer` dengan overflow horizontal pada viewport sempit agar sebelas kolom tetap terbaca;
- nilai ditampilkan maksimal dua angka desimal, sedangkan bobot ditampilkan sebagai persen.

### Bentuk data mock

Gunakan tipe baris yang sederhana:

```ts
type PenilaianKPPNRow = {
  kppnId: number;
  kppnName: string;
  nilaiPB: number;
  nilaiSPML: number;
  nilaiCK: number;
};
```

Nilai tertimbang PB/SPML/CK dan AKK dihitung dari nilai mentah serta konstanta bobot `50%`, `15%`, dan `35%`. Dengan demikian data mock menyerupai bentuk data API yang nantinya dibutuhkan dan tidak menyimpan nilai turunan secara ganda.

Komponen menerima dua kumpulan data melalui props (`selfAssessmentRows` dan `kanwilRows`) dengan nilai default berupa mock. Ini memungkinkan integrasi endpoint pada tahap berikutnya tanpa refactor markup tabel.

### Integrasi section nilai

Render `TabelPenilaian` dari `frontend/src/sections/nilai/NilaiSection.tsx`, setelah ringkasan nilai yang saat ini tersedia. Data mock tetap berada di komponen baru agar `NilaiSection` tidak dipenuhi detail sementara.

## File yang Berubah

- Baru: `frontend/src/sections/nilai/components/TabelPenilaian.tsx`
- Ubah: `frontend/src/sections/nilai/NilaiSection.tsx`

Tidak ada perubahan backend, route, database, maupun workbook Excel pada tahap ini.

## Verifikasi

1. Pastikan seluruh header bertingkat dan section data sesuai merge pada sheet `REKAP`.
2. Pastikan perhitungan mock untuk nilai tertimbang dan AKK benar.
3. Pastikan tabel tetap berada di dalam Card dan dapat di-scroll pada layar sempit.
4. Jalankan `npm run build` pada frontend untuk memeriksa TypeScript dan build Vite.
5. Jalankan lint terbatas pada file baru dan file integrasi bila konfigurasi lint proyek memungkinkan.
