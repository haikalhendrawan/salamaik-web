# Rencana Scoring Engine Kertas Kerja CK

## Aturan Perhitungan

Perhitungan dilakukan terpisah untuk nilai KPPN dan Kanwil.

1. Setiap nilai dikonversi ke skala 100:
   - 10 menjadi 100.
   - 5 menjadi 50.
   - 0 menjadi 0.
   - N/A (`excluded = 1`) menjadi 100.
2. Seluruh hasil konversi dijumlahkan.
3. Nilai akhir adalah `totalSkorKonversi / jumlahChecklist`.
4. Checklist N/A tetap masuk ke total checklist dan pembagi.
5. Checklist yang belum diisi (`score = null` dan bukan N/A) dihitung 0 dan tetap masuk pembagi. Detail progress tetap membedakannya sebagai belum diisi.
6. Nilai akhir backend dibulatkan maksimal empat angka desimal; frontend menampilkan dua angka desimal.

## Kontrak Response

```json
{
  "nilaiKPPN": 83.3333,
  "nilaiKanwil": 66.6667,
  "detailKPPN": {
    "jumlahChecklist": 3,
    "jumlahChecklistDiisi": 3,
    "jumlahNA": 1,
    "jumlahChecklistPembagi": 3,
    "totalSkorKonversi": 250
  },
  "detailKanwil": {
    "jumlahChecklist": 3,
    "jumlahChecklistDiisi": 3,
    "jumlahNA": 1,
    "jumlahChecklistPembagi": 3,
    "totalSkorKonversi": 200
  }
}
```

## Backend

1. Menambahkan tipe hasil dan fungsi murni `calculateCKScoreFromRows` pada `scoringEngine.model.ts`.
2. Menambahkan metode model untuk mengambil seluruh junction berdasarkan `worksheetCKId` lalu menghitung nilai KPPN dan Kanwil.
3. Menambahkan controller `getCKScore` dengan:
   - Validasi parameter worksheet.
   - Response 404 bila worksheet CK tidak ditemukan.
   - Pemeriksaan akses KPPN/Kanwil yang sama dengan endpoint SPML.
4. Menambahkan endpoint:
   - `GET /scoringEngine/ck/:worksheetCKId`
   - Role: super admin, admin/user Kanwil, admin/user KPPN.
5. Tidak menyimpan nilai akhir ke database; nilai selalu dihitung dari junction terbaru.

## Frontend

1. Menambahkan tipe `CKScoreDetail` dan `CKScoreType`.
2. Menambahkan state score dan loading score pada provider `useWsCKJunction`.
3. Mengambil score dari server setelah data junction diperoleh.
4. Refresh score secara silent setelah perubahan skor dan ketika event live-sync diterima, tanpa menampilkan overlay halaman.
5. Mengganti placeholder footer tabel:
   - Row `Total Nilai` menampilkan `totalSkorKonversi` KPPN dan Kanwil.
   - Row `Nilai Kertas Kerja CK` menampilkan nilai akhir KPPN dan Kanwil dengan dua desimal.
6. Mengisi footer pada kedua sheet ekspor Excel menggunakan hasil scoring server.

## Pengujian

Menambahkan unit test untuk kasus:

- Nilai 10, 5, dan 0 dikonversi menjadi 100, 50, dan 0.
- N/A dihitung 100 dan tetap masuk pembagi.
- Nilai null dihitung 0 dan tetap masuk pembagi.
- Perhitungan KPPN dan Kanwil berbeda.
- Pembulatan maksimal empat angka desimal.
- Seluruh checklist N/A menghasilkan nilai 100.
- Worksheet tanpa junction menghasilkan 404.

Setelah implementasi, jalankan backend build/test serta frontend ESLint/build.
