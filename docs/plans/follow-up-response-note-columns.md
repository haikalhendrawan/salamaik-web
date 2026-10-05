# Rencana: Pisahkan Tanggapan KPPN dan Catatan Kanwil

## Tujuan

Pada tabel detail temuan CK/SPML, sediakan kolom terpisah untuk tanggapan KPPN dan catatan Kanwil. Setiap kolom hanya berisi satu text area.

## Perubahan

- Ubah header tabel CK/SPML dengan mengganti satu kolom `Catatan Kanwil` menjadi dua kolom: `Tanggapan KPPN` dan `Catatan Kanwil`.
- Tambahkan mode sisi tunggal pada komponen catatan tindak lanjut agar tabel dapat merender text area KPPN dan Kanwil secara terpisah. Kewenangan simpan tetap mengikuti role dan API yang ada; tampilan kartu PB tidak berubah.
- Atur ulang lebar tabel agar kedua kolom catatan lebih luas. Kurangi lebar kolom aspek/materi, dokumen, serta tindak lanjut; pertahankan scroll horizontal bila layar tidak mencukupi.

## Verifikasi

- CK/SPML menampilkan masing-masing satu text area pada kolom tanggapan KPPN dan catatan Kanwil.
- Peran yang berhak dapat menyimpan catatan; sisi lain tetap disabled.
- Periksa alignment header/baris, TypeScript, dan lint komponen terkait.
