# Rencana Informasi Refresh Terakhir pada Toolbar SPML

## Tujuan

Menambahkan informasi `Refresh Terakhir: xxx` pada toolbar Kertas Kerja SPML untuk menunjukkan waktu terakhir data worksheet berhasil disinkronkan, baik melalui initial load, perubahan user aktif, maupun silent live refresh dari user lain.

## Sumber waktu

- Tambahkan state context:

  ```ts
  lastRefreshedAt: Date | null
  ```

- Waktu menggunakan jam browser saat response terbaru berhasil diterapkan ke state frontend.
- Timestamp hanya diperbarui apabila:
  - request junction berhasil;
  - request tersebut masih merupakan request terbaru untuk worksheet aktif;
  - refresh scoring yang diminta juga telah selesai.
- Request gagal atau response stale tidak mengubah timestamp.
- Saat berpindah KPPN/worksheet, timestamp direset menjadi `null` agar waktu worksheet sebelumnya tidak tampil.

## Perubahan `useWsSPMLJunction`

- Tambahkan `lastRefreshedAt` pada state dan interface context.
- Pada kedua jalur pengambilan junction KPPN dan Kanwil:
  - setelah response terbaru berhasil diterapkan;
  - dan setelah ScoringEngine selesai jika `refreshScore` diperlukan;
  - jalankan `setLastRefreshedAt(new Date())`.
- Pastikan request stale tidak memperbarui waktu.
- Tambahkan reset timestamp ketika workspace berpindah worksheet, dapat digabungkan ke fungsi reset saat ini atau helper reset worksheet yang lebih eksplisit.
- Silent refresh tetap tidak memunculkan overlay; perubahan timestamp tidak memengaruhi state sinkronisasi komponen.

## Perubahan workspace dan toolbar

- Ambil `lastRefreshedAt` dari context pada `WorksheetSPMLWorkspace`.
- Teruskan sebagai prop ke `WorksheetSPMLToolbar` agar toolbar tetap bersifat presentational.
- Tambahkan row baru pada toolbar, disarankan setelah progress Kanwil dan sebelum Export:

  ```text
  Refresh Terakhir : 26/08/2026 14:35:42
  ```

- Format menggunakan `date-fns` yang sudah tersedia:

  ```ts
  format(lastRefreshedAt, 'dd/MM/yyyy HH:mm:ss')
  ```

- Saat belum pernah berhasil refresh, tampilkan `-`.
- Gunakan `Typography` dengan ukuran dan warna yang konsisten dengan row toolbar lain.
- Label, tanda titik dua, dan nilai mengikuti grid tiga bagian yang sudah digunakan toolbar.

## Perilaku yang diharapkan

1. Initial load berhasil: waktu langsung tampil.
2. User aktif mengubah nilai: waktu berubah setelah silent refresh selesai.
3. Event dari user lain: waktu berubah tanpa loading overlay.
4. Event komentar/link/file yang berhasil di-refresh juga memperbarui waktu.
5. Request gagal: waktu terakhir yang sukses tetap ditampilkan.
6. Berpindah KPPN: sementara tampil `-`, kemudian waktu baru muncul setelah worksheet baru berhasil dimuat.

## File yang diperkirakan berubah

- `frontend/src/sections/worksheetSPML/useWsSPMLJunction.tsx`
- `frontend/src/sections/worksheetSPML/WorksheetSPMLWorkspace.tsx`
- `frontend/src/sections/worksheetSPML/components/WorksheetSPMLToolbar.tsx`

Backend tidak memerlukan perubahan.

## Verifikasi

1. Toolbar menampilkan format `dd/MM/yyyy HH:mm:ss`.
2. Nilai awal `null` ditampilkan sebagai `-`.
3. Initial load memperbarui timestamp.
4. Silent live refresh memperbarui timestamp tanpa overlay.
5. Response stale tidak mengubah timestamp.
6. Error refresh mempertahankan waktu sukses terakhir.
7. Perpindahan worksheet mereset timestamp lama.
8. Frontend TypeScript build dan ESLint terarah berhasil.
