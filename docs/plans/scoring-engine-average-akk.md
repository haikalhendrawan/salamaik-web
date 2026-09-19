# Rencana Endpoint Rata-Rata Nilai Kinerja KPPN

## Tujuan

Menambahkan endpoint scoring engine untuk menghitung rata-rata Nilai Aspek Kinerja KPPN (AKK) dalam satu periode dan peraturan.

Sumber nilai per unit adalah endpoint/fungsi AKK yang sudah tersedia, sehingga formula PB, CK, dan SPML tidak diduplikasi.

## Kontrak Endpoint

Rute yang disarankan:

```http
GET /scoringEngine/akk/average/:periodId/:peraturanId
```

Contoh:

```http
GET /scoringEngine/akk/average/12/2
```

Route agregat wajib dideklarasikan sebelum:

```http
/akk/:kppnId/:periodId/:peraturanId
```

agar kata `average` tidak dianggap sebagai `kppnId`.

Hak akses yang disarankan hanya untuk pihak yang boleh melihat seluruh KPPN:

```ts
authorize([99, 4, 3])
```

yaitu super admin, admin Kanwil, dan user Kanwil.

## Formula Peraturan 1

Ambil seluruh AKK untuk KPPN yang memiliki worksheet pada periode terkait, lalu hitung secara terpisah untuk versi KPPN dan Kanwil:

```text
rataRataKPPN   = jumlah seluruh AKK versi KPPN / jumlah KPPN
rataRataKanwil = jumlah seluruh AKK versi Kanwil / jumlah KPPN
```

Nilainya tetap pada skala 0–10 karena AKK peraturan 1 berasal dari skor PB lama.

## Formula Peraturan 2

Kategori bobot yang disebutkan:

| Kategori | Kondisi | Bobot |
|---|---|---:|
| A1 Provinsi | `tipe = 'A1'` dan `provinsi = 1` | 45% |
| A1 Nonprovinsi | `tipe = 'A1'` dan `provinsi = 0` | 35% |
| A2 | `tipe = 'A2'` | 20% |

### Formula yang disepakati

Hitung rata-rata AKK di dalam setiap kategori terlebih dahulu, kemudian bobotkan rata-rata kategori. Pembagi akhir adalah jumlah bobot kategori, yaitu 100%, bukan jumlah KPPN:

```text
nilai akhir = (
    (rata-rata A1 Provinsi × 45)
    + (rata-rata A1 Nonprovinsi × 35)
    + (rata-rata A2 × 20)
  ) / 100
```

Formula ini mempertahankan skala hasil 0–100 dan memastikan bobot ketiga kategori berjumlah 100%.

Contoh jika semua KPPN memiliki nilai 100:

```text
(100 × 45%) + (100 × 35%) + (100 × 20%) = 100
```

### Pengelompokan KPPN saat ini

Dengan asumsi data unit saat ini, pengelompokannya adalah:

- A1 Provinsi: KPPN Padang.
- A1 Nonprovinsi: KPPN Bukittinggi dan KPPN Solok.
- A2: KPPN Painan, KPPN Lubuk Sikaping, dan KPPN Sijunjung.

Jumlah KPPN dalam suatu kategori hanya menjadi pembagi untuk mendapatkan rata-rata kategori tersebut. Setelah itu bobot kategori tetap 45%, 35%, dan 20% tanpa dipengaruhi banyaknya anggota kategori.

## Validasi Data Peraturan 2

Karena formula peraturan 2 hanya mendefinisikan tiga kategori dan ketiganya diasumsikan tersedia, endpoint akan menolak kalkulasi dengan HTTP 409 jika:

- `tipe` salah satu KPPN masih `NULL`;
- terdapat KPPN bertipe `Kh`, `K1`, `K2`, atau `K3` yang memiliki worksheet pada periode tersebut tetapi belum memiliki aturan bobot;
- salah satu kategori A1 Provinsi, A1 Nonprovinsi, atau A2 tidak memiliki anggota/worksheet pada periode tersebut;
- nilai `provinsi` tidak valid.

Validasi ketat mencegah hasil terlihat sah ketika total kategori tidak benar-benar mewakili bobot 100%. Jika nantinya tipe lain perlu ikut dihitung, bobotnya perlu ditambahkan melalui perubahan aturan bisnis.

## Rancangan Response

Endpoint mengembalikan kedua versi nilai agar konsisten dengan seluruh scoring engine:

```json
{
  "success": true,
  "message": "Average AKK score calculated successfully",
  "rows": {
    "periodId": 12,
    "peraturan": 2,
    "jumlahKPPN": 7,
    "nilaiRataRataKPPN": 88.125,
    "nilaiRataRataKanwil": 85.75,
    "detailKategori": [
      {
        "kategori": "A1_PROVINSI",
        "bobot": 45,
        "jumlahKPPN": 1,
        "rataRataKPPN": 90,
        "rataRataKanwil": 88,
        "kontribusiKPPN": 40.5,
        "kontribusiKanwil": 39.6
      }
    ],
    "detailKPPN": [
      {
        "kppnId": "010",
        "name": "KPPN Padang",
        "alias": "Padang",
        "tipe": "A1",
        "provinsi": 1,
        "nilaiKPPN": 90,
        "nilaiKanwil": 88
      }
    ]
  }
}
```

Nilai dibulatkan maksimal empat angka di belakang koma.

## Perubahan Model

File: `backend/src/model/scoringEngine.model.ts`

Tambahkan:

- tipe data kategori dan detail response rata-rata AKK;
- fungsi murni peraturan 1 untuk average biasa;
- fungsi murni peraturan 2 sesuai formula bisnis yang dikonfirmasi;
- metode `calculateAverageAKKScore(periodId, peraturan, poolTrx?)`.

Metode mengambil hanya KPPN level `0` yang memiliki `worksheet_ref` pada periode tersebut, termasuk metadata:

- `kppn_ref.tipe`;
- `kppn_ref.provinsi`;
- `kppn_ref.name`;
- `kppn_ref.alias`.

## Strategi Query dan Performa

Hindari pola N+1 yang memanggil endpoint AKK satu kali untuk setiap KPPN.

Strategi yang disarankan:

1. Ambil seluruh worksheet dan metadata KPPN untuk periode dalam satu query.
2. Ambil junction PB seluruh worksheet periode dalam satu query dan kelompokkan berdasarkan `worksheet_id`.
3. Untuk peraturan 2, lakukan hal yang sama untuk CK dan SPML.
4. Gunakan fungsi kalkulasi worksheet yang sudah ada pada setiap kelompok data.
5. Susun AKK per KPPN menggunakan fungsi `calculateAKKScoreFromWorksheetScores`.
6. Agregasikan seluruh AKK dengan fungsi rata-rata baru.

Dengan pendekatan ini, jumlah query tetap konstan terhadap jumlah KPPN dan tidak meningkat menjadi tiga query tambahan per KPPN.

## Perubahan Controller dan Route

File yang diubah:

- `backend/src/controller/scoringEngine.controller.ts`
- `backend/src/routes/scoringEngineRoute.ts`

Validasi controller:

- `periodId` harus positive integer;
- `peraturanId` hanya `1` atau `2`;
- periode tanpa worksheet menghasilkan HTTP 404;
- metadata/bobot yang tidak lengkap menghasilkan HTTP 409;
- endpoint dibatasi untuk role Kanwil dan super admin.

## Pengujian

Tambahkan unit test untuk:

1. Average biasa pada peraturan 1, terpisah antara versi KPPN dan Kanwil.
2. Formula rata-rata kategori peraturan 2 dengan pembagi total bobot 100%.
3. Beberapa KPPN dalam kategori yang sama.
4. Pembulatan maksimal empat desimal.
5. Metadata `tipe = NULL`.
6. Tipe tanpa bobot (`Kh`, `K1`, `K2`, `K3`) menghasilkan error konfigurasi.
7. Kategori kosong menghasilkan error konfigurasi.
8. Tidak ada worksheet pada periode.
9. Build TypeScript backend.

## File yang Akan Diubah

- `backend/src/model/scoringEngine.model.ts`
- `backend/src/controller/scoringEngine.controller.ts`
- `backend/src/routes/scoringEngineRoute.ts`
- `backend/__test__/model/scoringEngine.model.test.ts`

Tidak diperlukan migrasi database tambahan, tetapi migrasi `kppn_ref.tipe` dan `kppn_ref.provinsi` harus sudah dijalankan serta datanya harus sudah diisi sebelum formula peraturan 2 digunakan.
