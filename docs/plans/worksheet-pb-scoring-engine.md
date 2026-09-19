# Rencana Scoring Engine Kertas Kerja PB

## Tujuan

Menambahkan perhitungan skor kertas kerja Proses Bisnis (PB) ke `ScoringEngine` dengan parameter `peraturan`. Formula dipilih berdasarkan referensi peraturan:

- `peraturan = 1`: perhitungan per komponen, memperhitungkan standardisasi dan bobot komponen.
- `peraturan = 2`: rata-rata seluruh checklist tanpa standardisasi dan tanpa bobot komponen.

Skor KPPN dan Kanwil dihitung secara terpisah dari kumpulan junction yang sama.

## Skala Nilai Berdasarkan Peraturan

Skala hasil sengaja berbeda sesuai peraturan:

- `peraturan = 1` mempertahankan formula utility lama dan menghasilkan nilai akhir pada skala 0–10;
- `peraturan = 2` menggunakan formula baru dan menghasilkan nilai akhir pada skala 0–100.

Untuk peraturan 1, konversi checklist menggunakan:

- checklist biasa: `(score / 10) * 10`;
- checklist standardisasi: `(score / 12) * 10`.

Utility lama tidak diubah agar endpoint/fitur lama tidak mengalami perubahan perilaku secara tidak sengaja.

## Struktur Data Internal

Tambahkan tipe row PB pada `scoringEngine.model.ts` yang memuat:

- `kppn_id`;
- `kppn_score`;
- `kanwil_score`;
- `excluded`;
- `komponen_id`, judul, dan bobot komponen;
- flag `standardisasi` dari checklist.

Tambahkan tipe hasil per komponen:

- `komponenId`;
- `komponenTitle`;
- `komponenBobot`;
- `jumlahChecklist`;
- `jumlahNA`;
- `jumlahChecklistPembagi`;
- `totalSkorKonversi`;
- `nilaiRataRata`;
- `nilaiTerbobot`.

Detail KPPN/Kanwil menggunakan informasi umum yang konsisten dengan scoring SPML/CK:

- `jumlahChecklist`;
- `jumlahChecklistDiisi`;
- `jumlahNA`;
- `jumlahChecklistPembagi`;
- `totalSkorKonversi`;
- `detailKomponen` untuk audit formula peraturan 1.

Response utama:

```ts
{
  peraturan: 1 | 2;
  nilaiKPPN: number;
  nilaiKanwil: number;
  detailKPPN: PBScoreDetail;
  detailKanwil: PBScoreDetail;
}
```

Nilai akhir dibulatkan maksimal empat angka di belakang koma, sama seperti scoring SPML dan CK. Nilai komponen yang dikirim pada detail juga dibulatkan agar response stabil.

## Formula Peraturan 1

Untuk setiap sisi penilaian (KPPN/Kanwil):

1. Kelompokkan checklist berdasarkan komponen.
2. Abaikan checklist dengan `excluded = 1` dari total nilai dan pembagi.
3. Konversi setiap score non-N/A ke skala 10, sama seperti utility asli:
   - standardisasi: `(score / 12) * 10`;
   - non-standardisasi: `(score / 10) * 10`.
4. Score `NULL` pada checklist non-N/A diperlakukan sebagai 0 dan checklist tetap menjadi pembagi.
5. Hitung rata-rata komponen: `totalSkorKonversi / jumlahChecklistPembagi`.
6. Hitung nilai terbobot: `rataRataKomponen * (bobot / 100)`.
7. Nilai akhir worksheet adalah jumlah seluruh nilai terbobot komponen dan tetap berada pada skala 0–10 apabila total bobot referensi adalah 100%.

Jika seluruh checklist pada suatu komponen N/A, rata-rata dan nilai terbobot komponen tersebut menjadi 0 agar tidak menghasilkan `NaN` atau `Infinity`. Bobot komponen tidak dinormalisasi ulang; formula menggunakan bobot referensi apa adanya, sama seperti mekanisme lama.

## Formula Peraturan 2

Untuk setiap sisi penilaian:

1. Abaikan checklist dengan `excluded = 1` dari total nilai dan pembagi.
2. Semua checklist, termasuk yang memiliki flag standardisasi, dikonversi menggunakan `(score / 10) * 100`.
3. Score `NULL` pada checklist non-N/A diperlakukan sebagai 0 dan tetap menjadi pembagi.
4. Jumlahkan seluruh nilai konversi.
5. Nilai akhir adalah `totalSkorKonversi / jumlahChecklistPembagi`.
6. Tidak ada pengelompokan atau pembobotan komponen untuk menentukan nilai akhir.

Jika seluruh checklist N/A, nilai akhir adalah 0.

## Model dan Query

Tambahkan pure function yang dapat diuji tanpa database:

```ts
calculatePBScoreFromRows(rows, peraturan)
```

Tambahkan method database:

```ts
scoringEngine.calculatePBScore(worksheetPBId, peraturan, poolTrx?)
```

Query mengambil junction berdasarkan `worksheet_id`, lalu join ke `worksheet_ref`, `checklist_ref`, dan `komponen_ref` untuk memperoleh KPPN, standardisasi, serta bobot komponen. Referensi tidak difilter berdasarkan `deleted` agar histori worksheet yang sudah terbentuk tetap dapat dihitung.

Jika tidak ada junction, method mengembalikan `undefined`, mengikuti pola SPML/CK.

## Controller dan Route

Tambahkan endpoint:

```http
GET /scoringEngine/pb/:worksheetPBId?peraturan=1
```

Ketentuan:

- `worksheetPBId` wajib tersedia;
- `peraturan` wajib berupa integer `1` atau `2`;
- dapat diakses oleh role `99`, `4`, `3`, `2`, dan `1`;
- user KPPN hanya dapat mengambil skor worksheet miliknya, sedangkan Kanwil mengikuti mekanisme akses scoring SPML/CK;
- worksheet tidak ditemukan menghasilkan 404;
- parameter tidak valid menghasilkan 400.

Parameter `peraturan` diteruskan secara eksplisit dari controller ke scoring engine. Scoring engine tidak bergantung pada payload autentikasi sehingga pure calculation tetap deterministik dan mudah diuji.

## Pengujian

Tambahkan unit test untuk mencakup:

### Peraturan 1

- checklist biasa dikonversi dari maksimum 10 ke skala 10;
- checklist standardisasi dikonversi dari maksimum 12 ke skala 10;
- rata-rata dihitung per komponen;
- bobot komponen diterapkan setelah rata-rata;
- nilai akhir merupakan jumlah nilai terbobot;
- nilai akhir peraturan 1 tetap berada pada skala 0–10;
- N/A tidak masuk total maupun pembagi;
- nilai null menjadi 0 tetapi tetap masuk pembagi;
- komponen tanpa checklist yang dapat dihitung menghasilkan 0.

### Peraturan 2

- seluruh checklist memakai maksimum 10 meskipun berstatus standardisasi;
- tidak ada pembobotan komponen;
- nilai akhir peraturan 2 berada pada skala 0–100;
- N/A tidak masuk total maupun pembagi;
- nilai null menjadi 0 dan tetap masuk pembagi;
- seluruh checklist N/A menghasilkan 0;
- hasil pecahan dibulatkan maksimal empat desimal.

### Integrasi model/controller

- query menggunakan `worksheetPBId` yang benar;
- peraturan diteruskan ke formula;
- akses worksheet dan validasi parameter berjalan;
- TypeScript build dan seluruh test backend lulus.

## Di Luar Ruang Lingkup

- Utility `getScoreForMatrix` dan endpoint score/progress lama tidak diubah pada tahap ini.
- Integrasi nilai PB baru ke frontend belum termasuk permintaan ini.
- Perhitungan gabungan skor pembinaan PB, SPML, dan CK akan dibahas terpisah.
