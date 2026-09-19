# Rencana Menghapus Constraint Relasi N/A Worksheet CK

## Tujuan

Membiarkan tabel `worksheet_ck_junction` bersifat loose terhadap hubungan antara kolom `excluded`, `kppn_score`, dan `kanwil_score`. Aturan N/A dijaga oleh kode backend, bukan oleh check constraint gabungan di database.

## Perubahan SQL

1. Hapus deklarasi constraint `worksheet_ck_junction_excluded_score_ck` dari `sql/01_create_worksheet_ck_tables.sql` agar instalasi database baru tidak membuat constraint tersebut.
2. Ubah migration lanjutan `sql/03_update_worksheet_ck_excluded_score.sql` agar hanya menjalankan:
   - `DROP CONSTRAINT IF EXISTS worksheet_ck_junction_excluded_score_ck`;
   - tanpa melakukan update data lama;
   - tanpa membuat kembali constraint pengganti.
3. Constraint individual tetap dipertahankan:
   - `kppn_score` dan `kanwil_score` hanya `NULL`, `0`, `5`, atau `10`;
   - `excluded` hanya `0` atau `1`.

## Aturan pada backend

Logika model `wsCKJunction` tetap menjadi sumber konsistensi data:

- ketika user memilih N/A (`excluded = 1`), update dilakukan dalam satu query yang menetapkan `excluded = 1`, `kppn_score = 10`, dan `kanwil_score = 10`;
- ketika user memilih nilai biasa, `excluded = 0` dan skor pihak yang sedang mengisi diperbarui menjadi `0`, `5`, atau `10`;
- endpoint/socket tidak menerima nilai di luar opsi CK yang valid.

Tidak diperlukan perubahan pada response API atau kontrak event WebSocket.

## Verifikasi

1. Pastikan tidak ada lagi perintah `ADD CONSTRAINT worksheet_ck_junction_excluded_score_ck` dalam SQL.
2. Jalankan build backend.
3. Jalankan unit test junction CK untuk memastikan aturan N/A di kode tetap menghasilkan kedua skor `10`.

