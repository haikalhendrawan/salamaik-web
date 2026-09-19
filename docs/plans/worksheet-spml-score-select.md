# Rencana Implementasi ScoreSelect Worksheet SPML

## Tujuan

Mengaktifkan pengisian nilai KPPN dan Kanwil pada `WorksheetSPMLTable` dengan sumber state dari `wsSPMLJunction`, termasuk dukungan pilihan `N/A` melalui kolom `excluded`.

## Perilaku yang akan diterapkan

1. Nilai awal `ScoreSelect` bersifat controlled dan mengikuti data database:
   - `excluded === 1` ditampilkan sebagai `N/A`.
   - Jika tidak excluded, `kppn_score` atau `kanwil_score` ditampilkan sesuai jenis select.
   - Nilai `null` ditampilkan sebagai pilihan kosong.
2. Saat user memilih `N/A`:
   - score milik select yang diedit disimpan sebagai `10`;
   - `excluded` disimpan sebagai `1`.
3. Saat user memilih `10` atau `0`:
   - score milik select yang diedit disimpan sesuai pilihan;
   - `excluded` disimpan sebagai `0`.
4. Setelah backend berhasil menyimpan, data `wsSPMLJunction` di frontend diperbarui/refetch agar kedua select langsung mencerminkan nilai database dan status `excluded` terbaru.
5. Hak edit tetap mengikuti perilaku tabel saat ini: KPPN hanya mengedit nilai KPPN, Kanwil hanya mengedit nilai Kanwil.

## Perubahan frontend

### `ScoreSelect.tsx`

- Mengubah prop `checklist` agar menggunakan tipe junction SPML yang memuat `junction_id`, `worksheet_id`, score, `excluded`, dan `kppn_id`.
- Mengganti `defaultValue` dengan `value` yang diturunkan dari data junction.
- Menambahkan handler perubahan nilai dan integrasi websocket:
  - event KPPN untuk `kppnScore` + `excluded`;
  - event Kanwil untuk `kanwilScore` + `excluded`.
- Menangani status koneksi, loading, callback gagal, dan snackbar.
- Melakukan refetch junction setelah callback sukses agar state mengikuti hasil database.

### `useWsSPMLJunction.tsx`

- Memakai fungsi fetch yang sudah ada setelah penyimpanan nilai.
- Bila diperlukan untuk update real-time, menambahkan sinkronisasi event broadcast ke state junction tanpa mengubah kontrak data utama.

## Perubahan backend

### `wsSPMLJunctionEvent.ts`

- Memperluas payload event skor dengan `excluded` bernilai `0 | 1`.
- Memvalidasi bahwa score hanya `0` atau `10`, dan `excluded` hanya `0` atau `1`.
- Menyimpan score dan `excluded` melalui satu pemanggilan model.
- Menyertakan `excluded` dalam broadcast hasil perubahan.

### `wsSPMLJunction.model.ts`

- Mengubah operasi update score KPPN/Kanwil agar turut meng-update `excluded` dalam query yang sama (atomik), termasuk `last_update` dan `updated_by`.
- Tetap membatasi update berdasarkan pasangan `junction_id` dan `worksheet_id`.

## Catatan perilaku data

Kolom `excluded` berlaku pada satu junction, bukan terpisah per penilai. Karena itu, memilih `N/A` pada salah satu select akan membuat kedua select menampilkan `N/A`. Memilih `0` atau `10` setelahnya akan mengembalikan `excluded` ke `0`; score pihak lain tidak diubah oleh operasi tersebut.

## Verifikasi

- Jalankan type-check/build frontend dan backend sesuai script proyek.
- Uji kasus berikut untuk user KPPN dan Kanwil:
  1. Data score `null`, `excluded = 0` menampilkan kosong.
  2. Data score `0`, `excluded = 0` menampilkan `0`.
  3. Data score `10`, `excluded = 0` menampilkan `10`.
  4. Data `excluded = 1` menampilkan `N/A` meskipun score tersimpan `10`.
  5. Memilih `N/A` menyimpan score `10` dan `excluded = 1`.
  6. Mengganti `N/A` ke `0` atau `10` menyimpan score pilihan dan `excluded = 0`.
  7. Kegagalan websocket/backend menampilkan pesan error dan tidak meninggalkan tampilan seolah-olah sudah tersimpan.

## Batas perubahan

- Tidak mengubah struktur tabel database atau membuat migration karena kolom `excluded` telah tersedia.
- Tidak mengubah perhitungan nilai modul lain pada tahap ini.
- Implementasi kode aplikasi dimulai setelah rencana ini disetujui.
