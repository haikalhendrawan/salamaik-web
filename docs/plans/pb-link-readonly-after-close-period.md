# Rencana: Akses Baca Link Bukti Dukung PB Setelah Periode

## Tujuan

Memungkinkan pengguna membuka link bukti dukung yang sudah tersimpan pada kertas kerja PB setelah periode pengisian ditutup, termasuk baris bernilai maksimal pada masa tindak lanjut, tanpa membuka kewenangan untuk menambah, mengubah, atau menghapus link.

## Kondisi Saat Ini

- `WorksheetCard/Dokumen.tsx` memakai `isPastDue` untuk menonaktifkan tombol link.
- Untuk Peraturan 1, `isPastDue` bernilai benar setelah `close_period`.
- Untuk Peraturan 2, `isPastDue` juga benar untuk baris yang tidak dapat diedit pada fase tersebut, termasuk nilai maksimal saat tindak lanjut.
- `LinkFilePopover.tsx` sudah memisahkan aksi baca dan edit: link yang sudah ada dapat dibuka melalui tombol **Buka**, sementara **Edit** dan **Hapus** hanya tampil jika baris masih dapat diedit.
- Karena tombol pemicu popover ikut dinonaktifkan, pengguna tidak dapat mencapai aksi **Buka** tersebut.

## Perubahan yang Direncanakan

1. Pisahkan izin membuka link dari izin mengubah link pada tombol di `WorksheetCard/Dokumen.tsx`.
2. Jika link sudah tersedia, tombol tetap dapat membuka popover pada semua fase periode.
3. Jika link belum tersedia, tombol tetap dinonaktifkan ketika baris tidak dapat diedit.
4. Pertahankan aturan `isPastDue` pada `LinkFilePopover.tsx` sehingga aksi simpan, edit, dan hapus tetap terkunci di luar masa yang diizinkan.
5. Tidak mengubah API/backend karena kebutuhan ini adalah akses baca UI terhadap link yang sudah tersimpan.

## Verifikasi

- Sebelum/dalam periode pengisian: link dapat dibuka dan aksi edit/hapus tetap mengikuti aturan periode.
- Setelah close period: link yang sudah ada tetap dapat dibuka; link kosong tidak dapat ditambahkan.
- Masa tindak lanjut Peraturan 2 untuk baris bernilai maksimal: link yang sudah ada dapat dibuka, tetapi tidak dapat diedit atau dihapus.
- Masa tindak lanjut untuk baris yang boleh ditindaklanjuti: perilaku edit tetap mengikuti aturan yang sudah ada.
