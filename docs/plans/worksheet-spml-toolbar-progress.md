# Rencana Fungsionalitas Progress Toolbar SPML

## Tujuan

Menghitung progress KPPN dan Kanwil dari data `wsSPMLJunction` berdasarkan status pengisian setiap checklist.

## Ketentuan Perhitungan

Untuk masing-masing checklist:

- Score `null` dan `excluded !== 1`: belum dikerjakan.
- Score `0`: sudah dikerjakan.
- Score `10`: sudah dikerjakan.
- `excluded === 1` (`N/A`): sudah dikerjakan, termasuk untuk kompatibilitas data lama apabila score masih `null`.

Rumus:

- Progress KPPN = jumlah junction dengan `kppn_score !== null || excluded === 1` dibagi seluruh junction.
- Progress Kanwil = jumlah junction dengan `kanwil_score !== null || excluded === 1` dibagi seluruh junction.
- Jika junction kosong, progress menjadi `0/0 (0%)` tanpa pembagian dengan nol.

## Perubahan

- Memperbarui kalkulasi `completedKPPN` dan `completedKanwil` dalam `WorksheetSPMLToolbar.tsx`.
- Mempertahankan tampilan label `jumlah selesai/jumlah checklist (persen%)`.
- Tidak mengubah komponen shared progress, database, atau backend.

## Verifikasi

- Memastikan score `null` belum dihitung.
- Memastikan score numerik `0` tetap dihitung selesai dan tidak dianggap falsy/belum diisi.
- Memastikan score `10` dihitung selesai.
- Memastikan `excluded === 1` dihitung selesai.
- Menjalankan lint pada toolbar SPML.

Implementasi dimulai setelah rencana disetujui.
