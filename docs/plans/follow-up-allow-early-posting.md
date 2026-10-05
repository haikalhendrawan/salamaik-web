# Rencana: Posting Temuan Sebelum Periode Pengisian Berakhir

## Tujuan

Mengizinkan Admin Kanwil memposting temuan Peraturan 2 sebelum `close_period`, tanpa membuat snapshot temuan menjadi usang ketika KPPN/Kanwil masih mengisi worksheet.

## Perilaku yang Diusulkan

1. Tombol posting tetap manual dan hanya tersedia untuk Admin Kanwil.
2. Posting dapat dilakukan mulai periode pengisian (ketika worksheet sudah dibuka) sampai sebelum `open_follow_up`.
3. Posting awal membuat temuan dari checklist PB, CK, dan SPML yang saat itu tidak excluded dan nilai Kanwil-nya belum maksimum.
4. Selama periode pengisian masih berlangsung, Admin Kanwil dapat menjalankan posting lagi sebagai sinkronisasi. Sinkronisasi menambah temuan yang baru memenuhi kriteria, memperbarui snapshot sumber yang masih memenuhi kriteria, dan menghapus temuan draft yang tidak lagi memenuhi kriteria. Tidak boleh ada progres tindak lanjut pada fase ini.
5. Ketika fase tindak lanjut dimulai, sinkronisasi diblokir. Snapshot temuan dan progres yang ada menjadi tetap; mutasi hanya melalui menu Tindak Lanjut.
6. Jika Admin baru memposting saat masa tunggu setelah `close_period`, perilakunya tetap sama: satu snapshot final sebelum fase tindak lanjut.

## Dampak Implementasi

- Ubah validasi backend `createMatrix` dari hanya `WAITING_FOLLOW_UP` menjadi `FILLING` atau `WAITING_FOLLOW_UP`; tolak sebelum worksheet dibuka dan sejak `FOLLOW_UP` dimulai.
- Bedakan posting pertama dan sinkronisasi ulang dengan memeriksa `matrix_status`; jangan menolak status sudah diposting selama fase masih mengizinkan sinkronisasi.
- Buat operasi sinkronisasi transaksional dan idempotent untuk seluruh jenis worksheet. Kunci baris worksheet saat membaca status agar dua posting bersamaan tidak menghasilkan duplikasi.
- Saat sinkronisasi berlangsung sebelum follow-up, pertahankan isi awal junction sebagai source of truth. Temuan yang sudah tidak eligible dapat dihapus karena belum ada perubahan follow-up; temuan yang tetap eligible diperbarui snapshot nilainya/deskripsinya.
- UI menampilkan tombol **Posting/Sinkronisasi Temuan** selama fase pengisian atau masa tunggu, beserta pesan bahwa sinkronisasi akhir harus dilakukan sebelum tindak lanjut dibuka.
- Menu Tindak Lanjut menampilkan temuan yang sudah diposting, tetapi seluruh aksi tetap disabled sebelum `open_follow_up` sesuai validasi tanggal backend.

## Batas Keamanan dan Histori

- Jangan mengubah nilai, file, link, atau catatan pada worksheet junction ketika memposting/sinkronisasi.
- Setelah `open_follow_up`, jangan menghapus atau memperbarui snapshot findings melalui sinkronisasi agar riwayat dan progres tindak lanjut tidak tertimpa.
- Posting sebelum `close_period` berarti snapshot dapat berubah sampai tindak lanjut dimulai; sinkronisasi akhir disarankan setelah periode pengisian ditutup.

## Verifikasi

- Admin dapat posting pada fase `FILLING` dan `WAITING_FOLLOW_UP`.
- Posting ditolak pada fase `NOT_OPEN` dan `FOLLOW_UP`/`FINAL`.
- Sinkronisasi berulang tidak menggandakan temuan.
- Checklist yang berubah menjadi maksimal atau excluded sebelum follow-up dibuka dikeluarkan dari draft temuan.
- Checklist baru/turun nilai sebelum follow-up dibuka masuk ke daftar temuan setelah sinkronisasi.
- Nilai dan bukti awal pada seluruh junction tetap tidak berubah.
- Peraturan 1 tetap menggunakan proses posting dan reassign yang lama.
