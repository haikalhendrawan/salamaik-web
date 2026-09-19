# Rencana Format Daftar Bernomor pada Excel SPML

## Tujuan

Membuat teks daftar bernomor pada kolom `Uraian Kegiatan` Excel SPML tampil vertikal seperti pada UI. Contoh teks `1. ... 2. ... 3. ...` akan menjadi:

```text
1. ...
2. ...
3. ...
```

Perubahan berlaku pada sheet `Nilai Kanwil` dan `Nilai KPPN`.

## Analisis kode saat ini

- UI menggunakan `frontend/src/utils/formatNumberedList.tsx`.
- Utility tersebut mendeteksi daftar yang dimulai dari `1.` dan minimal mempunyai dua item.
- Hasil utility saat ini berupa elemen React `<ol>` dan `<li>`, sehingga tidak dapat langsung dimasukkan sebagai nilai cell Excel.
- Generator Excel saat ini mengisi kolom `Uraian Kegiatan` dengan teks mentah `junction.uraian`.

## Perubahan yang direncanakan

### 1. Pisahkan parsing daftar dari rendering UI

Tambahkan fungsi murni pada utility daftar bernomor yang menghasilkan struktur data:

```ts
{
  intro: string;
  items: string[];
}
```

Jika teks bukan daftar valid, parser mengembalikan `null`. Ketentuan deteksinya tetap sama dengan UI saat ini agar perilaku lama tidak berubah:

- terdapat minimal dua nomor;
- daftar dimulai dari nomor `1.`;
- kalimat biasa atau angka tunggal tidak diubah.

Komponen `formatNumberedList` yang sudah digunakan UI akan memakai parser tersebut untuk menghasilkan `<ol>` dan `<li>` seperti sebelumnya.

### 2. Tambahkan formatter teks untuk Excel

Tambahkan formatter berbasis parser yang menghasilkan string dengan line break `\n`:

- bagian pembuka, jika ada, tetap berada di baris pertama;
- setiap item ditulis sebagai `${nomor}. ${isi}`;
- teks yang bukan daftar dikembalikan apa adanya.

Dengan cara ini, aturan pendeteksian daftar hanya berada di satu tempat dan hasil UI serta Excel tetap konsisten.

### 3. Terapkan pada generator Excel SPML

Pada `useExcelWorksheetSPML.ts`:

- format `junction.uraian` sebelum dimasukkan ke kolom C;
- pertahankan `wrapText: true` yang sudah aktif;
- sesuaikan tinggi row berdasarkan jumlah line break dan estimasi panjang baris agar seluruh item lebih mudah terbaca;
- tidak mengubah kolom, merge, nilai, link, footer, atau tema workbook yang sudah ada.

## File yang diperkirakan berubah

- `frontend/src/utils/formatNumberedList.tsx`
- `frontend/src/sections/excel/useExcelWorksheetSPML.ts`

## Verifikasi

1. Teks contoh dengan lima item tampil menjadi lima baris bernomor pada Excel.
2. Format yang sama berlaku pada sheet Kanwil dan KPPN.
3. Teks biasa tanpa daftar tetap tidak berubah.
4. Teks yang hanya mengandung satu nomor tidak dianggap sebagai daftar.
5. Tampilan daftar pada UI tetap sama seperti sebelum refactor.
6. Cell uraian tetap menggunakan wrap text dan tinggi row mencukupi.
7. Build TypeScript dan ESLint terarah berhasil.

