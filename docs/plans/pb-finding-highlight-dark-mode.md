# Rencana: Kontras Penanda Temuan PB pada Dark Mode

## Masalah

Card temuan PB memakai latar `warning.lighter` pada semua tema. Pada dark mode, latar terang ini kurang serasi dengan teks yang tetap berwarna terang sehingga keterbacaan menurun.

## Perubahan

- Pertahankan `warning.lighter` pada light mode.
- Pada dark mode gunakan warna warning dengan transparansi di atas latar gelap, sehingga penanda tetap terlihat tanpa mengurangi kontras teks.
- Tidak mengubah kondisi checklist yang dianggap temuan maupun perilaku tema light.

## Verifikasi

- Light mode: warna penanda temuan tetap sama.
- Dark mode: latar temuan menjadi aksen gelap/transparan dan teks tetap terbaca.
- Card yang bukan temuan tidak berubah.
