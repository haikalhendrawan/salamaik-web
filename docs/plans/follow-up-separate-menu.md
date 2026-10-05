# Rencana: Tindak Lanjut Peraturan 2 pada Menu Terpisah

## Tujuan

Memindahkan pengisian tindak lanjut Peraturan 2 dari halaman kertas kerja ke menu **Tindak Lanjut** tersendiri, dengan mekanisme yang sama seperti alur Peraturan 1: temuan direkam pada tabel `findings`, sedangkan nilai awal worksheet tetap dipertahankan.

## Asumsi Desain

- Perubahan ini ditujukan untuk Peraturan 2. Alur Peraturan 1 yang sudah memakai modul Findings/Follow Up lama tetap kompatibel dan tidak diubah.
- Gunakan tabel `findings` yang sudah ada, bukan membuat tabel findings baru. Perluas relasi dan datanya agar dapat merepresentasikan sumber PB, CK, maupun SPML.
- Nilai pada junction adalah nilai awal/hasil pengisian kertas kerja dan tidak ditimpa saat tindak lanjut. Nilai/status tindak lanjut disimpan terpisah pada temuan.
- Fase tindak lanjut tetap mengikuti `open_follow_up` dan `close_follow_up` pada worksheet; tidak ada tombol khusus untuk membuka fase.
- Checklist yang dapat ditindaklanjuti adalah checklist yang tidak excluded dan nilai Kanwil belum mencapai nilai maksimum checklist tersebut.

## Alur yang Diusulkan

1. Saat periode worksheet aktif, KPPN dan Kanwil mengisi PB, CK, dan SPML seperti sekarang.
2. Setelah `close_period`, pengisian awal terkunci.
3. Admin Kanwil melakukan posting matriks secara manual, mengikuti pemicu dan prasyarat proses posting Peraturan 1. Posting membentuk/sinkronkan temuan dari PB, CK, dan SPML ke `findings`, dengan referensi junction asal serta snapshot nilai awal.
4. Posting tidak membuka fase tindak lanjut. Hak edit tetap ditentukan otomatis oleh rentang `open_follow_up` hingga `close_follow_up`.
5. Ketika tanggal mencapai `open_follow_up`, menu Tindak Lanjut menampilkan daftar temuan Peraturan 2 yang sudah diposting.
6. User memilih KPPN dan jenis kertas kerja, lalu memperbarui field tindak lanjut pada record `findings` saja. Nilai awal pada worksheet junction tidak berubah.
7. Perubahan findings disiarkan melalui mekanisme live update yang sudah ada atau event tindak lanjut yang setara.
8. Di luar fase tindak lanjut, menu tetap dapat menampilkan hasil secara read-only atau memberi keterangan fase; aksi perubahan terkunci setelah `close_follow_up`.
9. Matriks tetap menjadi keluaran/cetak daftar temuan. Matriks dan findings tidak menggantikan worksheet sebagai sumber nilai pengisian awal.

Posting tidak dijalankan otomatis ketika tanggal close period tercapai. Sinkronisasi ulang harus idempotent dan tidak boleh menghapus progres tindak lanjut yang sudah tersimpan pada findings.

## Cakupan Perubahan

### Frontend

- Tambahkan menu/route Tindak Lanjut untuk Peraturan 2, mengikuti visibilitas user KPPN dan Kanwil.
- Buat halaman landing dengan pemilihan periode/KPPN dan indikator fase tindak lanjut.
- Buat tampilan temuan gabungan dengan filter jenis kertas kerja PB, CK, dan SPML; tampilkan hanya baris eligible.
- Gunakan komponen editor yang sama atau direuse dari worksheet agar aturan nilai, upload/link file, catatan Kanwil, komentar, dan status loading konsisten.
- Sembunyikan atau nonaktifkan aksi pengisian tindak lanjut di halaman worksheet selama fase follow-up agar tidak ada dua pintu edit.
- Tampilkan empty state bila tidak ada checklist yang perlu ditindaklanjuti.

### Backend dan Skema Findings

- Audit skema, endpoint, permission, dan proses posting `findings` Peraturan 1; pertahankan perilaku lama agar kompatibel.
- Tambahkan relasi sumber temuan untuk worksheet CK dan SPML selain relasi worksheet PB yang sudah dipakai. Pilih skema FK yang menjaga integritas referensial (misalnya kolom FK nullable per jenis worksheet dengan aturan tepat satu sumber per temuan).
- Simpan snapshot nilai awal KPPN/Kanwil, excluded, dan identitas sumber/junction pada saat temuan dibuat. Simpan nilai/status tindak lanjut terpisah pada record `findings`, bukan dengan menimpa junction.
- Buat proses posting/sinkronisasi temuan PB/CK/SPML yang idempotent: satu sumber junction hanya menghasilkan satu temuan aktif untuk proses/periode terkait, dan perubahan posting tidak membuat duplikat.
- Terapkan filter kelayakan di server: Peraturan 2, worksheet/periode terkait, `excluded <> 1`, dan nilai Kanwil null/di bawah maksimum.
- Maksimum skor dihitung sesuai jenis kertas kerja: PB mengikuti opsi tertinggi checklist (standardisasi mengikuti aturan PB yang berlaku), CK mengikuti opsi checklist, dan SPML mengikuti maksimum SPML yang berlaku.
- Tambahkan endpoint baca findings berdasarkan periode/KPPN/jenis worksheet dan endpoint update tindak lanjut pada findings. Update harus memvalidasi fase tanggal serta role di server; setelah `close_follow_up`, backend menolak mutasi.
- Jangan memakai endpoint mutasi junction untuk perubahan tindak lanjut; junction menyimpan penilaian awal. Gunakan websocket/event untuk sinkronisasi perubahan findings.

### Data dan Histori

- Migrasi database diperlukan untuk menghubungkan findings ke sumber CK/SPML dan menyimpan snapshot nilai awal secara eksplisit jika kolom yang ada belum mencukupi.
- Nilai sebelum tindak lanjut tetap dapat dibaca dari snapshot temuan dan junction; nilai/perkembangan tindak lanjut tersimpan pada findings. Dengan demikian perubahan dari 0 menjadi 10 tidak menghapus nilai awal 0.
- Catat perubahan tindak lanjut melalui activity log/audit yang tersedia, termasuk nilai sebelum/sesudah, pengguna, dan waktu. Pastikan log mencatat payload perubahan, bukan hanya nama aksi.
- Data historis yang sudah telanjur ditimpa sebelum mekanisme ini diaktifkan hanya bisa dipulihkan dari audit log lama atau backup.

## Tahapan Implementasi

1. Audit endpoint dan permission existing untuk memastikan batas worksheet/follow-up ditegakkan di backend.
2. Implementasi migrasi skema findings beserta strategi kompatibilitas Peraturan 1.
3. Implementasi posting/sinkronisasi findings PB/CK/SPML yang idempotent dan unit test kriteria temuan.
4. Implementasi endpoint query/update tindak lanjut dan validasi role/fase di backend.
5. Implementasi route, nav, landing, filter PB/CK/SPML, dan akses berdasarkan role.
6. Hubungkan mutasi findings, dokumen, catatan, komentar, websocket, dan refresh skor/progress.
7. Hilangkan jalur edit tindak lanjut dari worksheet agar halaman worksheet hanya untuk pengisian awal, tanpa mengganggu pembacaan.
8. Verifikasi matriks dan export tetap membaca temuan Peraturan 2 dari sumber yang benar.

## Skenario Uji

- Peraturan 1 tetap memakai alur lama.
- Peraturan 2 sebelum `open_follow_up`: tidak bisa melakukan tindak lanjut.
- Dalam fase follow-up: hanya checklist belum maksimal dan tidak excluded yang tampil/editable.
- Checklist dengan nilai maksimal atau N/A tidak muncul sebagai temuan.
- PB dengan skor maksimum 15 dan checklist standardisasi dihitung memakai maksimum masing-masing, bukan ambang tetap 10.
- CK dengan maksimum opsi berbeda dihitung sesuai opsi checklist; SPML memakai maksimum yang ditetapkan untuk SPML.
- KPPN hanya dapat mengubah field yang menjadi kewenangannya; Kanwil tetap mengelola penilaian/catatan sesuai aturan.
- Setelah `close_follow_up`: menu menjadi read-only dan backend menolak semua mutasi.
- Perubahan dari user lain muncul live tanpa reload overlay global.
- Matriks hanya mencetak temuan, mencakup PB/CK/SPML, dan tidak menggandakan skor.
- Setelah temuan dibuat, nilai awal 0 tetap terlihat walaupun nilai tindak lanjut berubah menjadi 10.
- Posting/sinkronisasi berulang tidak menggandakan record findings.

## Keputusan UX dan Kewenangan

Seluruh keputusan mengikuti kondisi awal menu Tindak Lanjut yang sudah ada. Menu baru bukan alur bisnis baru; ia mengembalikan pengalaman pengguna lama dengan cakupan data Peraturan 2 yang diperluas ke PB, CK, dan SPML, dan tetap memakai findings sebagai wadah temuan serta progres tindak lanjut.

- Pemilihan periode/KPPN dan cakupan data mengikuti pola menu Tindak Lanjut lama; data tidak otomatis mencampur periode.
- Hak edit tiap field, termasuk nilai KPPN/Kanwil, dokumen, catatan, komentar, serta validasi role mengikuti kewenangan yang sudah diterapkan pada menu lama.
- Perilaku sebelum fase tindak lanjut, selama fase terbuka, dan setelah fase ditutup mengikuti aturan menu lama dan tanggal periode worksheet. Tampilan di luar masa edit bersifat read-only sebagaimana menu lama.
- Saat implementasi, komponen/perilaku lama perlu diaudit langsung dan direuse sejauh bisa agar aturan akses tidak diduplikasi dengan interpretasi baru.
