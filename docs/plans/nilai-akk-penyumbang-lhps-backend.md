# Rencana Backend Nilai AKK Penyumbang LHPS

## Tujuan

Menambahkan endpoint pada `ScoringEngine` yang menyediakan data lengkap untuk tabel **Nilai AKK Penyumbang Nilai LHPS** per periode. Endpoint menghitung nilai langsung di server dan hanya dapat diakses oleh Super Admin, Admin Kanwil, dan User Kanwil.

## Kondisi Saat Ini

- `calculateAKKScore` sudah menghitung AKK satu KPPN berikut rincian nilai PB, SPML, CK, bobot, dan kontribusinya.
- `calculateAverageAKKScore` sudah mengambil seluruh KPPN dalam satu periode dan menghitung agregasi berdasarkan kategori KPPN.
- Untuk peraturan 2, kategori dan bobot yang sudah tersedia adalah:
  - A1 Provinsi: 45%.
  - A1 Non Provinsi: 35%.
  - A2: 20%.
- Endpoint rata-rata saat ini hanya mengembalikan nilai AKK akhir setiap KPPN. Rincian PB, SPML, dan CK per KPPN tidak ikut dikirim, sehingga belum cukup untuk mengisi seluruh kolom tabel LHPS.

## Endpoint Baru

```http
GET /scoringEngine/akk/lhps/:periodId/:peraturanId
```

Hak akses:

- Super Admin (`99`).
- Admin Kanwil (`4`).
- User Kanwil (`3`).

Validasi:

- `periodId` harus berupa integer positif.
- `peraturanId` hanya boleh `1` atau `2`.
- Mengembalikan `404` apabila tidak ada assignment worksheet pada periode tersebut.
- Mengembalikan `409` apabila assignment PB/CK/SPML yang diwajibkan belum lengkap atau metadata `tipe/provinsi` KPPN tidak valid.

## Struktur Respons

```ts
{
  success: true,
  message: string,
  rows: {
    periodId: number,
    periodName: string,
    peraturan: 1 | 2,
    jumlahKPPN: number,
    kelompok: Array<{
      kategori: "A1_PROVINSI" | "A1_NON_PROVINSI" | "A2" | "SELURUH_KPPN",
      label: string,
      bobot: number,
      jumlahKPPN: number,
      rataRataAKK: number,
      kontribusiLHPS: number,
      kppn: Array<{
        worksheetId: string,
        kppnId: string,
        name: string,
        alias: string,
        tipe: string | null,
        provinsi: 0 | 1,
        pb: { nilai: number, bobot: number, kontribusi: number },
        spml: { nilai: number, bobot: number, kontribusi: number } | null,
        ck: { nilai: number, bobot: number, kontribusi: number } | null,
        nilaiAKK: number,
        bobotKPPN: number,
        nilaiPenyumbangLHPS: number
      }>
    }>,
    jumlahNilaiAKKSeluruhKPPN: number,
    jumlahBobotKPPNYangMemenuhi: number,
    nilaiAkhirAspekKinerja: number
  }
}
```

Nilai yang menjadi dasar tabel LHPS adalah hasil **penilaian Kanwil** (`detailKanwil` dan `nilaiKanwil`), karena nilai tersebut merupakan hasil reviu/final yang disumbangkan ke LHPS.

## Formula

### Peraturan 2

1. Hitung AKK masing-masing KPPN:

   ```text
   AKK = (PB × 50%) + (SPML × 15%) + (CK × 35%)
   ```

2. Kelompokkan berdasarkan metadata KPPN:

   - `tipe = A1`, `provinsi = 1` → A1 Provinsi.
   - `tipe = A1`, `provinsi = 0` → A1 Non Provinsi.
   - `tipe = A2` → A2.

3. Nilai penyumbang setiap KPPN:

   ```text
   nilaiPenyumbangLHPS = AKK × bobotKelompok
   ```

4. Kontribusi kelompok menggunakan rata-rata nilai penyumbang seluruh KPPN dalam kelompok tersebut. Dengan demikian jumlah KPPN yang lebih banyak dalam satu kategori tidak menggandakan bobot kategori.

5. Nilai akhir:

   ```text
   jumlahNilaiAKKSeluruhKPPN = jumlah kontribusi seluruh kelompok
   nilaiAkhirAspekKinerja = jumlahNilaiAKKSeluruhKPPN / jumlahBobotKPPNYangMemenuhi
   ```

   Bobot dikirim dalam satuan persen (`45`, `35`, `20`), sehingga pembagian akhir secara program menormalisasi bobot ke skala `1`.

### Peraturan 1

Untuk kompatibilitas histori:

- Nilai AKK sama dengan nilai PB.
- Seluruh KPPN ditempatkan pada kelompok `SELURUH_KPPN` dengan bobot 100%.
- SPML dan CK bernilai `null`.
- Nilai akhir merupakan rata-rata AKK seluruh KPPN.

## Perubahan Model

1. Ekstrak proses pengambilan dan perhitungan AKK seluruh KPPN dari `calculateAverageAKKScore` menjadi helper internal bersama.
2. Helper menghasilkan metadata KPPN serta `AKKScoreResult` lengkap agar dapat dipakai oleh:
   - endpoint rata-rata AKK yang sudah ada;
   - endpoint tabel penyumbang LHPS yang baru.
3. Tambahkan pure function untuk membentuk kelompok dan agregasi LHPS. Seluruh hasil numerik dibulatkan maksimal empat angka desimal, konsisten dengan scoring engine lain.
4. Pertahankan bentuk respons endpoint `/akk/average` agar frontend lama tidak rusak.

## Perubahan Controller dan Route

1. Tambahkan handler `getAKKContributorLHPS` di `scoringEngine.controller.ts`.
2. Terapkan validasi parameter yang sama dengan endpoint AKK lain.
3. Tambahkan route sebelum route dinamis `/akk/:kppnId/:periodId/:peraturanId` agar segmen `lhps` tidak terbaca sebagai `kppnId`.
4. Terapkan middleware `authenticate` dan `authorize([99, 4, 3])`.

## Pengujian

Tambahkan unit test pada `scoringEngine.model.test.ts` untuk memastikan:

1. Peraturan 2 menghitung AKK dan kontribusi PB/SPML/CK setiap KPPN dengan benar.
2. KPPN dikelompokkan sesuai `tipe` dan `provinsi`.
3. Kelompok dengan beberapa KPPN dirata-ratakan sebelum bobot kelompok digabungkan.
4. Total bobot 45% + 35% + 20% menghasilkan 100%.
5. Nilai akhir sesuai dengan contoh workbook referensi.
6. Peraturan 1 memakai PB dan rata-rata seluruh KPPN tanpa kategori tipe.
7. Metadata tidak valid, kategori kosong, assignment tidak lengkap, periode kosong, dan parameter tidak valid menghasilkan error yang tepat.
8. Endpoint hanya dapat diakses role Kanwil yang diizinkan.

## Dampak Database

Tidak diperlukan migrasi baru. Implementasi menggunakan:

- `kppn_ref.tipe`;
- `kppn_ref.provinsi`;
- assignment pada `worksheet_ref`;
- data junction PB, CK, dan SPML yang sudah tersedia.

## Tahap Frontend Berikutnya

Setelah endpoint tersedia, data mock pada tabel akan diganti dengan respons endpoint. Struktur visual dan export Excel tetap dapat digunakan; sumber `groups` serta nilai footer saja yang dialihkan dari mock ke API.
