# Rencana: Penanda Jenis Worksheet sebagai Baris Grup

## Tujuan

Pada tabel Rekapitulasi Permasalahan Peraturan 2, pindahkan penanda PB/CK/SPML dari kolom tersendiri menjadi satu baris grup yang membentang di seluruh lebar tabel.

## Perubahan

1. Hapus kolom `Kertas Kerja` dari header tabel.
2. Sebelum baris temuan pertama pada setiap grup berurutan PB, CK, atau SPML, render baris label `Kertas Kerja {jenis}` dengan `colSpan` selebar tabel.
3. Pertahankan urutan grup dan nomor temuan yang berlanjut lintas grup.
4. Jangan ubah tampilan Peraturan 1 maupun isi kolom temuan.

## Verifikasi

- Peraturan 2 menampilkan label grup pada row penuh, bukan kolom.
- Header/data tiap temuan tetap sejajar dan grup kosong tidak menghasilkan baris.
- Peraturan 1 tidak berubah; jalankan TypeScript frontend.
