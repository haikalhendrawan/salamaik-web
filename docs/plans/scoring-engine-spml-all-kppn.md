# Rencana Endpoint Skor SPML Seluruh KPPN

## Tujuan

Menambahkan endpoint `ScoringEngine` untuk memperoleh skor Kertas Kerja SPML seluruh KPPN pada suatu period. Endpoint hanya dapat diakses oleh:

- Super Admin (`role 99`);
- Admin Kanwil (`role 4`);
- User Kanwil (`role 3`).

## Endpoint

```http
GET /scoringEngine/spml/period/:periodId
```

Ketentuan parameter:

- `periodId` wajib berupa integer positif.
- Period berasal dari parameter URL, bukan dari payload JWT, sesuai kebutuhan pemanggil.
- Endpoint tetap menggunakan middleware `authenticate` dan `authorize([99, 4, 3])`.

Route spesifik period ditempatkan sebelum route dinamis worksheet agar routing tetap eksplisit.

## Bentuk response

```json
{
  "success": true,
  "message": "All KPPN SPML worksheet scores calculated successfully",
  "rows": [
    {
      "worksheetSPMLId": "uuid-worksheet",
      "kppnId": "010",
      "name": "KPPN Padang",
      "alias": "Padang",
      "nilaiKPPN": 66.6667,
      "nilaiKanwil": 70,
      "detailKPPN": {
        "jumlahChecklist": 12,
        "jumlahNA": 2,
        "jumlahChecklistPembagi": 10,
        "totalSkorKonversi": 666.667
      },
      "detailKanwil": {
        "jumlahChecklist": 12,
        "jumlahNA": 2,
        "jumlahChecklistPembagi": 10,
        "totalSkorKonversi": 700
      }
    }
  ]
}
```

Catatan: dengan nilai checklist SPML saat ini yang hanya 0/10/null, `totalSkorKonversi` pada praktiknya berupa kelipatan 100; contoh desimal di atas hanya menunjukkan tipe numerik.

## Perubahan model `ScoringEngine`

Tambahkan metode:

```ts
calculateAllKPPNSPMLScores(periodId: number): Promise<AllKPPNSPMLScoreResult[]>
```

### Strategi query

- Gunakan satu query terparameterisasi untuk mengambil:
  - `worksheet_ref.id`;
  - `worksheet_ref.kppn_id`;
  - nama dan alias dari `kppn_ref`;
  - `kppn_score`, `kanwil_score`, dan `excluded` dari `worksheet_spml_junction`.
- Filter `worksheet_ref.period = $1`.
- Filter unit KPPN dengan `kppn_ref.level = 0`, konsisten dengan `getWorksheetByPeriod`.
- Urutkan dengan `kppn_ref.col_order` dan junction ID.
- Gunakan `INNER JOIN worksheet_spml_junction` agar response hanya berisi worksheet yang benar-benar mempunyai Kertas Kerja SPML. Worksheet PB lama yang tidak mempunyai junction SPML tidak dikembalikan sebagai skor 0 palsu.

### Pengelompokan dan perhitungan

- Kelompokkan hasil query berdasarkan worksheet ID.
- Gunakan kembali `calculateSPMLScoreFromRows` untuk setiap kelompok agar rumus satu worksheet dan seluruh KPPN tidak berbeda.
- Jangan menjalankan `calculateSPMLScore` satu kali per worksheet karena akan menghasilkan pola N+1 query.
- Normalisasi identitas KPPN dan score dalam tipe response yang eksplisit.

## Perubahan controller

Tambahkan handler `getAllKPPNSPMLScoresByPeriod`:

1. Parsing `req.params.periodId` menggunakan `Number`.
2. Tolak nilai yang bukan integer positif dengan status 400.
3. Panggil model bulk scoring.
4. Jika tidak ada worksheet SPML pada period tersebut, kembalikan `rows: []` dengan status 200 agar endpoint daftar mudah dikonsumsi frontend.
5. Kembalikan response envelope sesuai kontrak di atas.
6. Teruskan error database ke middleware `errorHandler`.

## Perubahan route

Pada `scoringEngineRoute.ts` tambahkan:

```ts
router.get(
  '/spml/period/:periodId',
  authenticate,
  authorize([99, 4, 3]),
  scoringEngineController.getAllKPPNSPMLScoresByPeriod
);
```

Endpoint skor satu worksheet tetap dapat diakses role yang sudah ditentukan sebelumnya dan tidak berubah.

## Pengujian

Tambahkan unit test/pengujian model untuk memastikan:

1. Beberapa worksheet dikelompokkan berdasarkan worksheet ID yang benar.
2. Rumus KPPN dan Kanwil sama dengan endpoint single worksheet.
3. Checklist N/A tidak masuk total maupun pembagi.
4. `null` non-N/A tetap masuk pembagi dengan kontribusi 0.
5. Urutan response mengikuti `kppn_ref.col_order`.
6. Worksheet tanpa junction SPML tidak masuk response.
7. Period tanpa SPML menghasilkan array kosong.
8. `periodId` invalid menghasilkan 400.
9. Role 99, 4, dan 3 dapat mengakses endpoint.
10. Role KPPN 2/1 ditolak middleware dengan 403.
11. Backend TypeScript build dan unit test berhasil.

## File yang diperkirakan berubah

- `backend/src/model/scoringEngine.model.ts`
- `backend/src/controller/scoringEngine.controller.ts`
- `backend/src/routes/scoringEngineRoute.ts`
- `backend/__test__/model/scoringEngine.model.test.ts`

Tidak diperlukan perubahan skema database maupun frontend untuk tahap endpoint ini.
