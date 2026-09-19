# Rencana Perubahan Excel Kertas Kerja SPML

## Tujuan

Mengubah workbook export Kertas Kerja SPML pada kedua sheet (`Nilai Kanwil` dan `Nilai KPPN`) menjadi tujuh kolom, menambahkan footer skor, dan mengganti tema biru-putih menjadi abu-abu-putih.

## Struktur kolom baru

| Kolom | Header | Sumber/aturan |
|---|---|---|
| A | No | `aspek.urut`, menggunakan merge vertikal sesuai jumlah checklist dalam aspek |
| B | Aspek | `aspek.title`, menggunakan merge vertikal sesuai jumlah checklist dalam aspek |
| C | Uraian Kegiatan | `junction.uraian` |
| D | Bukti Dukung Kegiatan | `junction.dokumen`, yaitu teks bukti dukung dari referensi checklist |
| E | Link Bukti Dukung Kegiatan | URL file server dan/atau `junction.link_file` |
| F | Nilai | Nilai versi sheet: `10`, `0`, `N/A`, atau kosong jika belum diisi |
| G | Nilai Konversi | `100`, `0`, `N/A`, atau kosong jika nilai belum diisi |

Aturan nilai:

- Jika `excluded === 1`, kolom F dan G berisi `N/A`.
- Jika skor `10`, kolom F berisi angka 10 dan kolom G angka 100.
- Jika skor `0`, kolom F berisi angka 0 dan kolom G angka 0.
- Jika skor `null` dan bukan N/A, kedua kolom kosong.
- Nilai numerik disimpan sebagai angka Excel, bukan string.

## Link bukti dukung

Kolom E menggantikan kolom Dokumen lama sebagai tempat URL:

- Jika `file_1` tersedia, masukkan URL server:

  ```text
  <VITE_API_URL>/worksheet/<file_1>
  ```

- Jika `link_file` tersedia, masukkan URL eksternal yang sudah dinormalisasi.
- Jika keduanya tersedia, tampilkan pada baris terpisah dengan whitespace pemisah seperti format saat ini.
- Aktifkan text wrapping dan sesuaikan tinggi row.
- Karena satu cell Excel standar hanya mempunyai satu target hyperlink utama, hyperlink cell diarahkan ke URL pertama dan tooltip memuat seluruh URL; URL kedua tetap terlihat sebagai teks lengkap pada baris terpisah.

## Merge dan row span

- Merge vertikal kolom No tetap pada A.
- Merge vertikal kolom Aspek tetap pada B.
- Merge baris Komponen dan Subkomponen diperluas dari `A:E` menjadi `A:G`.
- Border diterapkan ke seluruh rentang A:G, termasuk cell hasil merge, checklist, link, nilai, konversi, dan footer.
- Alignment checklist:
  - A, F, G: center;
  - B, C, D, E: left;
  - seluruh kolom teks menggunakan wrap.

## Footer workbook

Tambahkan dua row setelah seluruh checklist pada masing-masing sheet agar sama dengan footer UI:

1. `Total Nilai`
2. `Nilai Kertas Kerja SPML`

Untuk setiap footer:

- merge label dari A sampai F (`A:F`);
- nilai hanya berada pada kolom G;
- label rata kanan atau kiri konsisten, dengan font bold;
- kolom G rata tengah/kanan dan menggunakan number format `0.00`;
- seluruh A:G memiliki border;
- footer akhir diberi penekanan visual lebih kuat daripada footer total.

Nilai per sheet:

### Sheet Nilai Kanwil

- `Total Nilai` = `spmlScore.detailKanwil.totalSkorKonversi`.
- `Nilai Kertas Kerja SPML` = `spmlScore.nilaiKanwil`.

### Sheet Nilai KPPN

- `Total Nilai` = `spmlScore.detailKPPN.totalSkorKonversi`.
- `Nilai Kertas Kerja SPML` = `spmlScore.nilaiKPPN`.

Jika score belum tersedia, nilai footer dikosongkan atau export ditolak dengan pesan yang jelas. Opsi yang disarankan adalah tetap mengizinkan export dan mengosongkan footer agar data checklist tetap dapat dicetak.

## Pengiriman data skor ke generator

- Perluas `ExcelWorksheetSPMLParams` dengan:

  ```ts
  spmlScore: SPMLScoreType | null
  ```

- Ambil `spmlScore` pada `WorksheetSPMLToolbar` dari context atau teruskan dari workspace sebagai prop. Disarankan menggunakan context yang sudah menjadi sumber data worksheet agar tidak menambah rantai prop baru.
- Teruskan detail skor yang sesuai ke `createScoreSheet`.
- Generator tidak menghitung ulang nilai akhir; data footer tetap berasal dari endpoint `ScoringEngine` di server.

## Tema abu-abu dan putih

Ganti warna biru dengan palet netral:

- Header: abu-abu gelap, misalnya `FF616161`, dengan teks putih.
- Baris Komponen: abu-abu muda, misalnya `FFE0E0E0`, teks gelap bold.
- Baris Subkomponen: putih atau abu-abu sangat muda, misalnya `FFF5F5F5`.
- Checklist: putih.
- Footer `Total Nilai`: abu-abu muda.
- Footer `Nilai Kertas Kerja SPML`: abu-abu gelap dengan teks putih.
- Border: abu-abu tipis konsisten, bukan biru.

Tema diterapkan sama pada kedua sheet.

## Lebar kolom yang disarankan

- A No: 8
- B Aspek: 30–35
- C Uraian Kegiatan: 55–65
- D Bukti Dukung Kegiatan: 45–55
- E Link Bukti Dukung Kegiatan: 50–60
- F Nilai: 12
- G Nilai Konversi: 16

Tinggi row disesuaikan berdasarkan konten C, D, dan E agar teks tidak terpotong tanpa membuat row berlebihan.

## File yang diperkirakan berubah

- `frontend/src/sections/excel/useExcelWorksheetSPML.ts`
- `frontend/src/sections/worksheetSPML/components/WorksheetSPMLToolbar.tsx`
- Tidak diperlukan perubahan backend karena skor footer sudah tersedia melalui state `spmlScore` dari ScoringEngine.

## Verifikasi

1. Workbook tetap memiliki dua sheet: Nilai Kanwil dan Nilai KPPN.
2. Kedua sheet mempunyai tujuh header dengan urutan yang diminta.
3. Kolom D berisi teks `dokumen`, bukan URL.
4. Kolom E berisi URL file server/link eksternal dan wrap dengan baik.
5. Nilai 10/0/N/A/kosong tampil benar pada F.
6. Konversi 100/0/N/A/kosong tampil benar pada G.
7. Merge aspek A/B tetap sesuai jumlah checklist.
8. Merge Komponen/Subkomponen mencakup A:G.
9. Dua footer muncul setelah data, merge A:F, dan nilai hanya di G.
10. Footer Kanwil menggunakan skor Kanwil; footer KPPN menggunakan skor KPPN.
11. Seluruh cell yang diperlukan memiliki border.
12. Tema tidak lagi menggunakan biru dan konsisten abu-abu-putih.
13. Teks panjang tidak terpotong dan row height masuk akal.
14. Frontend TypeScript build dan ESLint terarah berhasil.
15. Hasil `.xlsx` diuji dengan data representatif, diperiksa nilai/merge/style, dan dirender secara visual pada kedua sheet sebelum dinyatakan selesai.
