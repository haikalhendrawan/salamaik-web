# Rencana ScoringEngine – Perhitungan Nilai Kertas Kerja SPML

## Tujuan

Menambahkan modul backend baru bernama `ScoringEngine` sebagai pusat perhitungan skor kertas kerja dan, pada tahap berikutnya, skor pembinaan. Tahap pertama menyediakan perhitungan skor Kertas Kerja SPML untuk versi KPPN dan Kanwil.

## Asumsi aturan perhitungan

1. Parameter `worksheetSPMLId` merujuk ke `worksheet_spml_junction.worksheet_id` dan diperlakukan sebagai string/UUID.
2. Checklist N/A ditentukan oleh `excluded = 1`. Karena kolom ini berada pada junction dan bukan per jenis skor, jumlah N/A KPPN dan Kanwil saat ini akan sama.
3. Checklist dengan skor `null` yang tidak N/A tetap masuk `jumlahChecklistPembagi`, dengan kontribusi nilai 0. Dengan demikian worksheet yang belum selesai tidak menghasilkan nilai sempurna secara prematur.
4. Skor checklist yang valid adalah 0 atau 10. Nilai konversi dihitung dengan `skor * 10`, sehingga 0 menjadi 0 dan 10 menjadi 100.
5. Nilai akhir dihitung sebagai:

   `total nilai konversi checklist non-N/A / jumlahChecklistPembagi`

6. Nilai akhir dibulatkan maksimal empat angka di belakang koma. Implementasi menggunakan pembulatan numerik, misalnya `Math.round(value * 10000) / 10000`, sehingga response tetap bertipe `number`, bukan string.
7. Jika tidak ada checklist pembagi—misalnya semua checklist N/A—nilai akhir dikembalikan sebagai 0.

## Struktur response

Endpoint mengembalikan envelope API yang sudah digunakan aplikasi, dengan hasil perhitungan pada `rows`:

```json
{
  "success": true,
  "message": "SPML worksheet score calculated successfully",
  "rows": {
    "nilaiKPPN": 80,
    "nilaiKanwil": 70,
    "detailKPPN": {
      "jumlahChecklist": 12,
      "jumlahNA": 2,
      "jumlahChecklistPembagi": 10
    },
    "detailKanwil": {
      "jumlahChecklist": 12,
      "jumlahNA": 2,
      "jumlahChecklistPembagi": 10
    }
  }
}
```

`nilaiKPPN` dan `nilaiKanwil` dikirim sebagai `number` dengan presisi maksimal empat angka di belakang koma. Field detail tetap berupa integer dan tidak menggunakan string hasil agregasi PostgreSQL. Karena JSON menyimpan angka dan bukan format tampilan, nilai seperti `80.5000` akan dikirim sebagai `80.5`, sedangkan nilai yang memang membutuhkan empat digit dapat dikirim sebagai `66.6667`.

## Rencana perubahan backend

### 1. Model `ScoringEngine`

- Buat `backend/src/model/scoringEngine.model.ts`.
- Definisikan tipe response dan detail perhitungan agar kontrak model eksplisit.
- Tambahkan metode `calculateSPMLScore(worksheetSPMLId)`.
- Ambil junction SPML berdasarkan `worksheet_id` melalui query terparameterisasi.
- Query hanya mengambil field yang dibutuhkan: `kppn_score`, `kanwil_score`, dan `excluded`.
- Model memvalidasi/menormalisasi angka, memisahkan checklist N/A, menghitung total konversi, pembagi, serta nilai akhir KPPN dan Kanwil.
- Model tidak bergantung pada object HTTP agar nantinya dapat digunakan kembali untuk perhitungan skor pembinaan, proses posting, laporan, atau background job.

### 2. Controller `ScoringEngine`

- Buat `backend/src/controller/scoringEngine.controller.ts`.
- Tambahkan handler GET yang membaca `req.params.worksheetSPMLId`.
- Validasi parameter tidak kosong.
- Pastikan worksheet terkait tersedia; jika tidak ditemukan, kembalikan 404.
- Validasi akses pengguna terhadap KPPN pemilik worksheet:
  - user Kanwil dapat mengakses worksheet dalam ruang lingkup Kanwil;
  - user KPPN hanya dapat mengakses worksheet milik KPPN-nya.
- Panggil model dan kembalikan response sesuai kontrak di atas.
- Teruskan error ke middleware `errorHandler` yang sudah tersedia.

### 3. Route

- Buat `backend/src/routes/scoringEngineRoute.ts`.
- Daftarkan endpoint terautentikasi:

  `GET /scoringEngine/spml/:worksheetSPMLId`

- Mount route pada `backend/src/index.ts` dengan prefix `/scoringEngine`.

## Detail algoritma

Untuk setiap versi skor (`kppn_score` dan `kanwil_score`):

1. `jumlahChecklist` = seluruh junction pada worksheet.
2. `jumlahNA` = junction dengan `excluded = 1`.
3. `jumlahChecklistPembagi` = `jumlahChecklist - jumlahNA`.
4. Filter junction dengan `excluded !== 1`.
5. Konversi setiap skor dengan `(score ?? 0) * 10`.
6. Jumlahkan seluruh nilai konversi.
7. Jika pembagi lebih dari 0, bagi total konversi dengan pembagi lalu bulatkan maksimal empat angka di belakang koma; jika tidak, hasilnya 0.

Walaupun detail KPPN dan Kanwil identik dengan skema saat ini, keduanya tetap dibentuk terpisah agar kontrak API siap jika aturan N/A per penilai berubah di masa depan.

## Validasi dan pengujian

Tambahkan unit test untuk fungsi perhitungan atau model dengan skenario berikut:

1. Semua skor 10 menghasilkan nilai 100.
2. Campuran skor 10 dan 0 menghasilkan rata-rata konversi yang benar, termasuk hasil desimal seperti `66.6667`.
3. Checklist N/A dikeluarkan dari numerator dan denominator.
4. Skor `null` non-N/A dihitung sebagai 0 dan tetap masuk pembagi.
5. Pembulatan tidak menghasilkan lebih dari empat angka di belakang koma dan tetap dikirim sebagai tipe `number`.
6. Semua checklist N/A menghasilkan nilai 0 dan pembagi 0.
7. Worksheet tidak ditemukan menghasilkan 404.
8. Parameter kosong/tidak valid menghasilkan 400.
9. User di luar ruang lingkup worksheet menghasilkan 403.
10. Backend TypeScript build dan test terkait berhasil.

## Dampak dan kompatibilitas

- Tidak memerlukan perubahan skema database.
- Tidak mengubah perhitungan worksheet PB yang sudah ada.
- `ScoringEngine` sengaja dibuat terpisah dari model junction agar dapat dikembangkan untuk skor PB, CK, dan skor pembinaan tanpa mencampurkan aturan bisnis dengan operasi CRUD.
