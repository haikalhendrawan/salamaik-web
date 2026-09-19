# Rencana Badge Komentar PB/SPML dan Pembatasan File SPML

## Asumsi ruang lingkup

Frasa "Kertas kerja SPML serta juga kertas kerja SPML" ditafsirkan sebagai **Kertas Kerja PB dan Kertas Kerja SPML**, sehingga badge jumlah komentar akan tersedia pada keduanya. Perubahan file hanya berlaku untuk dokumen yang diunggah ke server pada SPML (`file_1`); link dokumen tetap dapat dikelola secara terpisah.

## Target hasil

1. Tombol komentar pada setiap checklist PB dan SPML menampilkan badge berisi jumlah komentar aktif.
2. Badge tidak ditampilkan apabila jumlah komentar nol dan dapat membatasi tampilan jumlah besar, misalnya `99+`.
3. Jumlah badge langsung berubah setelah komentar ditambah atau dihapus tanpa reload halaman.
4. Pada SPML hanya boleh ada satu file server per checklist. Jika `file_1` sudah terisi, tombol tambah/upload tidak ditampilkan; pengguna harus menghapus file tersebut sebelum mengunggah file baru.
5. Backend juga menolak upload baru ketika `file_1` masih terisi untuk mencegah penggantian melalui request langsung atau request bersamaan.

## Rencana perubahan backend

### 1. Menyediakan jumlah komentar bersama data junction

- Tambahkan `comment_count` pada query utama pengambilan junction PB di `worksheetJunction.model.ts`.
- Tambahkan `comment_count` pada query utama pengambilan junction SPML di `wsSPMLJunction.model.ts`.
- Hitung hanya baris `comment_data.active = 1`, masing-masing berdasarkan:
  - PB: `comment_data.ws_junction_id = worksheet_junction.junction_id`.
  - SPML: `comment_data.ws_spml_junction_id = ws_spml_junction.junction_id`.
- Gunakan subquery agregat atau join agregat sehingga satu pemuatan worksheet menghasilkan seluruh count dan tidak membuat request komentar per checklist.
- Pastikan hasil count dikembalikan sebagai angka pada response atau dinormalisasi di frontend bila driver PostgreSQL mengembalikan `COUNT` sebagai string.

### 2. Menegakkan satu file server untuk SPML

- Pada controller upload SPML, ambil dan kunci/validasi junction tujuan sebelum menyimpan perubahan.
- Jika `file_1` sudah terisi, kembalikan respons konflik/validasi (disarankan HTTP 409) dengan pesan bahwa file lama harus dihapus terlebih dahulu.
- Hapus perilaku penggantian otomatis dan penghapusan file lama dari alur upload SPML.
- Pertahankan endpoint hapus yang sudah ada sebagai satu-satunya jalur untuk mengosongkan `file_1` sebelum upload baru.
- Tetap bersihkan file upload sementara jika validasi gagal agar tidak meninggalkan orphan file di server.

## Rencana perubahan frontend

### 1. Tipe data

- Tambahkan `comment_count` pada tipe junction PB dan `WsSPMLJunctionType`.
- Normalisasi nilai menjadi `number` dan gunakan nilai awal `0` bila field tidak tersedia pada data lama.

### 2. Badge komentar PB

- Bungkus ikon komentar di `WorksheetCard/Head.tsx` dengan komponen MUI `Badge`.
- Teruskan `comment_count` dari `WorksheetCard` ke bagian header/tombol komentar.
- Tambahkan callback dari `CommentPopover` ke parent untuk memperbarui count setelah fetch, tambah, dan hapus komentar.
- Sinkronkan state lokal badge ketika data junction direfresh agar tidak menyimpan count yang sudah usang.

### 3. Badge komentar SPML

- Tambahkan prop jumlah awal pada `CommentAction` dan kirim nilainya dari `WorksheetSPMLTable`.
- Bungkus ikon dengan MUI `Badge` dan sembunyikan badge saat count nol.
- Tambahkan callback pada `CommentPopoverSPML` agar `CommentAction` memperoleh jumlah terbaru sesudah fetch, tambah, atau hapus.
- Perbarui count berdasarkan hasil daftar komentar dari server, sehingga badge tetap konsisten jika komentar berubah dari sesi lain lalu popover dibuka kembali.

### 4. Tombol upload file SPML

- Ubah `FileActions.tsx` agar tombol upload hanya dirender ketika `checklist.file_1` kosong dan periode worksheet masih terbuka.
- Ketika file tersedia, tampilkan tombol lihat dan mekanisme hapus yang sudah ada; jangan tampilkan tombol “Ganti file”.
- Setelah penghapusan berhasil dan data junction direfresh, tombol upload muncul kembali otomatis.
- Tangani respons 409 dari backend melalui snackbar agar kondisi data stale atau request bersamaan tetap dipahami pengguna.

## Verifikasi

1. Buka PB dan SPML tanpa komentar: badge tidak terlihat.
2. Tambah beberapa komentar: badge berubah sesuai jumlah tanpa reload.
3. Hapus komentar milik sendiri: badge berkurang dan komentar nonaktif tidak dihitung.
4. Refresh worksheet: count tetap sesuai database.
5. Buka popover setelah komentar berubah dari sesi lain: badge disinkronkan dengan daftar terbaru.
6. Pada SPML tanpa `file_1`: tombol upload tersedia selama periode terbuka.
7. Setelah upload: tombol upload hilang dan tombol lihat/hapus tetap tersedia.
8. Coba upload langsung melalui API saat `file_1` terisi: backend menolak dan file lama tidak tertimpa.
9. Hapus file: tombol upload kembali tersedia dan upload berikutnya berhasil.
10. Jalankan build TypeScript backend, build frontend, dan ESLint terarah pada file yang diubah.

## Catatan kompatibilitas

- Tidak diperlukan perubahan skema database baru karena jumlah komentar dihitung dari `comment_data` yang sudah ada.
- Data lama tanpa `comment_count` tetap aman karena frontend memakai fallback nol.
- Link dokumen SPML tidak terpengaruh dan tetap dapat ditambah/diedit meskipun file server sudah ada.
