# Rencana: Sufiks Huruf Nomor Checklist PB pada Excel

## Tujuan

Kolom nomor checklist pada export Excel PB menampilkan gabungan `urut` dan `urut_huruf` jika huruf tersedia. Contoh: `6a`, `6b`; jika tidak ada huruf, tetap `6`.

## Perubahan

1. Ubah pembentukan nilai kolom `no` di `frontend/src/sections/excel/useExcelWorksheet2.tsx` agar menggabungkan `row.urut` dengan `row.urut_huruf` hanya jika huruf berisi nilai.
2. Pertahankan nilai kosong bila `urut` tidak tersedia.
3. Verifikasi secara statis bahwa field `urut_huruf` sudah diterima melalui `WsJunctionType` dan tidak memerlukan perubahan backend atau database.

## Validasi

- Checklist `urut=6`, `urut_huruf='a'` tampil sebagai `6a`.
- Checklist `urut=6`, `urut_huruf=null` tampil sebagai `6`.
- Checklist tanpa `urut` tetap memiliki kolom nomor kosong.
- Jalankan pemeriksaan build frontend.
