# Rencana: Urutan Grup Rekapitulasi Tindak Lanjut

## Tujuan

Atur urutan grup temuan pada tabel Rekapitulasi Permasalahan Peraturan 2 menjadi PB, SPML, lalu CK.

## Perubahan

- Ubah prioritas pengurutan `worksheet_type` pada `FollowUpTable` menjadi PB → SPML → CK.
- Grup tanpa temuan tetap tidak dirender; nomor temuan tetap berurutan setelah pengurutan.
- Peraturan 1 tidak berubah.

## Verifikasi

- Data campuran ditampilkan PB, SPML, CK.
- Jenis worksheet tanpa temuan tidak menampilkan baris grup.
- Jalankan TypeScript dan lint pada komponen tabel.
