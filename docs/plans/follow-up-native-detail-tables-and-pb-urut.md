# Rencana: Detail Follow-up Berformat Worksheet dan Nomor PB dari Urut

## Tujuan

1. Pada temuan PB, tampilkan nomor checklist dari properti referensi `urut`, bukan primary-key `id`.
2. Pada temuan CK dan SPML, tampilkan detail sebagai tabel worksheet asli dengan header kolom dan tepat satu baris checklist, bukan komponen kartu.

## Perubahan

- Ubah nomor yang dikirim ke header `FollowUpCard` PB agar menggunakan `checklist.urut`; sesuaikan tipe prop agar menerima teks/angka dan tampilkan tanda `-` bila urut kosong.
- Refaktor `FollowUpWorksheetTable` menjadi renderer tabel native berdasarkan jenis worksheet.
- CK memakai header dan susunan kolom worksheet CK (`No`, `Materi`, `Kriteria Penilaian`, `Dokumen`, `Nilai KPPN`, `Nilai Kanwil`, `Catatan Kanwil`, `Comment`).
- SPML memakai header dan susunan kolom worksheet SPML (`No`, `Aspek`, `Kegiatan`, `Nilai KPPN`, `Nilai Kanwil`, `Dokumen Dukung`, `Catatan Kanwil`, `Comment`).
- Render hanya satu row checklist untuk temuan terpilih. Kontrol tindak lanjut tetap menyimpan nilai/tanggapan/status pada record finding, sementara file/link bukti tetap mengikuti sumber junction sesuai implementasi sebelumnya.
- Hilangkan tampilan CardHeader dan komposisi kolom generik yang membuat detail masih terlihat seperti kartu.

## Verifikasi

- PB menampilkan nomor referensi `urut`, bukan ID.
- Detail CK dan SPML memiliki header tabel yang sesuai dengan worksheet masing-masing dan satu baris checklist.
- File/link, nilai tindak lanjut, catatan/tanggapan, serta approval tetap berfungsi.
- Periksa TypeScript frontend dan lint pada komponen terkait.
