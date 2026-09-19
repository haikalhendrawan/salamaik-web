# Rencana Refactor Perhitungan Skor PB

## Tujuan

Memecah `calculatePBScoreFromRows` agar aturan PER-1 dan ND-635 tidak bercampur dalam satu fungsi panjang. Refactor hanya mengubah struktur kode; formula, response, pembulatan, query, dan endpoint tidak berubah.

## Struktur yang Direncanakan

### Fungsi utama

`calculatePBScoreFromRows(rows, peraturan)` hanya akan:

1. memvalidasi bahwa `peraturan` bernilai `1` atau `2`;
2. menjalankan `calculatePBScorePer1(rows)` untuk peraturan 1;
3. menjalankan `calculatePBScoreND635(rows)` untuk peraturan 2.

Struktur delegasi:

```ts
if (peraturan === 1) {
  return calculatePBScorePer1(rows);
}

return calculatePBScoreND635(rows);
```

### `calculatePBScorePer1`

Fungsi ini khusus menangani:

- pengelompokan checklist berdasarkan komponen;
- konversi nilai biasa dan standardisasi ke skala 10;
- penghapusan checklist N/A dari pembagi;
- rata-rata per komponen;
- bobot komponen;
- penjumlahan nilai akhir berskala 10;
- detail komponen KPPN dan Kanwil.

### `calculatePBScoreND635`

Fungsi ini khusus menangani:

- konversi seluruh nilai ke skala 100;
- penghapusan checklist N/A dari pembagi;
- rata-rata seluruh checklist;
- tidak menggunakan standardisasi atau bobot komponen;
- nilai akhir berskala 100.

### Helper bersama

Tambahkan helper kecil untuk data statistik yang digunakan kedua formula:

- jumlah seluruh checklist;
- jumlah checklist yang sudah diisi;
- jumlah N/A;
- jumlah checklist pembagi;
- filter row non-N/A.

Tipe row PB yang panjang akan diberi alias tersendiri agar signature helper tidak menggunakan `Pick<...>` berulang kali.

## Kompatibilitas

Hal berikut harus tetap sama sebelum dan setelah refactor:

- bentuk `PBScoreResult`;
- nilai KPPN dan Kanwil;
- detail dan detail per komponen;
- penanganan nilai `NULL`;
- penanganan seluruh checklist N/A;
- pembulatan empat desimal;
- method `calculatePBScore` dan endpoint HTTP.

Helper formula dapat tetap bersifat internal. Hanya `calculatePBScoreFromRows` yang perlu menjadi public API untuk unit test dan pemanggilan model.

## Verifikasi

- Jalankan seluruh unit test scoring engine yang sudah ada sebagai regression test.
- Tambahkan atau sesuaikan test hanya jika dibutuhkan untuk memastikan delegasi peraturan 1 dan 2.
- Jalankan TypeScript build backend.
- Pastikan hasil test peraturan 1 dan ND-635 identik dengan hasil sebelum refactor.

