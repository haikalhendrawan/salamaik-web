# Rencana Integrasi Nilai Kertas Kerja SPML pada Frontend

## Tujuan

Menampilkan nilai akhir Kertas Kerja SPML versi KPPN dan Kanwil pada bagian paling bawah tabel. Seluruh perhitungan tetap dilakukan oleh backend melalui `ScoringEngine`; frontend hanya mengirim ID worksheet dan menampilkan response server.

## Prinsip integrasi

1. Frontend tidak mengirim kumpulan nilai checklist ke endpoint scoring.
2. Frontend hanya memanggil:

   `GET /scoringEngine/spml/:worksheetSPMLId`

3. Backend membaca nilai terbaru dari database, mengeluarkan checklist N/A, menghitung hasil, dan mengirim nilai maksimal empat angka desimal.
4. State scoring dipisahkan dari data junction agar kontrak dan loading-nya jelas.
5. Nilai di-refresh setelah penyimpanan skor berhasil, bukan secara optimistis sebelum database diperbarui.

## Perubahan tipe frontend

Tambahkan tipe pada modul SPML:

```ts
interface SPMLScoreDetail {
  jumlahChecklist: number;
  jumlahNA: number;
  jumlahChecklistPembagi: number;
}

interface SPMLScoreType {
  nilaiKPPN: number;
  nilaiKanwil: number;
  detailKPPN: SPMLScoreDetail;
  detailKanwil: SPMLScoreDetail;
}
```

Nilai awal state adalah `null` agar UI dapat membedakan “belum dimuat” dari nilai sah `0`.

## Perubahan `useWsSPMLJunction`

Tambahkan pada context:

- `spmlScore: SPMLScoreType | null`.
- `isScoreLoading: boolean`.
- `getSPMLScore(worksheetSPMLId: string): Promise<void>`.
- Opsional `refreshSPMLWorksheet(kppnId)` sebagai satu fungsi orkestrasi jika diperlukan untuk mengambil junction kemudian score secara berurutan.

Mekanisme `getSPMLScore`:

1. Abaikan pemanggilan jika `worksheetSPMLId` kosong.
2. Aktifkan `isScoreLoading` lokal, bukan global page loading.
3. Panggil endpoint ScoringEngine menggunakan `axiosJWT`.
4. Simpan `response.data.rows` ke `spmlScore`.
5. Saat gagal, tampilkan snackbar dan pertahankan nilai terakhir jika sudah ada; nilai direset hanya ketika berpindah worksheet.
6. Gunakan request guard atau ID request terakhir agar response worksheet lama tidak menimpa state setelah pengguna berpindah KPPN dengan cepat.

## Pemuatan awal

Pada `WorksheetSPMLWorkspace`:

1. Muat worksheet dan junction seperti sekarang.
2. Setelah junction berhasil didapat, gunakan `rows[0].worksheet_id` sebagai ID resmi untuk request scoring.
3. Panggil `getSPMLScore(rows[0].worksheet_id)`.
4. Jangan menghitung nilai dari `wsSPMLJunction` di frontend sebagai fallback karena itu dapat menghasilkan perbedaan aturan dengan server.

Untuk menjaga urutan yang jelas, fungsi pengambilan junction dapat mengembalikan `rows` atau `worksheetId`, kemudian workspace/context memanggil scoring. Alternatif yang disarankan adalah fungsi orkestrasi di context sehingga initial load dan refresh setelah mutasi memakai alur yang sama.

## Refresh setelah perubahan nilai

Pada `ScoreSelect`:

1. User memilih `10`, `0`, atau `N/A`.
2. Socket menyimpan perubahan ke backend.
3. Hanya jika callback socket menghasilkan `success: true`:
   - refresh junction agar select dan status N/A konsisten;
   - panggil `getSPMLScore(checklist.worksheet_id)` setelah penyimpanan selesai.
4. Jalankan refresh junction dan scoring secara paralel setelah callback sukses karena keduanya membaca data yang sudah tersimpan dan tidak saling bergantung.
5. Jangan panggil scoring bila callback gagal.

Contoh alur konseptual:

```ts
await Promise.all([
  getWsSPMLJunctionKanwil(checklist.kppn_id ?? ''),
  getSPMLScore(checklist.worksheet_id),
]);
```

## Sinkronisasi antarpengguna

Backend saat ini menyiarkan:

- `spmlKPPNScoreHasUpdated`;
- `spmlKanwilScoreHasUpdated`.

Tambahkan listener pada workspace atau hook khusus SPML:

1. Abaikan event jika `event.worksheetId` berbeda dari worksheet yang sedang dibuka.
2. Untuk event worksheet aktif, refresh junction dan scoring.
3. Debounce event sekitar 200–300 ms agar beberapa perubahan berurutan tidak menghasilkan request berlebihan.
4. Lepaskan listener dan batalkan debounce pada cleanup `useEffect` untuk mencegah listener ganda ketika berpindah halaman.
5. Pengguna yang melakukan perubahan tidak bergantung pada broadcast karena `socket.broadcast` tidak mengirim kembali kepada pengirim; pengirim tetap refresh melalui callback sukses.

## Tampilan footer tabel

Ubah `WorksheetSPMLTable` agar menerima atau membaca:

- `spmlScore`;
- `isScoreLoading`.

Tambahkan `TableFooter` setelah `TableBody`, dengan struktur tujuh kolom yang tetap sejajar dengan header:

| Posisi | Isi | Span |
|---|---|---:|
| No–Kegiatan | `Nilai Kertas Kerja SPML` | 3 |
| Nilai KPPN | `spmlScore.nilaiKPPN` | 1 |
| Nilai Kanwil | `spmlScore.nilaiKanwil` | 1 |
| Dokumen–Comment | Kosong atau keterangan detail | 2 |

Ketentuan UI:

- Gunakan warna yang konsisten dengan table head atau baris total aplikasi.
- Tampilkan skeleton/progress kecil pada dua sel nilai ketika `isScoreLoading` dan belum ada data.
- Saat refresh berjalan dan nilai lama tersedia, pertahankan nilai lama agar footer tidak berkedip; progress kecil dapat menandai pembaruan.
- Format maksimal empat desimal tanpa memaksa trailing zero. Contoh: `100`, `66.6667`, `12.5`.
- Tambahkan tooltip pada nilai KPPN dan Kanwil yang berisi:
  - jumlah checklist;
  - jumlah N/A;
  - jumlah checklist pembagi.
- Gunakan fallback `-` hanya ketika skor belum pernah berhasil dimuat; nilai `0` harus tetap ditampilkan sebagai `0`.

## Penanganan kondisi khusus

1. Junction kosong atau worksheet belum ditugaskan: footer menampilkan `-`, sedangkan error mengikuti penanganan load worksheet yang sudah ada.
2. Semua checklist N/A: tampilkan `0`, sesuai hasil server, dengan tooltip pembagi `0`.
3. Checklist belum diisi (`null`): frontend tidak memberikan perlakuan khusus; server menentukan kontribusinya sebagai 0 dan tetap memasukkannya ke pembagi.
4. Endpoint scoring gagal sementara: tampilkan snackbar dan pertahankan skor terakhir agar tabel tetap stabil.
5. Pindah KPPN: reset skor lama sebelum request worksheet baru agar nilai KPPN sebelumnya tidak sempat terlihat.

## File yang diperkirakan berubah

- `frontend/src/sections/worksheetSPML/types.ts`
- `frontend/src/sections/worksheetSPML/useWsSPMLJunction.tsx`
- `frontend/src/sections/worksheetSPML/WorksheetSPMLWorkspace.tsx`
- `frontend/src/sections/worksheetSPML/components/WorksheetSPMLTable/WorksheetSPMLTable.tsx`
- `frontend/src/sections/worksheetSPML/components/WorksheetSPMLTable/components/ScoreSelect.tsx`
- Opsional komponen baru `WorksheetSPMLScoreFooter.tsx` agar markup footer dan tooltip tidak memenuhi komponen tabel utama.

Backend tidak memerlukan perubahan rumus atau endpoint untuk integrasi ini, kecuali ditemukan kekurangan kontrak ketika pengujian end-to-end.

## Verifikasi

1. Membuka worksheet memuat nilai KPPN dan Kanwil dari endpoint server.
2. Nilai footer sejajar dengan kolom Nilai KPPN dan Nilai Kanwil.
3. Nilai `0` tampil sebagai `0`, bukan `-`.
4. Nilai desimal tidak lebih dari empat angka di belakang koma.
5. Mengubah skor KPPN memperbarui nilai footer setelah callback sukses.
6. Mengubah skor Kanwil memperbarui nilai footer setelah callback sukses.
7. Mengubah checklist menjadi/dari N/A memperbarui nilai dan detail pembagi.
8. Perubahan dari browser pengguna lain diterima melalui socket dan memperbarui footer worksheet aktif.
9. Event worksheet lain tidak memicu refresh halaman yang sedang dibuka.
10. Listener socket tidak terduplikasi setelah navigasi keluar-masuk halaman.
11. Kegagalan request tidak mengubah nilai terakhir menjadi 0 secara keliru.
12. Frontend TypeScript build dan ESLint terarah berhasil.
