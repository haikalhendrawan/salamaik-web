# Rencana Backend Pengisian Kertas Kerja CK

## Tujuan

Menyediakan backend untuk pengisian Kertas Kerja Capaian Kinerja (CK), dengan pola yang konsisten dengan Kertas Kerja PB dan SPML: mengambil junction yang sudah digabung dengan referensi, mengubah nilai/catatan/link, mengunggah dan menghapus satu file bukti dukung, memberi komentar, serta menyiarkan perubahan secara langsung melalui WebSocket.

Implementasi tahap ini hanya mencakup backend. Frontend pengisian CK akan menggunakan kontrak yang dibuat pada tahap berikutnya.

## Struktur response junction CK

Setiap baris hasil pengambilan worksheet akan memuat:

- data `worksheet_ck_junction`;
- data checklist: `materi`, header `kriteria_penilaian`, `bukti_dukung`, dan urutan checklist;
- data komponen: id, urut, title, alias, dan detail;
- `opsi` sebagai array JSON aktif milik checklist, diurutkan berdasarkan `urut` lalu id;
- `comment_count`, hanya menghitung komentar aktif yang menunjuk `ws_ck_junction_id`.

Dengan bentuk ini, frontend tidak perlu menggabungkan dictionary secara manual untuk merender opsi nilai dan struktur tabel.

## Model junction CK

Buat `backend/src/model/wsCKJunction.model.ts` dengan tipe data dan metode berikut:

1. `getByWorksheetId(worksheetId, client?)`
   - Join `worksheet_ck_junction`, `checklist_ck_ref`, `komponen_ck_ref`, dan `opsi_ck_ref` aktif.
   - Menghasilkan opsi sebagai JSON array dan jumlah komentar aktif.
2. `getByJunctionId(junctionId, client?)`
   - Dipakai untuk validasi kepemilikan worksheet, upload, komentar, dan mutasi.
3. `assignWorksheet(worksheetId, peraturan, client)`
   - Batch insert seluruh checklist CK aktif pada peraturan tersebut.
   - Memanfaatkan transaksi assignment yang sudah ada.
4. Mutasi nilai KPPN dan Kanwil.
   - Nilai valid hanya `0`, `5`, `10`, atau mode N/A.
   - Bila `excluded = 1`, satu update atomik menetapkan `kppn_score = 10` dan `kanwil_score = 10` sesuai klarifikasi bisnis terbaru.
   - Bila nilai biasa dipilih, `excluded = 0` dan hanya skor pihak terkait yang diubah.
5. Mutasi `kppn_note`, `kanwil_note`, dan `link_file`.
6. Menyimpan `file_1` hanya bila masih kosong dan menghapus referensi `file_1`.
7. Semua mutasi memperbarui `last_update` dan `updated_by`, serta memakai `RETURNING` agar controller/socket dapat mengirim state terbaru.

## Controller dan route HTTP

Buat `backend/src/controller/wsCKJunction.controller.ts` dan `backend/src/routes/wsCKJunctionRoute.ts`, kemudian daftarkan dengan prefix `/wsCKJunction` di `backend/src/index.ts`.

Endpoint awal:

- `GET /wsCKJunction/getWsCKJunctionByWorksheetForKPPN`
  - Mengambil worksheet dari `period` dan KPPN pada token.
  - Dapat digunakan role `99, 4, 3, 2, 1`, mengikuti kompatibilitas endpoint PB/SPML.
- `GET /wsCKJunction/getWsCKJunctionByWorksheetForKanwil?kppn=...`
  - Mengambil worksheet KPPN terpilih pada periode token.
  - Hanya role `99, 4, 3`.
- `POST /wsCKJunction/editWsCKJunctionFile`
  - Multipart upload satu `file_1`.
  - Dapat digunakan kedua pihak selama mempunyai akses ke worksheet.
  - Menolak upload kedua dengan status konflik sampai file lama dihapus.

Perubahan nilai, catatan, link, dan penghapusan file dibuat sebagai event Socket.IO seperti implementasi SPML agar pengisian inline dan live-sync tidak mempunyai dua jalur mutasi yang berbeda.

Setiap operasi wajib memvalidasi:

- format worksheet/junction/checklist dan payload;
- junction benar-benar milik worksheet yang dikirim;
- worksheet milik KPPN yang berhak diakses;
- role KPPN hanya mengubah `kppn_score`/`kppn_note`;
- role Kanwil hanya mengubah `kanwil_score`/`kanwil_note`;
- kedua pihak dapat mengubah link, mengunggah file, dan menghapus file;
- nama file disanitasi dengan `path.basename` sebelum operasi filesystem.

## Upload file CK

Tambahkan konfigurasi `uploadWsCKJunctionFile` pada `backend/src/config/multer.ts`:

- memakai folder `uploads/worksheet` yang sama;
- memakai whitelist tipe file dan batas 20 MB yang sudah dipakai PB/SPML;
- field multipart khusus `wsCKJunctionFile`;
- nama unik berawalan `ck_` dan memuat checklist, KPPN pemilik worksheet, worksheet ID, serta timestamp;
- file hasil upload dibersihkan kembali apabila validasi database/controller gagal.

## WebSocket dan live synchronization

Buat utilitas room CK dan listener `backend/src/events/wsCKJunctionEvent.ts`, lalu daftarkan pada `backend/src/events/index.ts`.

Event dari frontend:

- `joinCKWorksheet` / `leaveCKWorksheet`;
- `updateCKKPPNScore`;
- `updateCKKanwilScore`;
- `updateCKKPPNNote`;
- `updateCKKanwilNote`;
- `updateCKLinkFile`;
- `deleteWsCKJunctionFile`.

Event ke client lain:

- event spesifik perubahan field untuk pembaruan state yang cepat;
- satu event generik `ckWorksheetChanged` dengan `worksheetId`, `junctionId`, `changeType`, `changedBy`, dan timestamp untuk mekanisme refetch senyap pada frontend nanti.

HTTP upload dan perubahan komentar juga menyiarkan `ckWorksheetChanged` ke room worksheet yang sama.

## Komentar CK

Perluas model/controller/route komentar yang sudah ada:

- tambahkan `ws_ck_junction_id` pada `CommentType`;
- model `getByWsCKJunctionId` dan `addCK`;
- `GET /comment/getByWsCKJunctionId/:wsCKJunctionId`;
- `POST /comment/addCK`;
- validasi junction dan hak akses sebelum membaca/menambah komentar;
- saat komentar CK ditambah atau dihapus, emit `ckWorksheetChanged`;
- endpoint hapus komentar yang sama tetap dipakai dan hanya mengizinkan pembuat komentar.

## Assignment worksheet

Perbarui `assignWorksheet` di `backend/src/controller/worksheet.controller.ts`:

- `peraturan === 1`: tetap hanya assignment PB;
- `peraturan !== 1`: assignment PB, SPML, lalu CK;
- CK mengambil seluruh checklist aktif yang komponen induknya berasal dari peraturan aktif;
- insert CK berada dalam transaksi database yang sama dengan PB/SPML;
- kegagalan salah satu assignment menyebabkan rollback seluruh assignment;
- status `worksheet_ref` tetap diubah setelah rangkaian assignment berhasil, tanpa membuat worksheet master baru.

Batch insert CK akan dipilih agar assignment tidak menjalankan satu query per checklist dan tetap aman terhadap constraint unik `(worksheet_id, checklist_ck_id)`.

## Pencatatan aktivitas

Gunakan `nonBlockingCall(activity.createActivity(...))` untuk mutasi Socket.IO seperti pola PB/SPML. Karena referensi kode aktivitas khusus CK belum tersedia di source code, tahap implementasi akan memakai kode aktivitas aksi ekuivalen yang sudah digunakan PB/SPML (nilai, file, catatan) agar tidak bergantung pada migrasi referensi aktivitas baru.

## Pengujian

1. Tambahkan unit test model untuk:
   - hasil join berisi opsi dan jumlah komentar;
   - nilai biasa membuka excluded;
   - N/A menetapkan kedua skor menjadi `10`;
   - upload kedua ditolak oleh update kondisional;
   - batch assignment memakai peraturan yang benar.
2. Uji komentar CK dan validasi akses pada controller/socket sejauh pola mocking proyek memungkinkan.
3. Jalankan `npm run build` backend.
4. Jalankan seluruh Jest backend dan laporkan bila terdapat kegagalan baseline yang tidak terkait.

## Catatan skema

Skema yang diperiksa sudah menyediakan `comment_data.ws_ck_junction_id`, tetapi file migrasi tidak mendefinisikan foreign key maupun index untuk kolom tersebut. Implementasi endpoint tidak bergantung pada perubahan skema tambahan, tetapi FK dan index sebaiknya dibuat dalam migrasi terpisah sebelum produksi untuk menjaga integritas relasi dan mempercepat query jumlah/daftar komentar. Migrasi tambahan itu tidak termasuk tahap kode ini kecuali diminta.
