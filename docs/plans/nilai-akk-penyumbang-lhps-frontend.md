# Rencana Integrasi Frontend Nilai AKK Penyumbang LHPS

## Tujuan

Mengganti data mock pada tabel **Nilai AKK Penyumbang Nilai LHPS** dengan hasil endpoint:

```http
GET /scoringEngine/akk/lhps/:periodId/:peraturanId
```

Tabel tetap hanya ditampilkan kepada user Kanwil (`role 3`, `4`, dan `99`). Semua nilai, subtotal, bobot, dan nilai akhir harus berasal dari hasil kalkulasi server.

## Tipe Data

Tambahkan tipe respons pada `frontend/src/sections/nilai/types.ts`:

- `AKKContributorCategory`.
- `AKKContributorUnit`.
- `AKKContributorGroup`.
- `AKKContributorLHPSResponse`.

Kontrak frontend mengikuti respons backend. Bobot diterima dalam satuan persen, misalnya `45`, `35`, `20`, dan bobot kertas kerja `50`, `15`, `35`.

## Hook Pengambilan Data

Buat `useNilaiAKKPenyumbangLHPS.ts` dengan pola yang sama seperti `useNilaiAKK`:

- Hanya aktif ketika user merupakan Kanwil serta `periodId` dan `peraturanId` valid.
- Membatalkan request sebelumnya ketika periode/peraturan berubah.
- Menyediakan state:
  - `data`;
  - `error`;
  - `refreshError`;
  - `isLoading`;
  - `isRefreshing`;
  - `refresh()`;
  - `clearRefreshError()`.
- Refresh senyap mempertahankan data lama agar tabel tidak menghilang atau membuat halaman terasa freeze.

## Integrasi Halaman Nilai

Pada `NilaiSection.tsx`:

1. Panggil hook menggunakan `auth.period` dan `auth.peraturan` hanya untuk user Kanwil.
2. Tampilkan skeleton tabel saat initial load.
3. Tampilkan alert dan tombol **Coba Lagi** apabila endpoint gagal.
4. Kirim data dan status refresh ke komponen tabel.
5. Error refresh senyap ditampilkan melalui snackbar tanpa menghapus data yang sudah tampil.
6. Pemilihan tab KPPN tidak memicu request ulang tabel LHPS karena data tabel berlaku untuk seluruh KPPN dalam periode yang sama.

## Live Sync

Buat `useNilaiAKKPenyumbangLHPSLiveSync.ts`:

- Ambil seluruh `worksheetId` dari kelompok dalam respons endpoint.
- Join ke semua room `akk:worksheet` melalui event `joinAKKWorksheet` yang sudah tersedia.
- Dengarkan event `akkScoreChanged` untuk seluruh worksheet tersebut.
- Debounce refresh agar perubahan serentak tidak menimbulkan banyak request.
- Saat reconnect, join ulang seluruh room dan lakukan refresh senyap satu kali.
- Leave seluruh room ketika komponen dilepas atau daftar worksheet berubah.

Dengan mekanisme ini, perubahan nilai PB, CK, atau SPML dari KPPN mana pun akan memperbarui tabel agregat Kanwil tanpa loading overlay.

## Refactor Komponen Tabel

Ubah `TabelNilaiAKKPenyumbangLHPS.tsx` agar:

- menerima `data: AKKContributorLHPSResponse` dan `isRefreshing` melalui props;
- memetakan `data.kelompok`, bukan `MOCK_NILAI_AKK_GROUPS`;
- menggunakan `group.kppn` dan rincian `pb`, `spml`, serta `ck` langsung dari server;
- menampilkan `-` untuk komponen yang tidak berlaku pada peraturan 1;
- menampilkan indikator kecil pada card header ketika refresh senyap berlangsung;
- memakai kode visual `A`, `B`, `C` untuk kategori peraturan 2 dan satu kelompok untuk peraturan 1;
- menampilkan footer dari:
  - `jumlahNilaiAKKSeluruhKPPN`;
  - `jumlahBobotKPPNYangMemenuhi`;
  - `nilaiAkhirAspekKinerja`.

Formatter bobot akan disesuaikan karena API mengirim persen sebagai angka bulat. Formatter nilai tetap menggunakan titik sebagai pemisah desimal agar konsisten dengan perubahan UI sebelumnya.

## Export Excel

Ubah `useExcelNilaiAKKPenyumbangLHPS.ts` agar menerima respons server:

- tidak menghitung ulang nilai AKK atau kontribusi di browser;
- menggunakan nilai `pb`, `spml`, `ck`, `nilaiAKK`, dan `nilaiPenyumbangLHPS` dari API;
- menggunakan subtotal dan footer dari API;
- membagi bobot API dengan `100` hanya untuk penyimpanan nilai persen pada cell Excel;
- mencantumkan nama periode pada metadata dan nama file.

Dengan demikian file Excel dan tabel UI selalu merepresentasikan hasil scoring engine yang sama.

## Pembersihan Mock

Setelah tidak ada import tersisa, hapus:

```text
frontend/src/sections/nilai/mockNilaiAKKPenyumbangLHPS.ts
```

## Verifikasi

1. ESLint pada seluruh file yang diubah.
2. TypeScript `tsc --noEmit`.
3. Build produksi frontend.
4. Pastikan user KPPN tidak memanggil endpoint dan tidak melihat tabel.
5. Pastikan perubahan skor salah satu worksheet memicu refresh senyap tabel agregat.
6. Pastikan nilai UI dan hasil export Excel memakai data respons yang sama.
