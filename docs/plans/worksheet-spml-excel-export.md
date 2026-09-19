# Rencana Export Excel Worksheet SPML

## Tujuan

Mengaktifkan tombol Excel pada toolbar Worksheet SPML untuk menghasilkan satu file `.xlsx` dengan dua sheet:

1. `Nilai Kanwil`
2. `Nilai KPPN`

Kedua sheet memiliki struktur tabel yang sama, tetapi menggunakan sumber score sesuai nama sheet.

## Struktur Kolom

Setiap sheet memiliki lima kolom:

| Kolom | Isi |
| --- | --- |
| No | Nomor urut aspek SPML |
| Aspek | Judul aspek SPML |
| Kegiatan | Uraian checklist/kegiatan |
| Nilai | Score Kanwil atau KPPN sesuai sheet |
| Dokumen | URL file server dan/atau link eksternal |

## Representasi Nilai

- `excluded === 1` ditulis sebagai `N/A`.
- Score `0` ditulis sebagai angka `0`, bukan sel kosong.
- Score `10` ditulis sebagai angka `10`.
- Score `null` ditulis sebagai sel kosong.

## Kolom Dokumen

- Jika `file_1` tersedia, dibuat URL absolut menuju file server:
  - `${VITE_API_URL}/worksheet/<nama-file>`.
- Jika `link_file` tersedia, link tersebut dimasukkan dan ditambahkan protokol `https://` apabila belum memiliki `http://` atau `https://`.
- Jika hanya satu sumber tersedia, sel menggunakan hyperlink Excel yang dapat diklik.
- Jika file server dan link eksternal sama-sama tersedia, kedua URL dimasukkan dalam satu sel pada baris terpisah dan diberi `wrapText` agar keduanya terlihat. ExcelJS hanya menyediakan satu target hyperlink per sel, sehingga pada kondisi dua URL nilai sel akan menyimpan kedua URL lengkap agar tetap dapat disalin/dibuka dari Excel.
- Jika keduanya tidak tersedia, sel dikosongkan.

## Layout Seperti UI

Untuk masing-masing sheet:

- Header kolom menggunakan fill warna primary/dark blue, teks putih, bold, centered, dan border.
- Setiap row Komponen SPML dibuat sebagai baris judul dan di-merge horizontal `A:E` (`colspan`).
- Setiap row Subkomponen SPML dibuat sebagai baris judul dan di-merge horizontal `A:E` (`colspan`).
- Checklist dikelompokkan berdasarkan aspek.
- Untuk aspek dengan beberapa checklist:
  - sel No di-merge vertikal sepanjang jumlah checklist aspek tersebut;
  - sel Aspek di-merge vertikal sepanjang jumlah checklist aspek tersebut (`rowspan`).
- Kolom Kegiatan dan Dokumen menggunakan wrap text.
- Border diterapkan pada seluruh area tabel, alignment disesuaikan per kolom, dan lebar kolom dibuat proporsional.
- Header dibekukan dengan `views.frozen` agar tetap terlihat saat scroll.

## Perubahan Kode

### Generator baru

Membuat generator khusus SPML, misalnya:

`frontend/src/sections/excel/useExcelWorksheetSPML.tsx`

Generator akan:

- menerima `wsSPMLJunction` dan referensi Komponen/Subkomponen/Aspek SPML;
- membangun dua sheet melalui satu fungsi reusable;
- melakukan merge cell dan styling;
- membuat Blob dan mengunduh file dengan nama seperti `Worksheet_SPML_<KPPN>_<timestamp>.xlsx`;
- membersihkan object URL setelah download.

### `WorksheetSPMLToolbar.tsx`

- Mengganti handler placeholder tombol Excel dengan generator sebenarnya.
- Mengambil referensi SPML dari `useDictionary`.
- Menampilkan global loading selama workbook dibuat.
- Menampilkan snackbar sukses/gagal.
- Menonaktifkan export hanya ketika data junction belum tersedia.

### `WorksheetSPMLWorkspace.tsx`

- Mengirim nama/kode KPPN ke toolbar untuk nama file export apabila diperlukan.

## Backend

Tidak diperlukan endpoint baru karena seluruh data junction dan referensi yang diperlukan sudah tersedia di frontend. URL dokumen server dibangun dari `VITE_API_URL`.

## Verifikasi

- Lint generator Excel, toolbar, dan workspace.
- Build frontend.
- Verifikasi workbook:
  1. tepat dua sheet dengan nama yang diharapkan;
  2. masing-masing sheet hanya memiliki lima kolom;
  3. score `0`, `10`, `null`, dan `N/A` ditampilkan benar;
  4. URL server dan link eksternal muncul sesuai data;
  5. kedua URL tetap muncul ketika file dan link tersedia bersamaan;
  6. merge horizontal Komponen/Subkomponen dan merge vertikal No/Aspek valid;
  7. file dapat dibuka Excel tanpa peringatan corrupt.

## Batas Perubahan

- Tidak mengubah database atau backend.
- Tidak mengubah tampilan tabel SPML.
- Tidak mengimplementasikan rencana progress `excluded` pada pekerjaan ini kecuali disetujui secara terpisah.
- Implementasi dimulai setelah rencana ini disetujui.
