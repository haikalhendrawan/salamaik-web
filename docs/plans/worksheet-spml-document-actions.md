# Rencana Fungsionalitas Dokumen Worksheet SPML

## Tujuan

Mengaktifkan tombol pada kolom Dokumen `WorksheetSPMLTable` untuk:

1. mengunggah satu file bukti dukung SPML ke server; dan
2. menambah, melihat, mengubah, serta menghapus link bukti dukung SPML.

## Kondisi Saat Ini

- `FileActions` baru merender tombol tanpa handler.
- Backend sudah memiliki fondasi:
  - endpoint `POST /wsSPMLJunction/editWsSPMLJunctionFile`;
  - konfigurasi Multer file SPML;
  - model penyimpanan `file_1` dan `link_file`;
  - socket `updateSPMLLinkFile` dan `deleteWsSPMLJunctionFile`.
- Komponen `LinkFilePopover`, `PreviewFileModal`, dan context modal SPML sudah tersedia, tetapi belum dirangkai dengan tabel/workspace.

## Perubahan Frontend

### `WorksheetSPMLTable.tsx`

- Mengirim data junction lengkap ke `FileActions`, bukan hanya teks referensi dokumen.
- Mengirim detail worksheet bila diperlukan untuk aturan batas waktu.

### `FileActions.tsx`

- Menambahkan hidden file input pada tombol upload.
- Membuat `FormData` berisi `worksheetId`, `junctionId`, `checklistSpmlId`, `kppnId`, dan `wsSPMLJunctionFile`.
- Mengirim upload ke endpoint SPML menggunakan `axiosJWT`.
- Membatasi tipe file sesuai backend: JPEG, PNG, PDF, ZIP, dan RAR; maksimum tetap divalidasi backend sebesar 20 MB.
- Menampilkan loading dan snackbar pada proses sukses/gagal.
- Memuat ulang `wsSPMLJunction` setelah upload berhasil.
- Jika `file_1` sudah tersedia, menampilkan tombol file untuk membuka preview/download melalui context `usePreviewFileModal`.
- Menghubungkan tombol link dengan `LinkFilePopover` dan memberi indikator warna saat link sudah ada.
- Menonaktifkan operasi perubahan setelah batas waktu worksheet, sambil tetap mengizinkan melihat file/link yang sudah ada.

### `LinkFilePopover.tsx`

- Menggunakan tipe `WsSPMLJunctionType` dan `WorksheetType`, menggantikan `any`.
- Memastikan event yang dipanggil adalah `updateSPMLLinkFile`.
- Memvalidasi link kosong/tidak valid secara dasar sebelum simpan atau buka.
- Menampilkan hasil callback backend, lalu memuat ulang junction agar state tabel mengikuti database.
- Mendukung hapus link dengan menyimpan string kosong.

### `PreviewFileModal.tsx`

- Memakai event `deleteWsSPMLJunctionFile` untuk penghapusan file SPML.
- Memuat ulang junction setelah file berhasil dihapus.
- Menutup modal dan menampilkan pesan hasil operasi.
- Menghapus prop/variabel yang tidak terpakai dan menggunakan identitas KPPN untuk refetch.

### `WorksheetSPMLWorkspace.tsx`

- Merender satu `PreviewFileModal` pada level workspace.
- Menggunakan `wsDetail.close_period` untuk menentukan apakah aksi edit/upload/delete masih diperbolehkan.

## Penyesuaian Backend

### Upload file

- Mempertahankan endpoint dan penyimpanan Multer yang telah tersedia.
- Memvalidasi bahwa junction benar-benar cocok dengan `worksheetId`, checklist SPML, dan KPPN yang dikirim sebelum/ketika update.
- Memastikan file yang sudah ditulis dibersihkan bila validasi database atau update gagal, agar tidak meninggalkan file yatim.
- Mengembalikan pesan dan row terbaru untuk sinkronisasi frontend.

### Link file dan penghapusan file

- Memvalidasi tipe/kelengkapan payload socket (`worksheetId`, `junctionId`, dan `linkFile`).
- Membatasi panjang link agar input tidak tak terbatas.
- Memastikan update/penghapusan hanya mengenai junction dan worksheet yang dimaksud.
- Mempertahankan activity log dan broadcast yang sudah tersedia.

## Aturan Peran yang Direncanakan

- User KPPN dan Kanwil sama-sama dapat mengunggah atau mengganti file bukti dukung.
- User KPPN dan Kanwil sama-sama dapat menghapus file bukti dukung.
- User KPPN dan Kanwil sama-sama dapat menambah, mengubah, dan menghapus link bukti dukung.
- Perubahan dinonaktifkan setelah `close_period`.
- File/link yang telah tersedia tetap dapat dilihat oleh kedua pihak setelah periode ditutup.

## Verifikasi

- Lint file frontend yang diubah.
- Build TypeScript backend.
- Build frontend; error lama di file di luar lingkup akan dilaporkan terpisah.
- Uji skenario:
  1. upload tipe file yang diizinkan dan state langsung menampilkan tombol file;
  2. penolakan tipe file tidak valid/file lebih dari 20 MB;
  3. preview gambar/PDF dan download arsip;
  4. hapus file lalu state kembali kosong;
  5. tambah, buka, edit, dan hapus link;
  6. kegagalan HTTP/socket menampilkan error dan loading selalu berhenti;
  7. aksi perubahan tersedia bagi KPPN dan Kanwil selama periode terbuka, lalu dinonaktifkan setelah periode ditutup.

## Batas Perubahan

- Satu file per junction mengikuti kolom `file_1` yang tersedia.
- Tidak mengubah skema database.
- Implementasi kode dimulai setelah rencana ini disetujui.
