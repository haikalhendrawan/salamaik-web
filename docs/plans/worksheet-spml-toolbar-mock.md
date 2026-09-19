# Rencana Mock UI Toolbar Worksheet SPML

## Tujuan

Menambahkan toolbar informasi kertas kerja di `WorksheetSPMLWorkspace`, ditempatkan di antara nama KPPN dan Card tabel SPML.

## Bentuk UI

Toolbar dibuat sebagai Card/Box ringkas dengan tiga baris responsif:

1. `Progress KPPN` — `LinearProgressWithLabel` dan persentase.
2. `Progress Kanwil` — `LinearProgressWithLabel` dan persentase.
3. `Export` — `IconButton` dengan ikon Excel `vscode-icons:file-type-excel` dan tooltip.

Setiap baris menggunakan susunan label, tanda titik dua, dan konten agar sejajar. Pada layar kecil, lebar kolom akan menyesuaikan tanpa mengubah urutan informasi.

## Sumber Nilai Progress

- Total checklist berasal dari jumlah item `wsSPMLJunction`.
- Progress KPPN dihitung dari jumlah item dengan `kppn_score !== null` dibagi total checklist.
- Progress Kanwil dihitung dari jumlah item dengan `kanwil_score !== null` dibagi total checklist.
- Jika junction belum tersedia, nilai progress ditampilkan sebagai `0%` dan perhitungan menghindari pembagian dengan nol.
- Tooltip progress menampilkan jumlah checklist selesai dibanding total checklist.

## Komponen

- Menggunakan komponen yang sudah tersedia:
  - `LinearProgressWithLabel` dari `components/linear-progress-with-label`;
  - `Iconify` untuk ikon Excel;
  - komponen MUI `Card`, `Grid`/`Stack`, `Typography`, `Tooltip`, dan `IconButton`.
- Toolbar akan dibuat sebagai komponen terpisah, misalnya `components/WorksheetSPMLToolbar.tsx`, agar workspace tetap ringkas dan nantinya mudah diberi fungsi ekspor sebenarnya.

## Perilaku Tombol Export

- Pada tahap mock UI, tombol Excel hanya ditampilkan dan belum menghasilkan file.
- Tombol diberi tooltip/label aksesibel yang menjelaskan bahwa fungsi ekspor akan tersedia berikutnya.

## Verifikasi

- Memastikan urutan layout menjadi: nama KPPN → toolbar → Card tabel.
- Menjalankan lint pada komponen toolbar dan workspace.
- Menjalankan pemeriksaan TypeScript/build frontend; error lama di luar lingkup akan dilaporkan terpisah.

## Batas Perubahan

- Tidak menambah endpoint backend.
- Tidak mengimplementasikan generator Excel pada tahap mock UI.
- Tidak mengubah tabel, pengisian score, atau fungsionalitas dokumen.
- Kode baru diterapkan setelah rencana disetujui.
