# Rencana: Alignment dan Penomoran Hierarki PB pada Excel

## Tujuan

Pada export Excel PB, row komponen, subkomponen, dan subsubkomponen rata kiri. Penomoran subkomponen/subsubkomponen mengikuti struktur masing-masing komponen.

## Aturan Penomoran

- Komponen tetap tampil tanpa nomor.
- Jika komponen tidak memiliki subsubkomponen, subkomponen diberi urutan huruf `A.`, `B.`, dan seterusnya.
- Jika komponen memiliki subsubkomponen, subkomponen diberi angka Romawi `I.`, `II.`, dan seterusnya; subsubkomponen diberi urutan huruf `A.`, `B.`, dan seterusnya.
- Urutan di-reset ketika komponen berganti.
- Urutan mengikuti urutan referensi yang sudah dipakai oleh export saat ini.

## Perubahan

1. Teruskan `subSubKomponenRef` dari dictionary ke hook export PB.
2. Render section subkomponen dan subsubkomponen mengikuti relasi `komponen_id`/`subkomponen_id` serta aturan penomoran di atas.
3. Ubah alignment row section ke kiri sambil mempertahankan warna, border, dan bold yang berlaku.

## Validasi

- Komponen dengan subkomponen langsung menghasilkan `A. Nama`, `B. Nama`.
- Komponen bertingkat menghasilkan `I. Nama Subkomponen`, `A. Nama Subsubkomponen`.
- Penomoran mulai lagi dari awal untuk komponen berikutnya.
- Jalankan build frontend.
