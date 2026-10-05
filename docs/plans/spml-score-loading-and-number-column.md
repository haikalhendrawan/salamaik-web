# Rencana: Loading Skor dan Lebar Kolom Nomor SPML

## Tujuan

Membuat indikator penyimpanan nilai SPML tampak konsisten dengan CK dan memastikan nomor dua digit pada kolom No tampil utuh.

## Perubahan

1. Pada `ScoreSelect` SPML, tampilkan `CircularProgress` selama request penyimpanan lokal (`isSaving`) maupun proses sinkronisasi live (`isLiveSyncing`). Select tetap disabled selama salah satu proses berlangsung; state saving harus selalu diakhiri pada callback berhasil/gagal.
2. Lebarkan kolom No dari 4% menjadi 6%, lalu kurangi kolom Kegiatan dari 28% menjadi 26% agar total lebar tabel tetap 100% dan layout lain tidak bergeser.

## Verifikasi

- Memilih nilai KPPN dan Kanwil menampilkan spinner pada select terkait sampai penyimpanan/sinkronisasi selesai.
- Event live dari user lain tetap menampilkan spinner serta menonaktifkan select sementara.
- Nomor dua digit tampil penuh, dan total `COLUMN_WIDTHS` tetap 100%.
- Jalankan pemeriksaan TypeScript frontend.
