# Rencana Export Excel SPML dengan 10 Kolom

## Tujuan

Mengubah export Excel kertas kerja SPML dari format tujuh kolom per versi nilai menjadi satu tabel sepuluh kolom yang menampilkan nilai KPPN, catatan reviu, dan nilai Kanwil secara bersamaan.

## Struktur Workbook

Saat ini workbook membuat dua sheet:

- Nilai Versi Kanwil;
- Nilai Versi KPPN.

Karena format baru sudah memuat kedua versi nilai dalam kolom yang berdampingan, workbook akan disederhanakan menjadi satu sheet bernama **Kertas Kerja SPML**. Ini mencegah dua sheet dengan isi identik dan membuat perbandingan KPPN–Kanwil dapat dilakukan langsung dalam satu baris.

## Struktur Kolom

Urutan sepuluh kolom:

1. No
2. Aspek
3. Uraian Kegiatan
4. Bukti Dukung Kegiatan
5. Link Bukti Dukung Kegiatan
6. Nilai (versi KPPN)
7. Nilai Konversi (versi KPPN)
8. Catatan Hasil Reviu Kanwil
9. Nilai (versi Kanwil)
10. Nilai Konversi (versi Kanwil)

Mapping data:

- kolom F menggunakan `kppn_score`, atau `N/A` bila `excluded = 1`;
- kolom G menggunakan konversi nilai KPPN ke skala 100, atau `N/A`;
- kolom H menggunakan `kanwil_note` dari junction;
- kolom I menggunakan `kanwil_score`, atau `N/A`;
- kolom J menggunakan konversi nilai Kanwil ke skala 100, atau `N/A`.

Nilai `NULL` tetap ditampilkan sebagai cell kosong. Nilai konversi hanya dihitung bila score tersedia dan checklist bukan N/A.

## Perubahan Generator

- Hapus parameter `scoreType` dari fungsi pembuat sheet dan fungsi pembuat row karena satu row akan mengakses nilai KPPN dan Kanwil sekaligus.
- Ganti dua pemanggilan `createScoreSheet` menjadi satu pemanggilan pembuat sheet gabungan.
- Tambahkan definisi lebar untuk kolom Catatan Hasil Reviu Kanwil dan dua pasang kolom nilai.
- Pertahankan frozen header pada row pertama.
- Pertahankan formatting numbered list untuk Uraian Kegiatan.
- Pertahankan hyperlink dan label bukti dukung yang sudah ada.
- Perluas merge row komponen/subkomponen dari `A:G` menjadi `A:J`.
- Terapkan border, font, alignment, dan wrapping hingga kolom J.
- Kolom nilai dan nilai konversi dibuat rata tengah; kolom catatan menggunakan rata kiri, posisi vertikal atas, dan text wrap.

## Footer Dua Versi Nilai

Footer tetap terdiri dari dua row:

1. **Total Nilai**
2. **Rata-Rata Total Nilai**

Layout footer:

- label footer digabung pada kolom `A:F`;
- total/rata-rata KPPN ditampilkan pada kolom G, yaitu kolom Nilai Konversi versi KPPN;
- kolom H dan I menjadi area pemisah kosong tetapi tetap diberi style dan border;
- total/rata-rata Kanwil ditampilkan pada kolom J, yaitu kolom Nilai Konversi versi Kanwil.

Sumber nilai:

- Total KPPN: `spmlScore.detailKPPN.totalSkorKonversi`;
- Total Kanwil: `spmlScore.detailKanwil.totalSkorKonversi`;
- Rata-rata KPPN: `spmlScore.nilaiKPPN`;
- Rata-rata Kanwil: `spmlScore.nilaiKanwil`.

Format angka total tetap tanpa desimal, sedangkan rata-rata menggunakan dua angka desimal seperti export saat ini.

## Fungsi yang Akan Disesuaikan

- `createScoreSheet` diubah menjadi pembuat sheet gabungan dan tidak lagi menerima `scoreType`.
- `addMergedSectionRow` menggabungkan serta memberi border pada sepuluh kolom.
- `addChecklistRow` mengisi kedua versi nilai dan `kanwil_note` dalam satu row.
- `addFooterRow` menerima dua nilai (`nilaiKPPN` dan `nilaiKanwil`) dan menerapkan style pada sepuluh kolom.
- Tipe `ScoreType` dihapus karena tidak lagi digunakan.

## Verifikasi

- Workbook hanya memiliki satu sheet Kertas Kerja SPML.
- Header memiliki tepat sepuluh kolom dalam urutan yang diminta.
- Nilai KPPN dan Kanwil berada pada row checklist yang sama.
- Catatan Kanwil berasal dari `kanwil_note` dan menggunakan wrapping.
- N/A dan nilai `NULL` ditampilkan dengan benar untuk kedua versi.
- Merge No/Aspek, merge komponen/subkomponen, dan seluruh border mencapai kolom J.
- Hyperlink bukti dukung tetap dapat diklik.
- Footer menampilkan total dan rata-rata KPPN serta Kanwil pada kolom konversinya masing-masing.
- File dapat dibuka tanpa repair warning dari Excel.
- Jalankan lint dan production build frontend.

