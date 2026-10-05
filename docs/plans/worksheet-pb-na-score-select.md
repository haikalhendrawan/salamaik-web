# Rencana Penyatuan Mekanisme N/A Kertas Kerja PB

## Tujuan

Mengubah mekanisme N/A pada kertas kerja Proses Bisnis (PB) agar sama dengan CK dan SPML: pengguna memilih `N/A` dari kontrol nilai, bukan menekan tombol exclude pada header card.

## Perilaku yang diharapkan

1. Nilai PB biasa menampilkan opsi nilai referensi, pilihan kosong, dan `N/A` pada select yang sama.
2. Jika `excluded === 1`, select KPPN dan Kanwil sama-sama menampilkan `N/A` karena kolom excluded berlaku untuk satu junction.
3. Saat pengguna memilih `N/A`:
   - nilai maksimum ditentukan dari opsi checklist yang tersedia;
   - untuk checklist standardisasi PB, nilai maksimum adalah `12`;
   - score KPPN dan Kanwil sama-sama disimpan sebesar nilai maksimum;
   - `excluded` disimpan sebagai `1` dalam query yang sama;
4. Saat pengguna mengganti `N/A` ke nilai numerik:
   - score disimpan sesuai nilai yang dipilih;
   - `excluded` disimpan sebagai `0` dalam query yang sama.
5. Hak edit tetap mengikuti pihak yang sedang login dan periode kertas kerja:
   - KPPN hanya mengubah nilai KPPN;
   - Kanwil hanya mengubah nilai Kanwil;
   - checklist yang terkunci oleh periode tetap tidak dapat diubah.
6. Tombol exclude pada header card PB dihapus dari UI.

## Checklist standardisasi

Checklist standardisasi menggunakan input angka bebas/desimal pada rentang 0–12 sehingga tidak tepat diubah menjadi daftar ratusan opsi nilai.

Untuk checklist ini:

- input angka dan tombol mengambil nilai standardisasi tetap dipertahankan;
- ditambahkan select status nilai di area yang sama dengan pilihan `Nilai` dan `N/A`;
- memilih `N/A` menyimpan kedua score sebesar `12` dan `excluded = 1`;
- memilih `Nilai` kembali mengaktifkan input angka dan mengubah `excluded = 0` menggunakan nilai numerik terakhir yang valid;
- ketika excluded, select status tetap aktif selama periode mengizinkan perubahan agar N/A dapat dibatalkan.

Dengan cara ini penentuan N/A tetap dilakukan melalui select tanpa menghilangkan dukungan nilai desimal standardisasi.

## Perubahan frontend

### `WorksheetCard/Nilai.tsx`

- Jadikan nilai select controlled berdasarkan gabungan score dan `excluded`.
- Tambahkan opsi `N/A` pada select KPPN dan Kanwil untuk checklist biasa.
- Kirim `excluded` bersama score melalui event websocket.
- Satukan handler penyimpanan agar nilai numerik dan N/A melewati alur callback/refetch yang sama.
- Tambahkan select status untuk checklist standardisasi.
- Pastikan state input standardisasi mengikuti perubahan junction terbaru.
- Tampilkan status saving/disabled secara konsisten dan tetap mengizinkan pembatalan N/A selama periode edit terbuka.

### `WorksheetCard/Head.tsx`

- Hapus tombol flag exclude.
- Hapus request langsung ke `/editWsJunctionExclude` beserta state/import yang hanya digunakan tombol tersebut.
- Pertahankan indikator last update dan tombol komentar.

### `WorksheetCard/WorksheetCard.tsx`

- Hapus pemblokiran `pointerEvents` pada seluruh body ketika excluded karena itu membuat select N/A tidak dapat dikembalikan ke nilai biasa.
- Hapus prop `isExcluded` ke komponen nilai bila status sudah dibaca langsung dari junction.
- Status disabled masing-masing fitur tetap ditentukan oleh permission/periode pada komponennya.

## Perubahan backend

### `worksheetEvent.ts`

- Event `updateKPPNScore` dan `updateKanwilScore` menerima `excluded: 0 | 1`.
- Validasi nilai `excluded`.
- Jika `excluded === 1`, backend menentukan nilai maksimum secara authoritative lalu menyimpan nilai tersebut pada score KPPN dan Kanwil; validasi opsi nilai biasa tidak digunakan.
- Jika `excluded === 0`, score divalidasi menggunakan aturan opsi atau standardisasi yang sudah ada.
- Broadcast perubahan menyertakan `excluded` agar kontraknya lengkap.
- Log aktivitas mencatat score dan status excluded.

### `worksheetJunction.model.ts`

- Update score KPPN/Kanwil sekaligus meng-update `excluded`, `last_update`, dan `updated_by` secara atomik.
- Saat N/A dipilih, kedua score di-update ke nilai maksimum dalam query yang sama.
- Tidak mengubah atau menghapus `kanwil_note` ketika status N/A berubah.
- Operasi tetap dibatasi oleh pasangan `junction_id` dan `worksheet_id`.

### Endpoint REST nilai

- Sesuaikan controller REST `editWsJunctionKPPNScore` dan `editWsJunctionKanwilScore` dengan kontrak `excluded` yang sama agar perilakunya tidak berbeda dari websocket.
- Endpoint lama `editWsJunctionExclude` dapat dipertahankan sementara untuk kompatibilitas, tetapi tidak lagi dipanggil UI PB.

## Konsistensi CK dan SPML

- CK tidak lagi memakai angka `10` yang di-hardcode. Backend mengambil nilai maksimum dari `opsi_ck_ref` yang tergabung pada junction, lalu menyimpannya pada score KPPN dan Kanwil.
- SPML tetap menggunakan nilai maksimum `10` untuk saat ini karena tidak memiliki referensi opsi nilai.
- Saat N/A dipilih pada SPML, score KPPN dan Kanwil sama-sama diubah menjadi `10`; sebelumnya hanya score pihak yang memilih yang berubah.
- Perhitungan nilai maksimum dilakukan atau diverifikasi di backend agar tidak bergantung pada payload frontend.

## Dampak terhadap perhitungan

- Tidak ada perubahan formula scoring PB.
- Scoring Engine tetap mengabaikan junction dengan `excluded === 1` dari total dan pembagi.
- Score maksimum yang tersimpan bersama status N/A mengikuti aturan scoring masing-masing worksheet; PB dan SPML tetap mengecualikan N/A sesuai formulanya, sedangkan CK tetap memperlakukan N/A sesuai formula CK.
- Saat N/A dibatalkan, nilai numerik baru kembali dihitung karena `excluded` menjadi `0`.

## Database

Tidak memerlukan migrasi. Kolom `excluded`, `kppn_score`, dan `kanwil_score` sudah tersedia. Konsistensi perubahan dijaga melalui update atomik pada model, bukan constraint database baru.

## Verifikasi

1. Build frontend dan backend.
2. Tambahkan/update test model untuk memastikan kedua score dan excluded diubah dalam satu query.
3. Uji checklist PB biasa untuk KPPN dan Kanwil:
   - nilai kosong;
   - memilih nilai numerik;
   - memilih N/A;
   - mengganti N/A kembali ke nilai numerik.
4. Uji checklist standardisasi:
   - input nilai desimal tetap berfungsi;
   - mengambil nilai standardisasi tetap berfungsi;
   - memilih N/A dan membatalkannya kembali melalui select status.
5. Pastikan tombol exclude tidak lagi muncul pada header card.
6. Pastikan N/A masih bisa dibatalkan selama periode pengisian terbuka.
7. Pastikan perubahan diterima user lain melalui mekanisme refresh/broadcast dan drawer navigasi menampilkan status excluded yang benar.
8. Pastikan pada periode terkunci semua kontrol nilai, termasuk N/A, tetap disabled.
9. Uji CK dengan opsi maksimum selain 10 untuk memastikan nilai N/A mengikuti referensi opsi.
10. Uji SPML untuk memastikan kedua score menjadi 10 ketika N/A dipilih.

## Batas perubahan

- Tidak mengubah rumus scoring PB.
- Tidak menghapus endpoint exclude lama pada tahap ini agar kompatibilitas tetap terjaga.
- Implementasi dimulai setelah rencana ini disetujui.
