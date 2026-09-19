# Rencana Follow-up Peraturan 2 Tanpa Modul Findings

## Tujuan

Menyederhanakan proses peraturan 2 sehingga worksheet PB, CK, dan SPML tetap menjadi sumber data dan tempat tindak lanjut. Modul matrix hanya menjadi laporan/cetakan daftar checklist yang masih menjadi temuan. `findings_data` dan workflow tindak lanjut lama tetap dipertahankan khusus untuk histori serta peraturan 1.

## Prinsip utama

1. `worksheet_junction`, `worksheet_ck_junction`, dan `worksheet_spml_junction` menjadi satu-satunya source of truth untuk nilai, dokumen, catatan, dan status N/A.
2. Temuan peraturan 2 bukan record baru. Temuan dihitung dari kondisi junction terkini.
3. Kriteria default temuan adalah `excluded != 1` dan `kanwil_score` belum mencapai nilai maksimum.
4. Untuk peraturan 2, nilai maksimum PB, CK, dan SPML adalah 10.
5. Perhitungan skor tetap dilakukan oleh scoring engine dari junction dan tidak bergantung pada matrix.
6. Peraturan 1 tetap memakai alur `matrix_data` dan `findings_data` lama agar histori tidak berubah.

## Siklus periode

Backend perlu mempunyai satu utility penentu fase yang dipakai seluruh controller dan event WebSocket:

| Fase | Kondisi | Hak edit |
| --- | --- | --- |
| `NOT_OPEN` | Sekarang sebelum `open_period` | Semua checklist read-only |
| `FILLING` | `open_period <= now <= close_period` | Semua checklist dapat diedit sesuai kewenangan KPPN/Kanwil |
| `WAITING_FOLLOW_UP` | Setelah `close_period`, sebelum `open_follow_up` | Semua checklist read-only |
| `FOLLOW_UP` | `open_follow_up <= now <= close_follow_up` | Hanya checklist yang masih menjadi temuan dapat diedit |
| `FINAL` | Setelah `close_follow_up` | Semua checklist read-only |

Perbandingan waktu harus dilakukan di backend. Frontend hanya memakai metadata fase dari server untuk menampilkan keadaan UI.

Fase follow-up tidak dibuka melalui tombol, endpoint khusus, cron job, atau perubahan status database. Fase tersebut aktif otomatis setiap kali sistem mengevaluasi waktu sekarang terhadap `open_follow_up` dan `close_follow_up` yang telah ditetapkan saat worksheet dibuat. Istilah "follow-up dibuka" dalam dokumen ini berarti waktu sekarang sudah memasuki rentang periode follow-up.

## Definisi temuan

Sediakan utility domain tunggal, misalnya:

```ts
isFollowUpTarget({ peraturan, worksheetType, kanwilScore, excluded })
```

Aturan peraturan 2 yang direkomendasikan:

```text
isFinding = excluded !== 1 && (kanwilScore === null || kanwilScore < 10)
```

`null` dianggap temuan karena berarti penilaian Kanwil belum selesai. Tidak ada validasi kelengkapan atau proses posting sebelum fase follow-up: ketika waktu otomatis memasuki rentang `open_follow_up` sampai `close_follow_up`, checklist dengan nilai Kanwil `null` langsung diperlakukan sebagai temuan dan dapat dilanjutkan pengisiannya.

Status temuan bersifat dinamis. Setelah `kanwil_score` menjadi 10, checklist bukan lagi temuan, langsung read-only, dan tidak lagi muncul pada matrix peraturan 2.

## Perubahan backend

### 1. Utility fase dan hak edit

Buat service/utility bersama, bukan logika terpisah dalam setiap controller:

- `getWorksheetPhase(worksheet, now)`
- `isFollowUpTarget(row, worksheetType, peraturan)`
- `assertWorksheetMutationAllowed(context)`

Guard harus memvalidasi:

- worksheet dan junction saling berhubungan;
- worksheet dimiliki KPPN yang boleh diakses user;
- role hanya dapat mengubah field sesuai kewenangannya;
- fase worksheet mengizinkan perubahan;
- pada fase follow-up, junction masih merupakan temuan;
- field `excluded` tidak dapat dimanipulasi untuk membuka/menghilangkan temuan secara tidak sah.

Guard diterapkan ke semua mutation PB, CK, dan SPML:

- nilai KPPN dan Kanwil;
- upload/hapus file;
- tambah/ubah/hapus link;
- catatan KPPN/Kanwil;
- komentar;
- perubahan `excluded`.

Validasi ini wajib berada di backend dan event WebSocket, bukan hanya melalui atribut `disabled` di UI.

### 2. Metadata response worksheet

Response pengambilan worksheet ditambah metadata konsisten:

```ts
{
  phase: 'NOT_OPEN' | 'FILLING' | 'WAITING_FOLLOW_UP' | 'FOLLOW_UP' | 'FINAL';
  isFollowUpPeriod: boolean;
  jumlahTemuan: number;
  rows: Array<{
    ...junction,
    isFinding: boolean;
    permissions: {
      editKPPNScore: boolean;
      editKanwilScore: boolean;
      editDocument: boolean;
      editKPPNNote: boolean;
      editKanwilNote: boolean;
      editComment: boolean;
    };
  }>;
}
```

`permissions` dihitung berdasarkan fase, status temuan, role, dan kepemilikan worksheet. Dengan ini frontend tidak perlu menggandakan aturan bisnis.

### 3. Matrix peraturan 2 sebagai read model

Buat query/service matrix baru khusus peraturan 2 yang menggabungkan temuan dari:

- `worksheet_junction` + referensi PB;
- `worksheet_ck_junction` + referensi CK;
- `worksheet_spml_junction` + referensi SPML.

Hasilnya dinormalisasi menjadi satu DTO:

```ts
type MatrixFindingRow = {
  worksheetType: 'PB' | 'CK' | 'SPML';
  worksheetId: string;
  junctionId: number;
  checklistId: number;
  nomor: string;
  kelompok: string;
  checklist: string;
  kriteria: string | null;
  buktiDukung: string | null;
  kppnScore: number | null;
  kanwilScore: number | null;
  kanwilNote: string | null;
  updatedBy: string | null;
  lastUpdate: string | null;
};
```

Endpoint yang direkomendasikan:

```text
GET /matrix/peraturan-2/:kppnId/:periodId
```

Endpoint hanya mengembalikan row dengan `isFinding = true`. Matrix peraturan 2 bersifat read-only dan tidak membutuhkan operasi create, reassign, update, atau delete.

Route matrix lama tetap dipakai peraturan 1.

### 4. Mapping isi matrix lintas worksheet

PB, CK, dan SPML mempunyai referensi berbeda. Sebelum implementasi perlu ditetapkan mapping kolom cetak:

| Kolom matrix | PB | CK | SPML |
| --- | --- | --- | --- |
| Kelompok | Komponen/Subkomponen | Komponen/Materi | Komponen/Subkomponen/Aspek |
| Checklist | Judul checklist | Kriteria penilaian | Uraian kegiatan |
| Permasalahan | Fallback opsi atau catatan Kanwil | Catatan Kanwil/kriteria | Catatan Kanwil/uraian |
| Rekomendasi | Referensi opsi | Perlu aturan/fallback baru | Perlu aturan/fallback baru |
| UIC | `checklist_ref.uic` | Belum tersedia | Belum tersedia |

Jika format cetak tetap membutuhkan `permasalahan`, `rekomendasi`, dan `UIC`, referensi CK/SPML perlu ditambah field tersebut atau disepakati fallback-nya. Jangan menyimpan salinan teks ini di matrix jika matrix dimaksudkan selalu live.

### 5. WebSocket

Setelah mutation berhasil:

- emit patch row junction yang berubah;
- sertakan `isFinding` dan `permissions` terbaru;
- emit perubahan jumlah temuan;
- jika nilai Kanwil menjadi maksimal, frontend langsung mengunci row;
- jika nilai berubah kembali menjadi belum maksimal pada fase yang masih mengizinkan, row kembali menjadi temuan.

Scoring footer dan toolbar dapat direfresh secara silent seperti mekanisme SPML/CK saat ini. Hindari refetch seluruh tabel untuk setiap event.

## Perubahan frontend

### Worksheet PB, CK, dan SPML

1. Ganti perhitungan `isPastDue` tunggal dengan metadata `phase` dan `permissions` dari backend.
2. Dalam fase `FOLLOW_UP`, tampilkan semua checklist tetapi redupkan dan disable row non-temuan.
3. Beri penanda visual pada row temuan, misalnya badge `Perlu Tindak Lanjut` atau warna aksen ringan.
4. Tambahkan filter `Semua | Temuan saja` agar user mudah fokus tanpa kehilangan konteks worksheet.
5. Toolbar menampilkan fase aktif, jumlah temuan, serta sisa periode follow-up.
6. Jika nilai Kanwil menjadi maksimal, tampilkan notifikasi bahwa tindak lanjut selesai dan row menjadi read-only.

### Halaman matrix

1. Peraturan 1 mempertahankan UI dan tombol assign/reassign/delete lama.
2. Peraturan 2 tidak menampilkan tombol assign, reassign, edit, atau delete.
3. Data matrix langsung diambil dari endpoint agregasi PB/CK/SPML.
4. Sediakan filter jenis worksheet dan export Excel/PDF.
5. Hanya checklist yang masih menjadi temuan ditampilkan dan dicetak.

### Menu follow-up lama

Untuk peraturan 2, menu follow-up lama diarahkan ke halaman worksheet atau disembunyikan dari navigasi. Route tetap dipertahankan untuk peraturan 1 dan histori lama.

## Perubahan database

Untuk model temuan dinamis, tidak wajib membuat tabel baru dan tidak perlu mengubah `findings_data`.

Yang disarankan:

1. Pertahankan `matrix_data` dan `findings_data` untuk peraturan 1/histori.
2. Jangan memasukkan data peraturan 2 ke dua tabel tersebut.
3. Tambahkan indeks bila hasil profiling membutuhkannya:
   - `worksheet_junction (worksheet_id, excluded, kanwil_score)`;
   - `worksheet_ck_junction (worksheet_id, excluded, kanwil_score)`;
   - `worksheet_spml_junction (worksheet_id, excluded, kanwil_score)`.
4. Audit perubahan tetap memakai activity log. Jika histori nilai sebelum/sesudah wajib tersedia secara formal, buat tabel audit junction generik; jangan menghidupkan kembali `findings_data` sebagai sumber nilai.

## Dampak terhadap scoring

Tidak ada perubahan formula scoring. Scoring engine tetap membaca nilai terkini dari ketiga junction. Perubahan selama follow-up otomatis memengaruhi skor PB, CK, SPML, dan AKK.

Perlu ditetapkan kapan skor dianggap final:

- skor berjalan selama pengisian dan follow-up; atau
- skor resmi dibekukan setelah `close_follow_up`.

Rekomendasi: skor tetap live sampai `close_follow_up`, kemudian seluruh mutation ditolak backend dan nilai saat itu menjadi nilai final.

## Kompatibilitas peraturan 1

Semua branching harus menggunakan `peraturan` dari worksheet/periode, bukan nilai yang dikirim bebas oleh client:

- peraturan 1: matrix dan findings lama;
- peraturan 2: worksheet follow-up dan matrix dinamis lintas jenis worksheet.

Data historis peraturan 1 tidak dimigrasikan atau dihapus.

## Tahapan implementasi

1. Buat utility fase, kriteria temuan, serta unit test boundary waktu dan nilai.
2. Terapkan authorization guard pada seluruh mutation PB/CK/SPML.
3. Tambahkan metadata fase, temuan, dan permissions ke API worksheet.
4. Update UI ketiga worksheet agar mendukung mode follow-up per row.
5. Buat service dan endpoint matrix agregat peraturan 2.
6. Buat UI/export matrix read-only lintas PB/CK/SPML.
7. Sembunyikan menu follow-up lama untuk peraturan 2.
8. Tambahkan WebSocket patch dan sinkronisasi jumlah temuan.
9. Jalankan integration test untuk transisi pengisian, follow-up, penyelesaian, dan final.
10. Uji kompatibilitas histori peraturan 1.

## Skenario pengujian minimum

1. Selama pengisian, checklist maksimal dan belum maksimal sama-sama dapat diedit sesuai role.
2. Setelah `close_period` dan sebelum `open_follow_up`, seluruh perubahan ditolak.
3. Saat follow-up, checklist nilai Kanwil 10 dan N/A ditolak jika diedit.
4. Saat follow-up, checklist nilai Kanwil `null`, 0, atau 5 dapat diedit sesuai jenis worksheet.
5. Setelah nilai Kanwil menjadi 10, row terkunci dan hilang dari matrix.
6. Setelah `close_follow_up`, seluruh perubahan ditolak walaupun nilainya belum maksimal.
7. Matrix peraturan 2 hanya berisi temuan dari PB, CK, dan SPML.
8. Scoring berubah ketika junction diperbaiki, tanpa membaca matrix/findings.
9. User KPPN tidak dapat mengubah worksheet milik KPPN lain.
10. Peraturan 1 tetap menjalankan matrix/findings lama tanpa perubahan perilaku.

## Keputusan bisnis yang telah disetujui

1. Penentuan temuan hanya menggunakan nilai Kanwil.
2. Nilai Kanwil `null` ditetapkan sebagai temuan tanpa validasi kelengkapan sebelumnya; aktivasi fase tetap murni berdasarkan jadwal.
3. Temuan yang sudah bernilai maksimal langsung hilang dari matrix live.
4. KPPN boleh mengubah nilai KPPN, dokumen, link, dan komentar saat follow-up, hanya pada row temuan.
5. Kanwil boleh mengubah nilai, catatan, dokumen, dan komentar saat follow-up, hanya pada row temuan.
6. CK menyimpan `positive_fallback`, `negative_fallback`, dan `rekomendasi` pada `opsi_ck_ref`, sedangkan `peraturan` dan `uic` pada `checklist_ck_ref`. SPML menyimpan kelima metadata tersebut pada `checklist_spml_ref` karena tidak mempunyai tabel opsi.

Format matrix PER-2 mengikuti `docs/format_matriks_peraturan2.xlsx`: No, nomor pada kertas kerja, komponen supervisi, hasil implementasi, permasalahan, rekomendasi, peraturan/ketentuan, PIC, tindak lanjut, dan status penyelesaian.
