# Rencana Format Tabel Nilai untuk Peraturan 1

## Tujuan

Membedakan format tabel halaman Nilai berdasarkan peraturan:

- **Peraturan 2** mempertahankan format PB 50%, SPML 15%, dan CK 35% yang sekarang.
- **Peraturan 1** hanya menampilkan Kertas Kerja PB dengan perhitungan berbobot per komponen seperti `RekapitulasiNilaiTable` pada halaman Matrix.

Perubahan berlaku pada:

1. `TabelPenilaian` untuk satu KPPN.
2. `TabelNilaiAKKPenyumbangLHPS` untuk seluruh KPPN lingkup Kanwil.
3. Export Excel kedua tabel agar format file sesuai dengan format UI yang aktif.

## Kebutuhan Data Backend

`PBScoreResult` sudah memiliki `detailKPPN.detailKomponen` dan `detailKanwil.detailKomponen`, tetapi informasi ini belum diteruskan oleh endpoint AKK.

Perubahan backend yang diperlukan:

1. Simpan hasil PB lengkap pada kalkulasi AKK internal.
2. Tambahkan data berikut secara aditif pada respons endpoint AKK satu KPPN:

   ```ts
   detailPBKPPN: PBScoreDetail;
   detailPBKanwil: PBScoreDetail;
   ```

3. Tambahkan `detailKomponenPB` pada setiap unit di respons endpoint AKK penyumbang LHPS:

   ```ts
   detailKomponenPB: PBComponentScoreDetail[];
   ```

4. Kontrak peraturan 2 yang sudah digunakan frontend tetap dipertahankan.

## Perhitungan Penyumbang LHPS Peraturan 1

Seluruh KPPN memiliki kedudukan sama. Metadata `tipe` dan `provinsi` tidak digunakan.

Untuk setiap KPPN:

```text
nilaiKomponen = rata-rata checklist yang tidak excluded × bobot komponen
nilaiAKK = jumlah nilai tertimbang seluruh komponen
```

Untuk nilai lingkup Kanwil:

```text
totalNilai = jumlah nilai AKK seluruh KPPN
jumlahPembagi = jumlah KPPN
nilaiAkhir = totalNilai / jumlahPembagi
```

Endpoint LHPS akan menambahkan field eksplisit:

```ts
totalNilaiKPPN: number;
jumlahPembagi: number;
```

Untuk kompatibilitas, field footer yang telah ada tetap dikirim. Pada peraturan 2 perilakunya tidak berubah.

## Tabel Penilaian Satu KPPN

Buat komponen baru `TabelPenilaianPeraturan1` berdasarkan desain `RekapitulasiNilaiTable`.

Kolom:

1. No.
2. Nama Komponen.
3. Total Nilai.
4. Bilangan Pembagi.
5. Rata-Rata Nilai.
6. Bobot Nilai.
7. Nilai Tertimbang.

Perilaku:

- Tersedia navigasi antara Self Assessment KPPN dan Penilaian Kanwil seperti komponen Matrix.
- Footer menampilkan nilai akhir versi yang sedang dipilih.
- Nilai menggunakan dua angka desimal dan titik sebagai pemisah desimal.
- Indikator refresh dan tombol export tetap tersedia pada card header.
- `TabelPenilaian` menjadi komponen pemilih: peraturan 1 merender format lama, peraturan 2 merender format sekarang.

## Tabel Penyumbang LHPS Peraturan 1

Buat tampilan khusus peraturan 1 dengan bentuk horizontal.

Kolom:

1. No.
2. KPPN.
3. Satu kolom untuk setiap komponen PB, berisi nilai komponen setelah dibobotkan (`nilaiTerbobot`).
4. Jumlah Setelah Dibobotkan, yaitu jumlah nilai seluruh komponen atau nilai AKK KPPN.

Footer:

1. Total Nilai Seluruh KPPN.
2. Jumlah KPPN sebagai bilangan pembagi.
3. Nilai Akhir Aspek Kinerja KPPN Lingkup Kanwil.

Urutan kolom komponen mengikuti data `detailKomponenPB` dari server dan diidentifikasi dengan `komponenId`, sehingga tidak bergantung pada judul atau posisi array semata.

`TabelNilaiAKKPenyumbangLHPS` akan memilih format berdasarkan `data.peraturan`:

- peraturan 1 → tabel komponen PB tanpa pengelompokan tipe KPPN;
- peraturan 2 → tabel pengelompokan A1 Provinsi, A1 Non Provinsi, dan A2 yang sekarang.

## Export Excel

### Tabel Penilaian

- Peraturan 1: export daftar komponen PB sesuai tampilan `RekapitulasiNilaiTable`, dengan bagian Self Assessment dan Penilaian Kanwil.
- Peraturan 2: pertahankan format export saat ini.

### Tabel Penyumbang LHPS

- Peraturan 1: kolom No, KPPN, komponen-komponen PB, dan Jumlah Setelah Dibobotkan; footer berisi total, jumlah KPPN, dan rata-rata akhir.
- Peraturan 2: pertahankan format export sekarang.
- Semua nilai bersumber dari respons server dan tidak dihitung ulang di frontend.

## Tipe Frontend

Tambahkan tipe:

- `PBComponentScoreDetail`.
- `PBScoreDetail`.
- field `detailPBKPPN` dan `detailPBKanwil` pada `AKKScoreResponse`.
- field `detailKomponenPB`, `totalNilaiKPPN`, dan `jumlahPembagi` pada respons LHPS.

## Live Sync

Tidak diperlukan event baru. Refresh yang sudah berjalan akan mengambil bentuk data terbaru dari endpoint yang sama. Pergantian format hanya bergantung pada `data.peraturan`.

## Pengujian

### Backend

1. Detail PB KPPN dan Kanwil diteruskan tanpa mengubah hasil AKK.
2. Peraturan 1 tidak menggunakan `tipe` atau `provinsi`.
3. Total enam KPPN dibagi enam, bukan dibagi bobot kategori.
4. Detail nilai per komponen setiap KPPN tersedia dan urutannya konsisten.
5. Peraturan 2 tetap menghasilkan respons dan nilai yang sama.

### Frontend

1. TypeScript, ESLint, dan build produksi.
2. Peraturan 1 menampilkan tabel per komponen, bukan kolom PB/SPML/CK.
3. Peraturan 2 mempertahankan tabel saat ini.
4. Tabel LHPS peraturan 1 tidak menampilkan bobot tipe/provinsi.
5. Footer menampilkan total nilai, jumlah KPPN, dan hasil pembagian yang benar.
6. Export Excel mengikuti format peraturan yang aktif.
