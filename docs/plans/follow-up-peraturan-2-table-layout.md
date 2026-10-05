# Rencana: Tampilan Tindak Lanjut Peraturan 2 per Jenis Kertas Kerja

## Tujuan

Menyesuaikan menu Tindak Lanjut agar satu temuan Peraturan 2 tetap terlihat dalam konteks worksheet asalnya. Daftar temuan menandai jenis worksheet PB/CK/SPML, dan detail checklist CK/SPML ditampilkan dengan bentuk tabel, bukan worksheet card PB.

## Perilaku UI

### Daftar temuan

- Peraturan 1 tidak berubah.
- Peraturan 2 mengelompokkan temuan berdasarkan urutan PB, CK, SPML.
- Tambahkan penanda jenis kertas kerja yang tampak menyatu untuk seluruh baris di kelompok tersebut, menggunakan cell `rowSpan` dengan label “Kertas Kerja PB”, “Kertas Kerja CK”, atau “Kertas Kerja SPML”.
- Nomor urut temuan tetap berlanjut lintas kelompok; tampilan status, PIC, permasalahan, dan tombol detail tetap dipertahankan.
- Kelompok tanpa temuan tidak dirender; keadaan kosong tetap menampilkan pesan yang sesuai.

### Detail temuan

- Peraturan 1 tetap menggunakan `FollowUpCard` yang sudah ada.
- Temuan PB Peraturan 2 tetap memakai komponen detail PB yang ada, kecuali ditemukan ketidakcocokan data.
- Temuan CK dan SPML Peraturan 2 memakai komponen detail berbentuk tabel ringkas dengan kolom sesuai worksheet asal: nomor/materi atau aspek, kriteria/uraian, bukti dukung awal (read-only), bukti dukung tindak lanjut, nilai KPPN, nilai Kanwil, tanggapan KPPN, catatan Kanwil, dan status/approval.
- Gunakan editor dan endpoint tindak lanjut yang sudah ada, sehingga nilai, file/link, tanggapan/catatan, dan approval tetap tersimpan pada record Findings; junction worksheet awal tidak ditimpa.
- Komponen nilai CK/SPML memakai opsi sesuai checklist dan tetap menghormati izin role serta rentang tanggal follow-up.

## Implementasi

1. Tambahkan `worksheet_type` ke tipe frontend findings dan pastikan list/detail API menyediakannya.
2. Ubah `FollowUpTable` agar pada Peraturan 2 mengurutkan dan mengelompokkan temuan menurut jenis worksheet, lalu merender cell row-span penanda jenis kerja.
3. Pada halaman detail, cabangkan tampilan dari `worksheet_type` dan `peraturan`: `FollowUpCard` untuk PB/Peraturan 1, komponen tabel detail khusus CK dan SPML untuk Peraturan 2.
4. Reuse komponen input nilai, file/link, catatan/tanggapan, dan approval bila bentuk props sesuai; jika tidak, buat komponen kontrol ringkas yang memanggil API findings yang sama.
5. Pastikan navigasi list-detail, preview bukti dukung, refresh setelah simpan, fase read-only, serta dark mode tetap berfungsi.

## Verifikasi

- Peraturan 1 tetap memakai tampilan tabel list dan card detail yang sama seperti sebelumnya.
- List Peraturan 2 menampilkan kelompok PB/CK/SPML dengan label row-span; label hilang jika kelompok tidak memiliki temuan.
- Detail temuan CK dan SPML berupa tabel dan menampilkan isi dari referensi/checklist serta bukti awal yang read-only.
- Update nilai, file/link, tanggapan/catatan, dan status mengubah record findings saja, bukan junction worksheet.
- Periode di luar rentang tindak lanjut menonaktifkan aksi UI; validasi backend tetap berlaku.
- Periksa TypeScript frontend dan uji navigasi dari tiap kelompok ke detail.
