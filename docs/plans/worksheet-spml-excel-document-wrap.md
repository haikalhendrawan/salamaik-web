# Rencana Format Kolom Dokumen Excel SPML

## Tujuan

Memperbaiki tampilan URL pada kolom Dokumen agar tidak melebar keluar sel dan agar beberapa link mudah dibedakan.

## Perubahan

- Mempertahankan hyperlink target dalam bentuk URL asli agar tautan tetap valid.
- Memformat teks URL yang ditampilkan dengan pemenggalan baris visual pada panjang tertentu, sehingga URL panjang tetap berada dalam lebar kolom Dokumen.
- Memastikan alignment sel Dokumen memakai `wrapText: true`, `vertical: top`, dan `horizontal: left` setelah nilai hyperlink diterapkan.
- Jika terdapat file server dan link eksternal sekaligus, memisahkan keduanya dengan dua karakter newline (`\n\n`) sehingga terdapat satu baris kosong di antaranya.
- Menyesuaikan tinggi row berdasarkan jumlah link agar whitespace dan URL terbungkus dapat terlihat.

## Verifikasi

- URL panjang tidak spill ke kolom di sebelahnya.
- Hyperlink tetap menuju URL asli, bukan teks URL yang telah dipenggal.
- Dua link tampil dengan satu baris kosong sebagai pemisah.
- Lint dan build frontend berhasil.

## Batas Perubahan

- Tidak mengubah struktur dua sheet atau merge cell.
- Tidak mengubah sumber data dokumen.
- Implementasi dimulai setelah rencana disetujui.
