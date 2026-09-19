# Rencana Endpoint Nilai Aspek Kinerja KPPN (AKK)

## Tujuan

Menambahkan endpoint scoring engine untuk menghitung Nilai Aspek Kinerja KPPN berdasarkan:

- ID KPPN;
- ID periode;
- ID peraturan.

Formula yang digunakan:

- Peraturan `1`: AKK sama dengan nilai Kertas Kerja PB.
- Peraturan `2`: `50% × PB + 35% × CK + 15% × SPML`.

Karena setiap kertas kerja menyimpan skor versi KPPN dan versi Kanwil, endpoint mengembalikan `nilaiKPPN` dan `nilaiKanwil` dengan formula yang diterapkan secara terpisah pada masing-masing versi.

## Kontrak Endpoint

```http
GET /scoringEngine/akk/:kppnId/:periodId/:peraturanId
```

Contoh:

```http
GET /scoringEngine/akk/010/12/2
```

Endpoint menggunakan middleware autentikasi dan role yang sama dengan endpoint skor per worksheet:

```ts
authorize([99, 4, 3, 2, 1])
```

Pembatasan unit tetap diterapkan pada controller:

- user Kanwil dapat mengambil nilai KPPN yang berada dalam cakupan akses Kanwil;
- user KPPN hanya dapat mengambil nilai untuk ID KPPN miliknya sendiri.

## Response

Rancangan response sukses:

```json
{
  "success": true,
  "message": "AKK score calculated successfully",
  "rows": {
    "kppnId": "010",
    "periodId": 12,
    "peraturan": 2,
    "worksheetId": "worksheet-uuid",
    "nilaiKPPN": 87.5,
    "nilaiKanwil": 85.25,
    "detailKPPN": {
      "pb": { "nilai": 90, "bobot": 50, "kontribusi": 45 },
      "ck": { "nilai": 85, "bobot": 35, "kontribusi": 29.75 },
      "spml": { "nilai": 85, "bobot": 15, "kontribusi": 12.75 }
    },
    "detailKanwil": {
      "pb": { "nilai": 88, "bobot": 50, "kontribusi": 44 },
      "ck": { "nilai": 82, "bobot": 35, "kontribusi": 28.7 },
      "spml": { "nilai": 83.6667, "bobot": 15, "kontribusi": 12.55 }
    }
  }
}
```

Semua hasil akhir dan kontribusi dibulatkan maksimal empat angka di belakang koma, mengikuti kontrak scoring engine yang sudah ada.

Untuk peraturan `1`, detail hanya membutuhkan PB:

```json
{
  "nilaiKPPN": 8.25,
  "nilaiKanwil": 8,
  "detailKPPN": {
    "pb": { "nilai": 8.25, "bobot": 100, "kontribusi": 8.25 },
    "ck": null,
    "spml": null
  }
}
```

Skala sengaja tidak disamakan lintas peraturan:

- peraturan `1` mengikuti skor PB lama pada skala 0–10;
- peraturan `2` mengikuti skor PB/CK/SPML baru pada skala 0–100.

## Perubahan Model Scoring Engine

File: `backend/src/model/scoringEngine.model.ts`

### Tipe baru

Tambahkan tipe berikut:

- `AKKScoreComponentDetail` untuk `nilai`, `bobot`, dan `kontribusi`;
- `AKKSideDetail` untuk rincian PB, CK, dan SPML;
- `AKKScoreResult` untuk response perhitungan akhir;
- gunakan kembali `PBRegulation` sebagai tipe peraturan `1 | 2`.

### Fungsi perhitungan murni

Tambahkan fungsi yang diekspor agar formula dapat diuji tanpa database, misalnya:

```ts
calculateAKKScoreFromWorksheetScores(peraturan, pbScore, ckScore, spmlScore)
```

Perilakunya:

1. Peraturan `1` mengembalikan nilai PB apa adanya untuk setiap sisi.
2. Peraturan `2` menghitung kontribusi setiap nilai sesuai bobot 50/35/15.
3. Nilai akhir merupakan jumlah seluruh kontribusi pada sisi yang sama.
4. Peraturan selain `1` atau `2` ditolak.

### Metode model

Tambahkan metode:

```ts
calculateAKKScore(kppnId, periodId, peraturan, poolTrx?)
```

Alur metode:

1. Cari `worksheet_ref` berdasarkan `kppn_id` dan `period`.
2. Jika tidak ditemukan, kembalikan `undefined` agar controller memberi response 404.
3. Hitung PB dengan `calculatePBScore(worksheetId, peraturan)`.
4. Untuk peraturan `1`, langsung susun AKK dari PB tanpa meminta CK dan SPML.
5. Untuk peraturan `2`, ambil skor CK dan SPML menggunakan worksheet ID yang sama.
6. Gabungkan skor menggunakan fungsi AKK murni.

Null pada skor checklist tetap mengikuti aturan setiap scoring engine yang sudah ada, yaitu diperlakukan sebagai nol dalam perhitungan. Dengan demikian AKK dapat ditampilkan walaupun pengisian belum lengkap; progress pengisian tetap tersedia pada detail skor worksheet masing-masing.

## Perubahan Controller

File: `backend/src/controller/scoringEngine.controller.ts`

Tambahkan handler `getAKKScore` dengan validasi:

- `kppnId` wajib berupa string non-kosong;
- `periodId` wajib positive integer;
- `peraturanId` hanya boleh `1` atau `2`;
- akses KPPN harus sesuai dengan payload user;
- worksheet KPPN/periode yang tidak ditemukan menghasilkan HTTP 404;
- untuk peraturan `2`, junction PB, CK, atau SPML yang tidak tersedia dianggap assignment tidak lengkap dan menghasilkan error yang jelas, bukan diam-diam diberi nilai nol.

## Perubahan Route

File: `backend/src/routes/scoringEngineRoute.ts`

Tambahkan:

```ts
router.get(
  "/akk/:kppnId/:periodId/:peraturanId",
  authenticate,
  authorize([99, 4, 3, 2, 1]),
  scoringEngineController.getAKKScore
);
```

Route diletakkan sebelum route dinamis lain bila diperlukan agar tidak terjadi benturan pencocokan URL.

## Penanganan Data Tidak Lengkap

- Tidak ada `worksheet_ref` untuk KPPN/periode: HTTP 404.
- Peraturan `1` tanpa junction PB: error data skor PB tidak ditemukan.
- Peraturan `2` tanpa salah satu junction PB/CK/SPML: error assignment worksheet tidak lengkap.
- Checklist ada tetapi nilainya `NULL`: tetap dihitung sebagai nol sesuai formula scoring masing-masing worksheet saat ini.
- Seluruh checklist suatu worksheet habis dikecualikan: mengikuti nilai hasil scoring engine worksheet tersebut.

## Pengujian

Perbarui `backend/__test__/model/scoringEngine.model.test.ts` dengan skenario:

1. Peraturan 1 menghasilkan AKK yang identik dengan PB versi KPPN dan Kanwil.
2. Peraturan 2 menghitung `50% PB + 35% CK + 15% SPML` untuk kedua sisi.
3. Kontribusi dan nilai akhir dibulatkan maksimal empat desimal.
4. Formula tidak mencampur skor versi KPPN dengan versi Kanwil.
5. Peraturan yang tidak didukung ditolak.
6. Build TypeScript backend berhasil.

## File yang Akan Diubah

- `backend/src/model/scoringEngine.model.ts`
- `backend/src/controller/scoringEngine.controller.ts`
- `backend/src/routes/scoringEngineRoute.ts`
- `backend/__test__/model/scoringEngine.model.test.ts`

Tidak diperlukan migrasi database karena seluruh nilai dihitung secara langsung dari data junction yang sudah ada.
