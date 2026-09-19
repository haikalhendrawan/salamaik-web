# Rencana Penguncian UI SPML Setelah Close Period

## Tujuan

Menyamakan perilaku Kertas Kerja SPML dengan Kertas Kerja PB: setelah waktu `close_period` terlewati, seluruh aksi yang mengubah data dinonaktifkan, sedangkan data yang sudah ada tetap dapat dilihat.

Mutasi yang dikunci:

- pengisian nilai KPPN;
- pengisian nilai Kanwil;
- upload dan hapus file;
- tambah, edit, dan hapus link file;
- tambah dan hapus komentar/catatan.

## Kondisi kode saat ini

| Fitur | Kondisi SPML saat ini |
|---|---|
| Upload file | Sudah disabled berdasarkan `close_period` di `FileActions` |
| Hapus file | Sudah menerima `isDisabled` melalui `PreviewFileModal` |
| Edit/hapus link yang sudah ada | Sudah disembunyikan setelah periode ditutup |
| Tambah link ketika link masih kosong | Tombol pembuka masih dapat diklik |
| Nilai KPPN/Kanwil | Hanya dibatasi berdasarkan role, belum berdasarkan periode |
| Membuka komentar | Dapat dibuka; ini tetap diperlukan agar komentar lama bisa dibaca |
| Tambah komentar | Masih aktif setelah periode ditutup |
| Hapus komentar | Masih aktif setelah periode ditutup |

## Sumber status periode

`WorksheetSPMLWorkspace` sudah menghitung:

```ts
const isPastDue = Date.now() > new Date(wsDetail?.close_period || '').getTime();
```

Nilai tersebut akan menjadi sumber status tunggal dan diteruskan ke tabel serta komponen turunannya. Ini menghindari beberapa komponen menghitung tanggal sendiri dengan hasil yang mungkin berbeda.

Jika `wsDetail` belum tersedia atau tanggal tidak valid, status dianggap belum ditutup agar UI tidak terkunci karena loading sementara. Setelah detail worksheet tersedia, komponen dirender ulang dengan status yang benar.

## Perubahan komponen

### 1. `WorksheetSPMLWorkspace`

- Pertahankan perhitungan `isPastDue` yang sudah digunakan modal file.
- Teruskan `isPastDue` ke `WorksheetSPMLTable`.

### 2. `WorksheetSPMLTable`

- Tambahkan prop `isPastDue`.
- Nilai KPPN disabled jika user tidak berwenang **atau** periode sudah ditutup.
- Nilai Kanwil disabled jika user tidak berwenang **atau** periode sudah ditutup.
- Teruskan status ke `FileActions` dan `CommentAction`.

Contoh aturan:

```ts
disabled={isKanwil || isPastDue}   // nilai KPPN
disabled={!isKanwil || isPastDue}  // nilai Kanwil
```

### 3. `FileActions`

- Terima status dari tabel dan tidak lagi menghitung ulang `close_period`.
- Upload file tetap disabled ketika periode ditutup.
- Tombol melihat file tetap aktif.
- Tombol link:
  - jika link sudah ada, tetap dapat dibuka untuk melihat/membuka URL;
  - jika link belum ada, disabled setelah periode ditutup karena tidak ada konten yang perlu dilihat.
- Teruskan status ke `LinkFilePopover`.
- Tambahkan guard pada handler upload agar mutasi tidak berjalan jika event dipicu dari state UI yang sudah stale.

### 4. `LinkFilePopover`

- Gunakan prop status periode dari parent.
- Link yang sudah ada tetap dapat dibuka di tab baru.
- Tombol edit dan hapus tidak tersedia setelah periode ditutup.
- Text field dan tombol simpan disabled/tidak tersedia.
- Tambahkan guard pada handler simpan/hapus untuk mencegah pemanggilan socket setelah periode ditutup.

### 5. `CommentAction` dan `CommentPopoverSPML`

- Tombol komentar tetap dapat membuka popover agar catatan lama dapat dibaca.
- Teruskan status `isPastDue` ke popover.
- Setelah periode ditutup:
  - text field komentar disabled;
  - tombol kirim disabled;
  - aksi hapus komentar tidak ditampilkan;
  - handler tambah/hapus mempunyai guard tambahan.
- Tooltip atau placeholder menjelaskan bahwa periode telah ditutup.

Perilaku ini mengikuti pola PB: akses baca tetap tersedia, hanya perubahan data yang dikunci.

## File yang diperkirakan berubah

- `frontend/src/sections/worksheetSPML/WorksheetSPMLWorkspace.tsx`
- `frontend/src/sections/worksheetSPML/components/WorksheetSPMLTable/WorksheetSPMLTable.tsx`
- `frontend/src/sections/worksheetSPML/components/WorksheetSPMLTable/components/FileActions.tsx`
- `frontend/src/sections/worksheetSPML/components/WorksheetSPMLTable/components/CommentAction.tsx`
- `frontend/src/sections/worksheetSPML/components/LinkFilePopover.tsx`
- `frontend/src/sections/worksheetSPML/components/CommentPopoverSPML.tsx`

`ScoreSelect.tsx` kemungkinan tidak perlu diubah karena sudah mempunyai prop `disabled`; aturan periodenya cukup digabungkan oleh tabel.

## Perubahan backend

Permintaan ini berfokus pada parity UI dengan PB, sehingga rencana tahap ini tidak mengubah backend. Penguncian UI mencegah penggunaan normal dari aplikasi, tetapi bukan pengamanan terhadap request API/Socket.IO yang dibuat manual.

Validasi `close_period` pada backend direkomendasikan sebagai hardening terpisah apabila aturan periode harus menjadi aturan keamanan/data integrity, bukan sekadar perilaku UI.

## Verifikasi

### Periode masih terbuka

1. User KPPN dapat mengubah nilai KPPN tetapi tidak nilai Kanwil.
2. User Kanwil dapat mengubah nilai Kanwil tetapi tidak nilai KPPN.
3. User berwenang dapat upload/hapus file dan tambah/edit/hapus link.
4. User dapat menambah komentar serta menghapus komentarnya sendiri.

### Periode sudah ditutup

1. Kedua ScoreSelect disabled sesuai role masing-masing.
2. Upload file disabled.
3. File lama masih dapat dilihat, tetapi tidak dapat dihapus.
4. Link lama masih dapat dilihat/dibuka, tetapi tidak dapat diedit atau dihapus.
5. Tombol tambah link disabled jika belum ada link.
6. Komentar lama masih dapat dibaca.
7. Input dan tombol kirim komentar disabled.
8. Aksi hapus komentar tidak tersedia.
9. Tidak ada handler mutasi yang berjalan dari kontrol stale.
10. Tidak muncul loading overlay akibat klik pada aksi yang sudah dikunci.

### Pemeriksaan teknis

- TypeScript build berhasil.
- ESLint terarah pada seluruh file yang berubah berhasil.
- Tidak ada perubahan terhadap perilaku live-sync saat periode masih terbuka.

