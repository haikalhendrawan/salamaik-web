# Rencana Sinkronisasi Live Kertas Kerja SPML

## Tujuan

Memastikan seluruh user yang sedang membuka Kertas Kerja SPML yang sama langsung melihat perubahan dari user lain tanpa reload halaman. Sinkronisasi mencakup nilai/N/A, skor akhir, progress, navigasi checklist, file server, link dokumen, dan komentar.

## Temuan kondisi saat ini

- Backend sudah memancarkan event terpisah untuk:
  - nilai KPPN;
  - nilai Kanwil;
  - link dokumen;
  - upload file server;
  - hapus file server.
- Frontend baru mendengarkan perubahan nilai KPPN dan Kanwil.
- Beberapa event memakai broadcast global sehingga user yang tidak membuka worksheet terkait tetap menerima metadata perubahan.
- Tambah/hapus komentar dilakukan lewat HTTP dan belum memancarkan event websocket.
- Callback pelaku perubahan sudah me-refresh datanya sendiri; kebutuhan baru terutama adalah sinkronisasi browser/user lain.

## Arsitektur yang disarankan

Gunakan Socket.IO room per worksheet:

```text
spml:worksheet:<worksheetId>
```

Ketika workspace dibuka:

1. Frontend memperoleh `worksheetId` dari junction aktif.
2. Frontend mengirim event `joinSPMLWorksheet`.
3. Backend memverifikasi autentikasi dan kewenangan terhadap worksheet.
4. Jika valid, socket bergabung ke room worksheet tersebut.
5. Saat berpindah worksheet atau keluar halaman, frontend mengirim `leaveSPMLWorksheet`.
6. Saat socket reconnect, frontend bergabung kembali karena membership room tidak bertahan setelah koneksi terputus.

Dengan room, event hanya diterima oleh user yang sedang melihat worksheet yang sama.

## Event perubahan terpadu

Tambahkan satu event backend-ke-frontend:

```ts
interface SPMLWorksheetChangedEvent {
  worksheetId: string;
  junctionId: number;
  changeType: 'score' | 'link' | 'file-upload' | 'file-delete' | 'comment-add' | 'comment-delete';
  changedBy?: string;
  timestamp: string;
}
```

Nama event:

```text
spmlWorksheetChanged
```

Event hanya menjadi sinyal invalidasi. Frontend tidak mempercayai payload sebagai sumber data final, tetapi mengambil ulang data dari API. Database tetap menjadi sumber kebenaran dan perhitungan skor tetap dilakukan oleh `ScoringEngine`.

Event lama dapat dipertahankan sementara untuk kompatibilitas, tetapi frontend SPML baru menggunakan event terpadu. Setelah dipastikan tidak ada konsumen lain, event lama dapat dihapus pada refactor terpisah.

## Perubahan backend

### 1. Helper room SPML

- Buat utility untuk membentuk nama room secara konsisten, misalnya `getSPMLWorksheetRoom(worksheetId)`.
- Hindari penulisan string room berulang di controller dan event handler.

### 2. Join dan leave room

Pada `wsSPMLJunctionEvent.ts`:

- Tambahkan listener `joinSPMLWorksheet` dan `leaveSPMLWorksheet`.
- Validasi `worksheetId` tidak kosong.
- Ambil junction/worksheet untuk memastikan worksheet tersedia.
- Terapkan aturan akses KPPN/Kanwil yang sama dengan endpoint SPML.
- Hanya setelah validasi, jalankan `socket.join(roomName)`.
- Callback mengembalikan status agar frontend mengetahui apakah join berhasil.
- Leave hanya mengeluarkan socket dari room terkait.

### 3. Mutasi berbasis socket

Setelah database berhasil diperbarui pada:

- `updateSPMLKPPNScore`;
- `updateSPMLKanwilScore`;
- `updateSPMLLinkFile`;
- `deleteWsSPMLJunctionFile`;

pancarkan `spmlWorksheetChanged` ke room worksheet terkait. Untuk mutasi socket gunakan `socket.to(room).emit(...)` agar browser pelaku tidak melakukan refresh ganda; pelaku tetap refresh melalui callback sukses yang sudah ada.

Payload hapus file perlu menyertakan `worksheetId`, baik dari junction hasil lookup maupun payload tervalidasi.

### 4. Upload file berbasis HTTP

Pada controller upload file SPML:

- Ganti `io.emit` global menjadi `io.to(roomName).emit('spmlWorksheetChanged', ...)`.
- Gunakan `changeType: 'file-upload'`.
- Request pelaku tetap melakukan refresh dari respons HTTP. Jika pelaku juga menerima event room, debounce frontend memastikan tidak terjadi ledakan request.

### 5. Komentar berbasis HTTP

Pada controller komentar:

- Setelah `addSPML` berhasil, emit `comment-add` ke room worksheet milik junction.
- Setelah penghapusan komentar SPML berhasil, emit `comment-delete` menggunakan `ws_spml_junction_id` dari komentar sebelum soft delete.
- Payload menyertakan `junctionId` agar popover komentar yang sedang terbuka dapat mengambil ulang daftar komentar terkait.
- Penghapusan komentar PB tidak memancarkan event SPML.

## Perubahan frontend

### 1. Hook sinkronisasi khusus

Buat hook seperti:

```text
useWsSPMLLiveSync.ts
```

Hook menerima:

- `worksheetId` aktif;
- KPPN aktif;
- fungsi refresh junction/scoring.

Tanggung jawab hook:

1. Join room saat worksheet ID tersedia.
2. Leave room saat worksheet berubah/unmount.
3. Join ulang pada event `connect` setelah reconnect.
4. Mendengarkan hanya `spmlWorksheetChanged`.
5. Memastikan payload `worksheetId` cocok dengan worksheet aktif sebagai pertahanan tambahan.
6. Debounce refresh sekitar 200–300 ms agar beberapa event beruntun digabung.
7. Melepas seluruh listener dan membatalkan debounce pada cleanup.

Pindahkan listener nilai yang sekarang berada di `WorksheetSPMLWorkspace` ke hook ini agar tidak ada listener ganda.

### 2. Strategi refresh berdasarkan jenis perubahan

Untuk `score`, `link`, `file-upload`, dan `file-delete`:

- Panggil refresh data junction terpusat.
- Refresh junction saat ini juga memanggil endpoint `ScoringEngine`, sehingga footer nilai dan progress ikut konsisten.

Untuk `comment-add` dan `comment-delete`:

- Refresh junction untuk memperbarui badge `comment_count`.
- Jangan memanggil scoring jika kelak tersedia fungsi refresh junction tanpa score, karena komentar tidak memengaruhi nilai. Pada tahap awal boleh memakai refresh terpusat untuk kesederhanaan dan konsistensi.
- Teruskan informasi perubahan terakhir melalui context atau event lokal agar popover yang sedang terbuka pada `junctionId` yang sama memanggil ulang daftar komentar.

### 3. State perubahan terakhir

Tambahkan pada context SPML state ringan:

```ts
lastLiveChange: SPMLWorksheetChangedEvent | null
```

Manfaat:

- `CommentPopoverSPML` dapat refresh hanya jika terbuka dan `junctionId` cocok.
- Preview file dapat menutup atau memperbarui tampilan jika file yang sedang dibuka dihapus user lain.
- Komponen lain tidak perlu memasang socket listener masing-masing.

### 4. Indikator perubahan

- Perubahan langsung diterapkan tanpa snackbar sukses pada user penerima agar tidak mengganggu saat banyak user bekerja.
- Opsional tampilkan indikator kecil “Data diperbarui” atau waktu sinkronisasi pada toolbar.
- Error refresh tetap menggunakan snackbar error yang sudah tersedia.
- Kontrol input yang sedang disimpan tetap disabled seperti sekarang untuk menghindari konflik interaksi lokal.

## Penanganan konflik

Model yang digunakan adalah **last successful write wins**:

1. Backend memvalidasi dan menyimpan setiap perubahan secara berurutan.
2. Event hanya dipancarkan setelah operasi database berhasil.
3. Semua browser kemudian mengambil ulang snapshot database terbaru.
4. Tidak ada update optimistis lintas pengguna.

Jika dua user mengubah checklist yang sama hampir bersamaan, nilai dari transaksi terakhir akan terlihat oleh seluruh user setelah event terakhir diterima.

## Keamanan

- Jangan menggunakan room yang dapat dimasuki hanya berdasarkan ID tanpa validasi akses.
- Backend harus memverifikasi worksheet dan KPPN sebelum `socket.join`.
- Event tidak perlu membawa isi komentar, URL sensitif, atau nama file lengkap; cukup ID dan jenis perubahan.
- Endpoint refresh tetap menerapkan autentikasi dan otorisasi sebagai lapisan utama.
- Ganti broadcast global upload SPML dengan room-scoped emit untuk mencegah kebocoran metadata antar-worksheet.

## File yang diperkirakan berubah

Backend:

- `backend/src/events/wsSPMLJunctionEvent.ts`
- `backend/src/controller/wsSPMLJunction.controller.ts`
- `backend/src/controller/comment.controller.ts`
- Utility baru untuk room/event SPML, misalnya `backend/src/utils/wsSPMLSocket.utils.ts`

Frontend:

- `frontend/src/sections/worksheetSPML/WorksheetSPMLWorkspace.tsx`
- `frontend/src/sections/worksheetSPML/useWsSPMLJunction.tsx`
- Hook baru `frontend/src/sections/worksheetSPML/useWsSPMLLiveSync.ts`
- `frontend/src/sections/worksheetSPML/components/CommentPopoverSPML.tsx`
- `frontend/src/sections/worksheetSPML/components/PreviewFileModal.tsx` bila preview perlu merespons penghapusan live.
- `frontend/src/sections/worksheetSPML/types.ts`

## Verifikasi multi-user

Gunakan minimal dua browser/session berbeda yang membuka worksheet sama:

1. User A mengubah nilai KPPN; User B melihat select, progress, total nilai, dan nilai akhir berubah tanpa reload.
2. User A mengubah nilai Kanwil/N/A; User B menerima hasil terbaru.
3. User A menambah/menghapus link; tombol dan popover User B diperbarui.
4. User A upload file; tombol file User B muncul dan tombol upload hilang.
5. User A menghapus file; User B melihat tombol upload kembali.
6. User A menambah komentar; badge User B bertambah dan popover terbuka ikut diperbarui.
7. User A menghapus komentar; badge User B berkurang.
8. User yang membuka worksheet berbeda tidak menerima atau me-refresh data.
9. Setelah koneksi terputus dan tersambung kembali, browser kembali menerima perubahan.
10. Navigasi keluar-masuk workspace tidak menggandakan listener.
11. Beberapa perubahan cepat hanya menghasilkan refresh ter-debounce.
12. Build backend/frontend, unit test terkait, dan ESLint terarah berhasil.
