# Rencana Perbaikan State Input Popover Link CK

## Penyebab Bug

Popover CK menggunakan kondisi `!editing && value` untuk menentukan apakah tampilan harus berubah menjadi tombol Buka/Edit/Hapus. Ketika checklist belum memiliki link, state `editing` bernilai `false`. Begitu pengguna mengetik satu karakter, `value` menjadi truthy dan textarea langsung diganti oleh tampilan link tersimpan.

## Perubahan

1. Memisahkan status link tersimpan dari nilai input lokal menggunakan `Boolean(checklist.link_file)`.
2. Tampilan Buka/Edit/Hapus hanya ditampilkan apabila data junction memang sudah memiliki link dan pengguna tidak sedang dalam mode edit.
3. Checklist tanpa link akan tetap menampilkan textarea selama pengguna mengetik sampai proses Simpan berhasil.
4. Setelah Simpan berhasil dan data junction selesai dimuat ulang, popover dapat menampilkan mode link tersimpan.
5. Tombol Batal pada mode edit akan mengembalikan nilai link terakhir dari junction.

## Verifikasi

- Mengetik karakter pertama tidak menutup textarea.
- Link baru dapat diketik lengkap dan disimpan.
- Link yang sudah ada tetap menampilkan tombol Buka/Edit/Hapus.
- Edit, batal, hapus, live-sync, dan periode tertutup tetap berfungsi.
- Menjalankan ESLint dan production build frontend.
