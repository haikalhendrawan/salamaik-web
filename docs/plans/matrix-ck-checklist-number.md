# Rencana Perubahan Nomor Checklist CK pada Matriks PER-2

## Tujuan

Mengubah tampilan kolom **No. pada Kertas Kerja** untuk temuan CK dari format gabungan komponen dan checklist, misalnya `A.2`, menjadi nomor checklist saja, yaitu `2`.

## Perubahan

1. Ubah mapping CK pada query matriks PER-2 di `backend/src/model/matrix.model.ts` menjadi menggunakan `checklist_ck_ref.urut` saja.
2. Tidak mengubah nomor pada UI kertas kerja CK, struktur referensi, maupun data database.
3. Format nomor PB dan SPML tetap seperti sekarang.

## Verifikasi

1. Jalankan build TypeScript backend.
2. Pastikan DTO matriks tetap mengirim `nomor_kertas_kerja` sebagai teks.
3. Contoh hasil: komponen `A`, urut checklist `2` menghasilkan `nomor_kertas_kerja: "2"`.
