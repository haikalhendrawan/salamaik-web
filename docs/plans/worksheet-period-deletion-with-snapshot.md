# Rencana: Penghapusan Periode yang Memiliki Snapshot

## Tujuan

Mengizinkan periode yang sudah memiliki snapshot untuk dihapus, tanpa meninggalkan snapshot yatim atau mengubah aturan penghapusan worksheet/junction yang sudah ada.

## Rencana perubahan

1. Ubah foreign key `worksheet_reference_snapshot.period_id` dari `ON DELETE RESTRICT` menjadi `ON DELETE CASCADE`. Snapshot hanya metadata/referensi periode, sehingga masa hidupnya mengikuti periode. Jangan menghapus constraint foreign key sepenuhnya karena itu dapat meninggalkan snapshot tanpa periode induk.
2. Buat migrasi SQL baru untuk mengubah constraint yang sudah terpasang pada database, tidak hanya mengubah file migrasi awal. Migrasi dibuat idempotent dan menargetkan foreign key kolom `period_id` secara eksplisit.
3. Pertahankan endpoint penghapusan periode yang ada, tetapi lakukan pemeriksaan relasi pada skema/deployment: penghapusan worksheet dan junction harus tetap mengikuti perilaku database yang sudah berlaku. Perubahan ini tidak boleh memperluas penghapusan data selain efek cascade snapshot.
4. Jika constraint relasi periode-ke-worksheet yang sudah ada memang mencegah penghapusan periode, jangan menghapus atau mengganti constraint itu dalam perubahan ini. Laporkan sebagai prasyarat terpisah agar data worksheet tidak terhapus tanpa keputusan eksplisit.
5. Verifikasi dengan skenario: periode tanpa snapshot dapat dihapus; periode dengan snapshot dapat dihapus dan snapshot ikut terhapus; periode dengan worksheet tetap mengikuti aturan FK worksheet saat ini; periode baru memperoleh ID baru dan assignment pertamanya membuat snapshot baru dari referensi aktif.

## Risiko dan batasan

- Menghapus periode dan snapshot menghilangkan metadata referensi periode tersebut. Karena itu aksi ini hanya untuk koreksi periode sebelum data kerja perlu dipertahankan.
- Foreign key ke snapshot saat ini tidak menyimpan histori penghapusan. Jika diperlukan audit, perlu mekanisme audit terpisah sebelum fitur diaktifkan di produksi.
- Migrasi hanya mengubah perilaku relasi snapshot. Ia tidak boleh diam-diam menghapus worksheet, nilai, file, komentar, findings, atau matriks.

## Kriteria penerimaan

- Snapshot tidak pernah tertinggal tanpa periode induk.
- Penghapusan periode yang sudah di-assign tidak gagal hanya karena snapshot.
- Perilaku penghapusan data worksheet/junction tidak berubah tanpa persetujuan terpisah.
- Re-assignment pada periode baru menghasilkan snapshot dari referensi aktif saat assignment.
