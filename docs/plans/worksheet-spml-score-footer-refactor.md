# Rencana Refactor ScoreFooterCell dan Format Dua Desimal

## Tujuan

1. Memindahkan `ScoreFooterCell` dari `WorksheetSPMLTable.tsx` ke komponen tersendiri.
2. Menampilkan nilai KPPN dan Kanwil dengan tepat dua angka di belakang koma pada frontend.
3. Mempertahankan nilai response backend hingga empat desimal agar presisi data tidak berubah.

## Perubahan komponen

- Buat file baru:

  `frontend/src/sections/worksheetSPML/components/WorksheetSPMLTable/components/ScoreFooterCell.tsx`

- Pindahkan seluruh tanggung jawab cell footer ke komponen tersebut:
  - rendering `TableCell`;
  - loading indicator;
  - tooltip detail checklist;
  - fallback `-` ketika nilai belum tersedia;
  - format nilai dua desimal.
- Props komponen tetap eksplisit:
  - `value: number | undefined`;
  - `detail: SPMLScoreDetail | undefined`;
  - `loading: boolean`;
  - `label: string`.
- `WorksheetSPMLTable.tsx` hanya mengimpor dan menggunakan komponen baru untuk kolom nilai KPPN dan Kanwil.
- Hapus import MUI dan tipe yang tidak lagi digunakan oleh komponen tabel utama, seperti `CircularProgress`, `Tooltip`, dan `SPMLScoreDetail`.

## Aturan format nilai

- Gunakan `value.toFixed(2)` hanya pada lapisan presentasi.
- Contoh tampilan:
  - `100` menjadi `100.00`;
  - `66.6667` menjadi `66.67`;
  - `12.5` menjadi `12.50`;
  - `0` menjadi `0.00`.
- Jangan memakai pengecekan berbasis truthy karena nilai `0` merupakan nilai sah.
- Fallback `-` hanya digunakan ketika `value === undefined`.
- State context dan response backend tetap bertipe `number`; hasil `toFixed(2)` hanya digunakan sebagai string tampilan dan tidak disimpan kembali ke state.

## Dampak backend

Tidak ada perubahan backend. `ScoringEngine` tetap mengirim nilai numerik dengan presisi maksimal empat angka di belakang koma.

## Verifikasi

1. Footer tetap sejajar dengan kolom Nilai KPPN dan Nilai Kanwil.
2. Nilai `100` tampil sebagai `100.00`.
3. Nilai `66.6667` tampil sebagai `66.67`.
4. Nilai `0` tampil sebagai `0.00`, bukan `-`.
5. Ketika skor belum tersedia, cell menampilkan `-` atau loading indicator.
6. Tooltip detail dan indikator refresh tetap berfungsi.
7. `WorksheetSPMLTable.tsx` tidak lagi mendefinisikan `ScoreFooterCell` secara lokal.
8. Frontend TypeScript build dan ESLint terarah berhasil.
