# Rencana Halaman Nilai Pembinaan

## Tujuan

Menambahkan halaman baru bernama **Nilai Pembinaan** untuk menampilkan hasil scoring secara ringkas dan mudah dibandingkan tanpa memakai tabel konvensional.

- User Kanwil melihat nilai seluruh KPPN pada periode aktif.
- User KPPN hanya melihat nilai unitnya sendiri.
- Formula dan skala otomatis mengikuti `auth.peraturan`.

## Arah Desain

Halaman menggunakan tiga lapisan informasi:

1. Header konteks: judul, periode aktif, dan peraturan aktif.
2. Ringkasan nilai: rata-rata Kanwil/AKK unit dan komposisi formula.
3. Daftar KPPN berbentuk compact score rows, bukan tabel dan bukan kumpulan card besar.

Setiap score row memuat:

- nama KPPN dan klasifikasi `tipe`/`provinsi`;
- breakdown PB, CK, dan SPML dalam progress bar tipis;
- nilai self assessment sebagai informasi sekunder;
- nilai Kanwil sebagai angka utama.

Pada peraturan 1, hanya breakdown PB yang ditampilkan dan skala berubah menjadi 0–10. Pada peraturan 2, ketiga breakdown ditampilkan pada skala 0–100.

## Perilaku Berdasarkan Role

### Kanwil (`99`, `4`, `3`)

- Memanggil endpoint rata-rata AKK periode aktif.
- Menampilkan rata-rata seluruh KPPN pada bagian ringkasan.
- Menampilkan seluruh KPPN sebagai daftar vertikal.
- Nilai Kanwil menjadi angka utama; self assessment tetap terlihat untuk perbandingan.

### KPPN (`2`, `1`)

- Memanggil endpoint AKK per KPPN menggunakan unit pada payload login.
- Ringkasan berubah menjadi “Nilai Kinerja Anda”.
- Hanya satu score row milik KPPN tersebut yang ditampilkan.
- Tidak ada data unit lain yang diminta atau disimpan di frontend.

## Integrasi API

Kanwil:

```http
GET /scoringEngine/akk/average/:periodId/:peraturanId
```

KPPN:

```http
GET /scoringEngine/akk/:kppnId/:periodId/:peraturanId
```

Untuk menampilkan breakdown PB/CK/SPML per unit secara efisien, response endpoint average perlu diperluas agar `detailKPPN` setiap unit ikut membawa nilai sumber PB, CK, dan SPML. Endpoint AKK satu KPPN sebenarnya sudah memiliki detail komponen ini. Alternatifnya adalah frontend memanggil tiga endpoint worksheet lagi, tetapi itu menambah round-trip dan tidak direkomendasikan.

## Struktur Frontend

Direktori yang disarankan:

```text
frontend/src/sections/nilaiPembinaan/
├── NilaiPembinaan.tsx
├── types.ts
├── useNilaiPembinaan.ts
└── components/
    ├── NilaiPembinaanHeader.tsx
    ├── ScoreSummary.tsx
    ├── ScoreComposition.tsx
    ├── KPPNScoreList.tsx
    ├── KPPNScoreRow.tsx
    └── NilaiPembinaanSkeleton.tsx
```

Komponen dipisah agar perubahan satu nilai tidak menyebabkan seluruh halaman dirender ulang. `KPPNScoreRow` dibungkus `memo`, data turunan dihitung dengan `useMemo`, dan callback yang diteruskan ke row dibuat stabil bila nanti ada interaksi tambahan.

## Navigasi dan Routing

Perubahan:

- Tambahkan item **Nilai Pembinaan** di `navSupervisi`, setelah menu Kertas Kerja.
- Gunakan ikon grafik yang sekeluarga dengan ikon Solar aplikasi.
- Tambahkan route `/nilai-pembinaan` di `frontend/src/routes.tsx`.
- Route dapat diakses role `[1, 2, 3, 4, 99]`.
- Buat page wrapper tipis di `frontend/src/pages/NilaiPembinaanPage.tsx` bila mengikuti pola page/section yang ada.

## State dan Loading

- Ambil `period`, `peraturan`, `role`, dan `kppn` dari `useAuth()`.
- Ambil label periode/peraturan dari `useDictionary()`.
- Gunakan loading skeleton lokal pada halaman, bukan overlay global, agar navigasi aplikasi tetap responsif.
- Sediakan empty state jika worksheet periode belum tersedia.
- Error 409 dari metadata tipe/bobot ditampilkan sebagai pesan konfigurasi yang jelas.
- Sediakan tombol retry kecil hanya pada error fetch.

## Responsive Layout

- Desktop: sidebar aplikasi tetap, ringkasan dan komposisi formula berdampingan.
- Tablet: ringkasan tetap dua panel selama ruang cukup; score row mempertahankan nilai di kanan.
- Mobile: panel ringkasan bertumpuk, breakdown berpindah ke baris kedua, dan nilai self assessment dapat diletakkan di bawah nilai utama agar tidak terjadi horizontal scroll.

## Aksesibilitas

- Nilai tidak dibedakan hanya berdasarkan warna; semua progress memiliki label angka.
- Urutan pembacaan: unit, klasifikasi, breakdown, self assessment, nilai Kanwil.
- Skeleton menggunakan `aria-busy`; error menggunakan role alert.
- Kontras mengikuti warna theme MUI dan mendukung dark mode aplikasi.

## Perubahan Backend Pendukung

File `backend/src/model/scoringEngine.model.ts` perlu menyimpan breakdown AKK per unit pada hasil batch, misalnya:

```ts
{
  nilaiKPPN,
  nilaiKanwil,
  nilaiPBKPPN,
  nilaiPBKanwil,
  nilaiCKKPPN,
  nilaiCKKanwil,
  nilaiSPMLKPPN,
  nilaiSPMLKanwil
}
```

Untuk peraturan 1, nilai CK dan SPML berupa `null`. Ini menghindari request tambahan per KPPN dan menjaga halaman Kanwil tetap cepat.

## Pengujian

1. Kanwil menerima dan melihat seluruh unit.
2. KPPN hanya meminta serta melihat unit sendiri.
3. Peraturan 1 menampilkan PB dan skala 0–10.
4. Peraturan 2 menampilkan PB/CK/SPML dan skala 0–100.
5. Loading, empty, error 404, error 409, dan retry tampil tanpa overlay global.
6. Layout tidak horizontal-scroll pada desktop maupun mobile.
7. Build dan lint frontend berhasil.
8. Test backend memastikan breakdown batch sama dengan endpoint AKK per unit.

## File yang Diperkirakan Berubah

- `frontend/src/layouts/dashboard/nav/config.tsx`
- `frontend/src/routes.tsx`
- `frontend/src/pages/NilaiPembinaanPage.tsx`
- file baru di `frontend/src/sections/nilaiPembinaan/`
- `backend/src/model/scoringEngine.model.ts`
- `backend/__test__/model/scoringEngine.model.test.ts`

Tidak diperlukan migrasi database tambahan.
