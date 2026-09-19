# Rencana Export Excel dari Selection Card SPML dan CK

## Tujuan

Memperbaiki tombol Excel pada selection card SPML agar mengunduh kertas kerja SPML, serta menambahkan tombol Excel pada selection card CK untuk mengunduh kertas kerja CK.

## Masalah Saat Ini

- `worksheetSPML/components/KPPNSelectionCard.tsx` merupakan salinan pola PB dan masih:
  - memanggil endpoint junction PB;
  - memanggil endpoint score/progress PB;
  - menggunakan `useExcelWorksheet` dan `useExcelWorksheet2` milik PB;
  - membaca referensi komponen/subkomponen PB.
- Selection card CK hanya memiliki tombol Open dan belum menyediakan aksi export.
- Exporter SPML dan CK yang benar sudah tersedia dan digunakan pada toolbar workspace masing-masing.

## Refactor Exporter

Untuk menghindari pemanggilan fungsi bernama `use...` dari dalam event handler, masing-masing file exporter akan menyediakan fungsi generator biasa yang dapat dipanggil setelah data selesai diambil:

```ts
generateExcelWorksheetSPML(params)
generateExcelWorksheetCK(params)
```

Default hook yang sudah digunakan toolbar tetap dipertahankan dan menjadi wrapper atas fungsi generator tersebut. Dengan demikian:

- toolbar workspace tidak mengalami perubahan kontrak;
- selection card dapat mengambil data terbaru lalu memanggil generator secara aman;
- logika pembuatan workbook tidak diduplikasi.

## Selection Card SPML

### Data yang dibutuhkan

Tambahkan prop `worksheetSPMLId` pada card. Saat tombol Excel diklik, ambil secara paralel:

- junction SPML:
  `GET /wsSPMLJunction/getWsSPMLJunctionByWorksheetForKanwil?kppn=<kppnId>`;
- score SPML:
  `GET /scoringEngine/spml/<worksheetSPMLId>`.

Gunakan referensi yang benar dari `useDictionary`:

- `komponenSpmlRef`;
- `subKomponenSpmlRef`;
- `aspekSpmlRef`.

Kemudian panggil `generateExcelWorksheetSPML` dengan rows, nama KPPN, referensi SPML, dan score terbaru.

### UI/UX

- Pertahankan posisi dan ikon Excel yang sudah ada.
- Nonaktifkan tombol selama export berjalan untuk mencegah klik ganda.
- Tampilkan spinner kecil pada tombol selama request/generasi.
- Gunakan snackbar sukses/gagal, bukan hanya `console.error`.
- Jika data junction kosong, tampilkan pesan dan jangan menghasilkan workbook kosong.

### Landing SPML

Teruskan `item.worksheetSPMLId` ke setiap selection card.

## Selection Card CK

### Props dan data

Tambahkan prop:

- `kppnId`;
- `worksheetCKId`.

Saat tombol diklik, ambil secara paralel:

- junction CK:
  `GET /wsCKJunction/getWsCKJunctionByWorksheetForKanwil?kppn=<kppnId>`;
- score CK:
  `GET /scoringEngine/ck/<worksheetCKId>`.

Kemudian panggil `generateExcelWorksheetCK` dengan rows, nama KPPN, dan score terbaru.

### UI/UX

- Ubah area aksi agar tombol Open berada di kiri dan tombol Excel di kanan, mengikuti selection card SPML/PB.
- Gunakan tooltip dan ikon Excel yang sama.
- Tombol dinonaktifkan dan menampilkan spinner selama proses export.
- Tampilkan snackbar sukses/gagal.

### Landing CK

Teruskan `item.kppnId` dan `item.worksheetCKId` ke selection card.

## Konsistensi dan Akses

- Fitur selection card hanya digunakan pada landing Kanwil, sehingga endpoint Kanwil yang sudah ada dapat digunakan.
- URL diberi timestamp untuk mencegah cache data junction lama.
- Score diambil ulang saat klik agar footer Excel tidak memakai state progress landing yang mungkin sudah stale.
- Export tidak menggunakan loading overlay global; hanya tombol terkait yang masuk state loading agar card lain tetap dapat digunakan.

## Verifikasi

- Tombol SPML tidak lagi memanggil endpoint atau generator PB.
- File dari card SPML berisi sheet Kertas Kerja SPML dengan format terbaru.
- Card CK menampilkan tombol Excel dan menghasilkan sheet Kertas Kerja CK dengan format terbaru.
- Footer kedua workbook menggunakan score terbaru dari server.
- Klik ganda dicegah selama export.
- Error API menampilkan snackbar dan mengaktifkan kembali tombol.
- Toolbar export SPML/CK tetap berfungsi setelah exporter direfaktor.
- Jalankan lint file terkait dan production build frontend.

