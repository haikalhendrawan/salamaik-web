# Rencana: Kelola Bukti Dukung Sumber dari Menu Tindak Lanjut

## Tujuan

Memungkinkan pengelolaan file dan link bukti dukung yang tersimpan pada junction worksheet PB, CK, dan SPML ketika temuan sedang ditindaklanjuti, tanpa memakai endpoint pengisian awal yang mengunci perubahan setelah periode pengisian ditutup.

## Perilaku yang diinginkan

- File yang sudah tersimpan dapat dibuka, diganti, dan dihapus.
- File baru dapat ditambahkan selama masih di bawah kapasitas tiap tipe worksheet (PB maksimal 3; CK/SPML mengikuti kapasitas junction saat ini).
- Link bukti dukung dapat ditambah, diedit, dibuka, dan dihapus.
- Aksi tersedia hanya pada temuan yang sah dan selama periode follow-up worksheet terkait sedang berlangsung.
- Data yang dikelola adalah file/link sumber pada junction worksheet, bukan kolom `follow_up_file` yang merupakan lampiran tindak lanjut terpisah.

## Rencana perubahan

1. **Backend: endpoint khusus tindak lanjut**
   - Tambahkan operasi upload/tambah/ganti file, hapus file berdasarkan slot, serta simpan/hapus link bukti dukung sumber.
   - Resolusi temuan ke worksheet/junction dilakukan di server berdasarkan finding ID dan tipe PB/CK/SPML; jangan mempercayai worksheet ID, junction ID, KPPN ID, atau tipe dari client sebagai otoritas.
   - Terapkan pemeriksaan autentikasi, kepemilikan KPPN atau kewenangan Kanwil, rentang waktu `open_follow_up`–`close_follow_up`, dan validasi bahwa temuan masih terhubung ke junction yang benar.
   - Jalankan update database dan pengelolaan file dengan penanganan error yang mencegah file lama hilang jika penyimpanan metadata gagal. Validasi MIME/ukuran tetap mengikuti konfigurasi upload worksheet.
   - Gunakan event websocket atau mekanisme refresh yang sudah ada agar user lain melihat perubahan bukti dukung.

2. **Frontend PB, CK, dan SPML**
   - Bedakan izin edit bukti dukung tindak lanjut dari flag disabled pengisian awal/approval.
   - Pada PB/CK/SPML tampilkan aksi buka, tambah, ganti, dan hapus file sesuai slot serta aksi kelola link.
   - Setelah perubahan berhasil, refresh data finding dan junction terkait agar tampilan serta badge/daftar file konsisten.
   - Tampilkan loading/error yang terlokalisasi dan konfirmasi sebelum menghapus file/link.

3. **Aturan read-only**
   - Di luar periode follow-up, temuan tidak ditemukan/tidak valid, atau user tidak berwenang, server menolak mutasi walaupun UI dimanipulasi.
   - Setelah `close_follow_up`, seluruh aksi bukti dukung tindak lanjut dinonaktifkan.
   - Jangan mengubah skor, komentar, catatan, approval, ataupun alur posting matriks sebagai bagian dari perubahan ini.

## Pengujian dan kriteria penerimaan

- KPPN pemilik worksheet dan user Kanwil yang berwenang dapat menambah/mengganti/menghapus file serta menambah/mengedit/menghapus link saat follow-up terbuka.
- User KPPN lain dan user tanpa akses ditolak oleh backend.
- File lama tetap tersimpan jika upload atau update metadata baru gagal; penghapusan hanya menghapus file yang benar.
- PB mengizinkan sampai 3 file; CK/SPML mematuhi kapasitas kolom junctionnya.
- Temuan PB maupun temuan CK/SPML mengikuti jalur yang sesuai dan tidak menulis ke `follow_up_file`.
- Setelah aksi, tampilan detail ter-refresh; setelah periode follow-up tutup, operasi ditolak.
- Typecheck backend/frontend dan test yang relevan lulus; uji manual dengan akun KPPN/Kanwil.

## Asumsi

Kewenangan edit bukti dukung diberikan kepada Kanwil dan KPPN pemilik worksheet, mengikuti akses detail temuan yang sudah berlaku. Jika bisnis menghendaki hanya KPPN yang mengelola bukti dukung selama tindak lanjut, aturan itu perlu dipersempit sebelum implementasi.
