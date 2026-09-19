# Rencana Perubahan Label Hyperlink Excel SPML

## Tujuan

Mengganti teks URL yang terlihat pada kolom `Link Bukti Dukung Kegiatan` menjadi label yang mudah dikenali, tanpa mengubah URL tujuan hyperlink.

Contoh:

```text
SPML01_KPPN_Bukittinggi
```

## Format Label

```text
SPML{nomorChecklist}_KPPN_{namaKPPN}
```

Ketentuan:

- Nomor checklist mengikuti urutan row checklist pada hasil export, dimulai dari 1 pada masing-masing sheet.
- Nomor menggunakan minimal dua digit: `01`, `02`, ..., `10`.
- Spasi pada nama KPPN diubah menjadi underscore.
- Karakter yang tidak aman untuk label dibersihkan.
- Jika nama yang diterima adalah `Bukittinggi`, hasilnya `SPML01_KPPN_Bukittinggi`.
- Kedua sheet menggunakan nomor dan label yang sama untuk checklist yang sama.

## Perubahan Kode

1. Meneruskan `kppnName` dari `useExcelWorksheetSPML` ke `createScoreSheet`, `addChecklistRow`, dan `setLinkEvidenceCell`.
2. Menambahkan counter checklist lokal pada setiap sheet agar label mengikuti urutan row hasil export, bukan ID database yang mungkin memiliki jeda.
3. Menambahkan helper untuk:
   - padding nomor menjadi dua digit;
   - menormalisasi nama KPPN menjadi format underscore;
   - membentuk label hyperlink.
4. Mengganti hanya properti `text` pada hyperlink Excel.
5. Mempertahankan properti `hyperlink` sebagai URL file server atau link eksternal yang sudah ada.
6. Mempertahankan URL lengkap pada `tooltip` agar tujuan link masih dapat diperiksa pengguna.

## Kondisi Beberapa Link

Satu junction dapat memiliki file server dan link eksternal sekaligus. Karena implementasi ExcelJS saat ini hanya memberi satu hyperlink aktif untuk satu cell, perilaku yang sudah ada akan dipertahankan:

- hyperlink aktif mengarah ke URL pertama, yaitu file server;
- seluruh URL tetap tersedia pada tooltip;
- teks dibuat menjadi dua baris dengan pembeda:
  - `SPML01_KPPN_Bukittinggi_File_Server`
  - `SPML01_KPPN_Bukittinggi_Link_Eksternal`

Apabila hanya terdapat satu URL, label tetap menggunakan format utama tanpa suffix.

## Verifikasi

- Memastikan cell satu URL menampilkan label dan tetap dapat diklik.
- Memastikan hyperlink file server tetap menuju endpoint file yang benar.
- Memastikan hyperlink eksternal tetap menuju URL eksternal apabila tidak ada file server.
- Memastikan label pada sheet Kanwil dan KPPN konsisten.
- Menjalankan ESLint dan production build frontend.
