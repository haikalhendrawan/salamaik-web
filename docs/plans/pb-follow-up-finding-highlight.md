# Rencana: Penanda Checklist Temuan pada Kertas Kerja PB

## Tujuan

Memberi warna pembeda pada card checklist PB yang perlu ditindaklanjuti selama fase tindak lanjut, konsisten dengan penanda `warning.lighter` pada baris tabel kertas kerja CK dan SPML.

## Kriteria Checklist PB yang Ditandai

Penanda hanya aktif untuk Peraturan 2 pada fase `FOLLOW_UP`, jika:

- checklist tidak dikecualikan (`excluded !== 1`); dan
- nilai Kanwil belum maksimal, termasuk belum diisi (`kanwil_score === null`).

Nilai maksimal PB ditentukan secara dinamis dari opsi checklist, mengikuti logika input nilai yang sudah ada: standardisasi memakai maksimum 12; selain itu digunakan nilai opsi tertinggi, dengan fallback 10. Ini mengakomodasi checklist yang opsi tertingginya 15.

## Perubahan yang Direncanakan

1. Pada `WorksheetCard`, hitung status fase dan status temuan berdasarkan worksheet, skor Kanwil, excluded, dan opsi checklist.
2. Beri latar `warning.lighter` pada card saat status temuan terpenuhi, dengan penanda yang sama seperti tabel CK/SPML.
3. Jangan mengubah hak edit, proses scoring, maupun tampilan di luar fase tindak lanjut Peraturan 2.

## Verifikasi

- Fase pengisian atau menunggu tindak lanjut: card tidak diberi warna temuan.
- Fase tindak lanjut: card berwarna jika belum dikecualikan dan skor Kanwil null/di bawah maksimum opsi.
- Skor Kanwil maksimal atau checklist N/A: card tidak diberi warna.
- Checklist dengan maksimum 15 atau standardisasi 12 dinilai berdasarkan maksimum masing-masing, bukan ambang tetap 10.
