# Rencana E2E Live UX Simulation Kertas Kerja SPML

## Tujuan

Menyediakan mode pengujian langsung dari UI Kertas Kerja SPML yang mensimulasikan lima user lain mengubah worksheet yang sama secara acak melalui WebSocket.

Jenis aktivitas simulasi:

1. mengubah nilai KPPN;
2. mengubah nilai Kanwil;
3. memilih nilai N/A;
4. mengunggah file dummy;
5. menghapus file;
6. menambah atau mengubah link file;
7. menambah komentar.

Aktivitas mempunyai jeda acak, tetapi beberapa aktivitas sengaja dijadwalkan dalam burst agar UI juga diuji ketika menerima beberapa perubahan hampir bersamaan. Setelah skenario selesai atau dihentikan, seluruh perubahan database di-rollback sehingga worksheet dummy dapat digunakan kembali.

## Kendala transaksi yang harus ditangani

Frontend saat ini menangani event `spmlWorksheetChanged` dengan memanggil ulang endpoint worksheet dan scoring. PostgreSQL tidak memperlihatkan perubahan yang belum di-commit kepada koneksi lain.

Jika simulator hanya menjalankan:

```text
BEGIN -> UPDATE -> emit WebSocket -> ROLLBACK
```

maka request refetch dari UI menggunakan koneksi pool lain dan tetap memperoleh data lama. Event terlihat masuk, tetapi perubahan tidak terlihat pada tabel.

Solusinya adalah membuat **SPML UX Test Session**:

- satu `PoolClient` khusus mengambil transaksi dengan `BEGIN`;
- session mempunyai ID acak yang tidak dapat ditebak;
- semua read/write dari UI selama test menyertakan session ID;
- backend menjalankan query tersebut melalui `PoolClient` transaksi yang sama;
- event WebSocket tetap memakai event live-sync aplikasi;
- saat selesai dilakukan `ROLLBACK`, client dilepas, file sementara dibersihkan, lalu UI melakukan refetch normal.

Dengan mekanisme ini, pengujian tetap end-to-end dari UI, HTTP/Socket.IO, backend, query database, dan kembali ke UI, bukan hanya perubahan state palsu di frontend.

## Batas keamanan

Fitur harus diperlakukan sebagai development/test tooling:

- hanya aktif jika `ENABLE_SPML_UX_TEST=true` di backend dan `VITE_ENABLE_SPML_UX_TEST=true` di frontend;
- endpoint hanya dapat diakses Super Admin (`role 99`) pada tahap awal;
- wajib menggunakan worksheet dummy;
- satu worksheet hanya boleh mempunyai satu test session aktif;
- session dibatasi maksimum, misalnya 2 menit;
- jumlah actor selalu 5, sedangkan jumlah aksi dan durasi dapat dibatasi;
- semua input divalidasi dan worksheet harus benar-benar tersedia;
- test session tidak membuat activity log permanen;
- session otomatis rollback pada selesai, stop manual, error, timeout, atau shutdown server;
- endpoint tidak didaftarkan/akan mengembalikan 404 ketika feature flag mati.

## Arsitektur backend

### 1. `SPMLUxTestSessionManager`

Buat service khusus untuk menyimpan session aktif dalam `Map` in-memory:

```ts
interface SPMLUxTestSession {
  id: string;
  worksheetId: string;
  client: PoolClient;
  status: 'running' | 'rolling-back' | 'finished' | 'failed';
  createdBy: string;
  actors: SPMLUxTestActor[];
  completedActions: number;
  totalActions: number;
  temporaryFiles: Set<string>;
  expiresAt: Date;
}
```

Tanggung jawab manager:

- membuat `PoolClient` dan menjalankan `BEGIN`;
- memvalidasi worksheet serta mengambil daftar junction;
- mencegah dua session pada worksheet yang sama;
- mengeksekusi query session secara serial;
- menggunakan `SAVEPOINT` untuk setiap aksi agar satu aksi gagal tidak membatalkan seluruh transaksi;
- menyediakan client session untuk endpoint read/write;
- menjalankan scheduler lima actor;
- melakukan `ROLLBACK` dan `client.release()` di dalam `finally`;
- menghapus semua file sementara;
- menyediakan stop manual dan timeout cleanup.

Session disimpan in-memory sehingga tahap pertama hanya mendukung satu instance backend. Jika aplikasi dijalankan multi-instance, session perlu dipindahkan ke coordinator/worker khusus dan routing session dibuat sticky.

### 2. Middleware test session

Tambahkan middleware yang membaca header:

```text
X-SPML-UX-Test-Session: <sessionId>
```

Middleware memvalidasi:

- feature flag aktif;
- session masih hidup;
- user berhak melihat worksheet;
- endpoint/junction yang diakses masih berada pada worksheet session.

Jika valid, request memperoleh executor database session. Jika header tidak ada, endpoint berjalan normal seperti saat ini.

Untuk Socket.IO, `testSessionId` dikirim pada payload event score/link/delete dan divalidasi dengan aturan yang sama.

### 3. Dukungan transaksi pada model

Model berikut perlu konsisten menerima `PoolClient` opsional:

- `wsSPMLJunction.model.ts` untuk get junction, score, link, upload, dan delete file;
- `comment.model.ts` sudah sebagian besar mendukung `PoolClient` dan tinggal digunakan;
- `scoringEngine.model.ts` sudah mendukung `PoolClient` pada kalkulasi SPML;
- query worksheet/access validation yang diperlukan session.

Semua endpoint normal tetap memakai pool ketika tidak ada test session.

### 4. Endpoint kontrol simulasi

Tambahkan route development, misalnya:

```text
POST /dev/spml-ux-test/start
GET  /dev/spml-ux-test/:sessionId/status
POST /dev/spml-ux-test/:sessionId/stop
```

Body start:

```json
{
  "worksheetId": "worksheet-dummy-id",
  "totalActions": 30,
  "minDelayMs": 500,
  "maxDelayMs": 2500,
  "burstProbability": 0.2,
  "holdAfterSeconds": 5,
  "seed": "optional-repeatable-seed"
}
```

Validasi batas yang disarankan:

- `totalActions`: 5–100;
- `minDelayMs`: minimal 200;
- `maxDelayMs`: maksimal 10.000;
- `burstProbability`: 0–0,5;
- `holdAfterSeconds`: 0–30;
- total umur session: maksimal 120 detik.

Response start berisi `sessionId`, worksheet, konfigurasi, actor, dan waktu kedaluwarsa.

### 5. Lima actor simulator

Simulator mengambil lima user aktif dari `user_ref` yang relevan, atau menerima lima user ID eksplisit untuk hasil yang deterministik. Ini diperlukan karena komentar mempunyai foreign key `user_id`.

Masing-masing actor memiliki nama yang ditampilkan pada `changedBy`, misalnya nama user asli dengan penanda `[UX Test]` pada log UI. Jika user aktif kurang dari lima, start ditolak dengan pesan yang jelas.

Scheduler menggunakan seeded pseudo-random generator agar skenario dapat diulang. Seed yang sama menghasilkan urutan aksi, junction, nilai, dan delay yang sama.

### 6. Aturan aksi acak

#### Nilai KPPN/Kanwil

- pilih junction acak;
- pilih `0`, `10`, atau `N/A`;
- `N/A` disimpan sebagai score `10` dan `excluded = 1` sesuai aturan aplikasi;
- nilai biasa menyimpan `excluded = 0`;
- perubahan score memicu perhitungan ulang footer.

#### Link file

- isi/update `link_file` dengan URL dummy yang aman dan jelas berasal dari UX test;
- nilai link tidak mengarah ke domain berbahaya.

#### Upload file

- pilih junction yang belum mempunyai file;
- buat file fixture kecil dengan nama berprefix session, misalnya `ux-test-<sessionId>-<n>.pdf`;
- simpan di lokasi static upload agar tombol preview benar-benar dapat dibuka dari UI;
- catat nama file untuk cleanup.

#### Hapus file

- pilih junction yang mempunyai file;
- database dibuat `NULL` dalam transaksi;
- file asli yang sudah ada sebelum test **tidak pernah dihapus secara fisik**;
- file fixture milik session boleh dihapus atau tetap dicatat untuk cleanup akhir.

#### Komentar

- insert komentar melalui `comment_data` menggunakan actor yang dipilih;
- komentar diberi prefix `[UX Test]`;
- badge comment count dan popover harus membaca data melalui transaksi session.

Jika tidak ada kandidat valid untuk suatu aksi, scheduler memilih jenis aksi lain tanpa menggagalkan session.

### 7. Simulasi aktivitas hampir bersamaan

Setiap actor mempunyai timeline sendiri. Mayoritas aksi memiliki jeda acak. Berdasarkan `burstProbability`, dua atau tiga actor dijadwalkan pada waktu yang sama.

Satu koneksi PostgreSQL tetap mengeksekusi query secara serial, tetapi query dalam burst diproses berdekatan dan event dikirim hampir bersamaan. Hal ini cukup untuk menguji:

- debounce 250 ms pada `useWsSPMLLiveSync`;
- penggabungan beberapa target sinkronisasi;
- disable lokal pada ScoreSelect/FileActions;
- refresh scoring;
- perubahan progress dan comment badge yang beruntun.

### 8. Event WebSocket

Tetap gunakan room worksheet:

```text
spml:worksheet:<worksheetId>
```

Tambahkan event kontrol:

- `spmlUxTestStarted`;
- `spmlUxTestProgress`;
- `spmlUxTestFinished`;
- `spmlUxTestFailed`.

Mutasi tetap mengirim `spmlWorksheetChanged`, diperluas dengan properti opsional:

```ts
testSessionId?: string;
actor?: { id: string; name: string };
```

Frontend yang menerima `spmlUxTestStarted` menyimpan session ID. Saat menerima `spmlWorksheetChanged` dengan session tersebut, refetch worksheet, scoring, dan komentar menggunakan header session. Dengan demikian jalur live-sync yang diuji tetap sama dengan jalur produksi.

Event progress berisi informasi ringkas untuk UI:

```ts
{
  sessionId: string;
  completedActions: number;
  totalActions: number;
  actorName: string;
  action: 'kppn-score' | 'kanwil-score' | 'file-upload' |
          'file-delete' | 'link' | 'comment-add';
  junctionId: number;
  timestamp: string;
}
```

## Integrasi input user selama test

Mode ini tidak hanya untuk menonton simulasi. User yang membuka worksheet tetap dapat mengisi nilai, link, file, dan komentar.

Selama session aktif:

- request HTTP user menyertakan header session;
- payload Socket.IO user menyertakan `testSessionId`;
- perubahan user ikut masuk ke transaksi yang sama;
- perubahan user juga terlihat live oleh tab/user lain;
- seluruh perubahan user selama banner test aktif ikut di-rollback saat test berakhir.

Manager mengeksekusi setiap request melalui antrean dan `SAVEPOINT` agar query simulator dan user tidak memakai satu `PoolClient` secara bersamaan.

Banner UI harus menjelaskan dengan jelas: **“Mode UX Test aktif — seluruh input selama sesi akan di-rollback.”**

## UI pengujian live

### Tombol pada toolbar

Tambahkan IconButton/aksi `Simulasi Live` pada `WorksheetSPMLToolbar`, hanya tampil jika feature flag aktif dan user Super Admin.

Tombol membuka dialog dengan:

- worksheet ID aktif, otomatis terisi dan read-only;
- jumlah aksi;
- delay minimum/maksimum;
- probabilitas burst;
- hold time sebelum rollback;
- seed opsional;
- tombol `Mulai Simulasi`.

Parameter worksheet menggunakan `activeWorksheetId` yang sudah tersedia dari junction, sehingga user tidak perlu menyalin ID secara manual. Untuk kebutuhan khusus, endpoint tetap menerima `worksheetId` sebagai parameter.

### Status saat berjalan

Toolbar atau panel kecil menampilkan:

- banner mode test;
- progress `aksi selesai/total`;
- lima actor aktif;
- aksi terakhir, junction, dan timestamp;
- countdown/expired time;
- tombol `Stop & Rollback`.

Tidak ada loading overlay global. Existing per-component syncing state tetap digunakan sehingga hanya ScoreSelect, file, link, atau komentar yang sedang berubah yang menunjukkan status sementara.

### Integrasi context frontend

Tambahkan state test session pada context SPML:

```ts
interface SPMLUxTestState {
  sessionId: string | null;
  status: 'idle' | 'running' | 'rolling-back' | 'failed';
  progress: number;
  completedActions: number;
  totalActions: number;
  lastAction: SPMLUxTestProgressEvent | null;
}
```

Context menyediakan session ID kepada:

- `useWsSPMLJunction` untuk read/refetch dan scoring;
- `ScoreSelect`;
- `FileActions` dan preview;
- `LinkFilePopover`;
- `CommentPopoverSPML`;
- `useWsSPMLLiveSync`.

Setelah event finish/fail:

1. frontend menghapus session ID;
2. memanggil refetch normal tanpa header test;
3. score, progress, file, link, dan comment badge kembali ke baseline;
4. snackbar menampilkan hasil rollback.

## Lifecycle rollback dan cleanup

Urutan normal:

```text
Start UI
  -> POST start
  -> BEGIN
  -> emit spmlUxTestStarted
  -> 5 actor menjalankan aksi acak
  -> UI refetch melalui transaction session
  -> hold beberapa detik
  -> ROLLBACK
  -> hapus file fixture
  -> release PoolClient
  -> emit spmlUxTestFinished
  -> UI refetch normal
```

Urutan error/stop menggunakan cleanup yang sama di dalam `finally`.

Sebelum rollback, manager dapat menghitung checksum/snapshot baseline. Setelah rollback, endpoint normal diverifikasi kembali terhadap baseline untuk memastikan tidak ada data test tersisa.

## File yang diperkirakan berubah/ditambahkan

### Backend

- `backend/src/service/spmlUxTestSession.service.ts` (baru)
- `backend/src/controller/spmlUxTest.controller.ts` (baru)
- `backend/src/routes/spmlUxTestRoute.ts` (baru)
- `backend/src/middleware/spmlUxTestSession.ts` (baru)
- `backend/src/model/wsSPMLJunction.model.ts`
- `backend/src/model/comment.model.ts`
- `backend/src/model/scoringEngine.model.ts` bila ada query yang belum menerima client
- `backend/src/events/wsSPMLJunctionEvent.ts`
- `backend/src/utils/wsSPMLSocket.utils.ts`
- `backend/src/controller/wsSPMLJunction.controller.ts`
- `backend/src/controller/comment.controller.ts`
- `backend/src/controller/scoringEngine.controller.ts`
- `backend/src/index.ts`
- `.env.example`

### Frontend

- `frontend/src/sections/worksheetSPML/types.ts`
- `frontend/src/sections/worksheetSPML/useWsSPMLJunction.tsx`
- `frontend/src/sections/worksheetSPML/useWsSPMLLiveSync.ts`
- `frontend/src/sections/worksheetSPML/WorksheetSPMLWorkspace.tsx`
- `frontend/src/sections/worksheetSPML/components/WorksheetSPMLToolbar.tsx`
- komponen dialog/status simulasi baru
- `ScoreSelect.tsx`
- `FileActions.tsx`
- `LinkFilePopover.tsx`
- `CommentPopoverSPML.tsx`
- `.env.example`

## Pengujian otomatis

### Unit test

- seeded random menghasilkan timeline yang sama;
- pemilihan aksi selalu valid;
- burst berada dalam batas konfigurasi;
- file asli tidak pernah dihapus;
- session timeout selalu menjalankan cleanup.

### Integration test backend

1. ambil snapshot worksheet baseline;
2. start session dan pastikan `BEGIN` aktif;
3. jalankan seluruh jenis mutasi;
4. baca data tanpa session dan pastikan masih baseline;
5. baca data dengan session dan pastikan perubahan terlihat;
6. stop session;
7. pastikan data normal sama persis dengan baseline;
8. pastikan komentar dan file fixture tidak tersisa;
9. uji error di tengah aksi dan pastikan rollback tetap berjalan.

### Pengujian live UI

1. buka worksheet dummy pada dua browser/tab dengan user berbeda;
2. mulai simulasi dari toolbar;
3. pastikan kedua tab menerima banner test;
4. amati nilai, progress, footer score, link, file, comment badge, dan drawer berubah tanpa overlay global;
5. buka komentar ketika simulator menambahkan komentar;
6. buka file fixture yang baru diunggah;
7. isi satu nilai secara manual ketika actor lain juga bekerja;
8. amati beberapa aksi burst dan disable hanya pada komponen terkait;
9. tunggu selesai atau klik `Stop & Rollback`;
10. pastikan kedua tab kembali ke baseline tanpa reload manual;
11. jalankan ulang menggunakan seed yang sama.

## Tahapan implementasi yang disarankan

1. Buat transaction session manager, feature flag, dan endpoint start/stop/status.
2. Tambahkan dukungan `PoolClient` opsional pada seluruh model dan controller SPML terkait.
3. Buat scheduler lima actor beserta file fixture dan cleanup.
4. Tambahkan event lifecycle/progress WebSocket.
5. Tambahkan test-session state dan propagasi header/payload pada frontend.
6. Buat dialog serta panel status pada toolbar.
7. Tambahkan unit dan integration test rollback.
8. Jalankan pengujian live pada dua tab/browser menggunakan worksheet dummy.

## Kriteria selesai

- Lima actor menghasilkan aktivitas acak dan burst.
- UI memperlihatkan perubahan secara live tanpa overlay global.
- Tester tetap dapat mengisi worksheet selama simulasi.
- Read, score, komentar, dan preview file melihat data transaksi yang sama.
- Stop, selesai, error, dan timeout selalu rollback.
- Data worksheet, komentar, dan file kembali persis ke baseline.
- Fitur tidak tersedia ketika feature flag mati atau user tidak berwenang.
- Skenario dapat diulang dengan seed yang sama.

