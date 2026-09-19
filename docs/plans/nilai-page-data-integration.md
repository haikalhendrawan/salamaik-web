# Rencana Integrasi Data Halaman Nilai

## Tujuan

Menghubungkan halaman `Nilai` dengan Scoring Engine agar seluruh angka pada Card, tabel, dan export Excel berasal dari hasil perhitungan server. Halaman tetap menampilkan satu KPPN pada satu waktu:

- user Kanwil dapat berpindah KPPN melalui `SelectionTab`;
- user KPPN hanya dapat mengambil dan melihat unitnya sendiri;
- formula mengikuti `period` dan `peraturan` aktif pada sesi user;
- perubahan skor PB, SPML, atau CK dapat memperbarui halaman tanpa reload penuh.

## Temuan Kondisi Saat Ini

Endpoint berikut sudah tersedia dan secara prinsip sudah mencukupi kebutuhan angka halaman:

```http
GET /scoringEngine/akk/:kppnId/:periodId/:peraturanId
```

Response saat ini sudah memuat:

- `nilaiKPPN` dan `nilaiKanwil` sebagai nilai AKK;
- detail PB, CK, dan SPML untuk masing-masing versi;
- setiap detail berisi `nilai`, `bobot`, dan `kontribusi`;
- `worksheetId`, `kppnId`, `periodId`, dan `peraturan`.

Dengan demikian, frontend tidak perlu memanggil endpoint PB, CK, dan SPML secara terpisah. Endpoint rata-rata AKK juga belum diperlukan karena desain halaman saat ini hanya menampilkan satu KPPN.

Hal yang masih perlu diperbaiki:

1. `NilaiSection` masih menggunakan skor dan periode hard-coded.
2. `TabelPenilaian` masih menggunakan data mock dan menghitung kontribusi di browser.
3. Export Excel juga masih menghitung ulang nilai menggunakan konstanta bobot frontend.
4. Response AKK belum membawa nama KPPN dan label periode, sehingga frontend bergantung pada dictionary yang selesai dimuat.
5. Pemeriksaan akses pada controller masih menganggap kode unit sepanjang lima karakter sebagai Kanwil, bukan memeriksa role secara eksplisit.
6. Belum ada event WebSocket khusus yang menandakan bahwa nilai AKK perlu dihitung ulang.
7. Route `/nilai` masih mengizinkan role `0`, sedangkan endpoint scoring tidak mengizinkannya.

## Kontrak Data yang Digunakan Frontend

Response endpoint AKK akan dipertahankan kompatibel dan ditambah metadata secara additive:

```ts
type AKKScoreResponse = {
  worksheetId: string;
  kppnId: string;
  kppnName: string;
  kppnAlias: string;
  periodId: number;
  periodName: string;
  peraturan: 1 | 2;
  nilaiKPPN: number;
  nilaiKanwil: number;
  detailKPPN: AKKSideDetail;
  detailKanwil: AKKSideDetail;
};

type AKKSideDetail = {
  pb: AKKComponentDetail;
  spml: AKKComponentDetail | null;
  ck: AKKComponentDetail | null;
};

type AKKComponentDetail = {
  nilai: number;
  bobot: number;
  kontribusi: number;
};
```

`nilai`, `bobot`, `kontribusi`, dan nilai AKK yang dikirim server menjadi sumber kebenaran. Frontend hanya melakukan format tampilan dua desimal.

## Perubahan Backend

### 1. Lengkapi metadata endpoint AKK

Pada query awal `calculateAKKScore`, join `worksheet_ref` dengan `kppn_ref` dan `period_ref` untuk memperoleh nama/alias KPPN serta nama periode. Tambahkan metadata tersebut pada hasil controller tanpa mengubah properti lama.

Manfaatnya:

- judul halaman tidak lagi hard-coded;
- pergantian tab tidak menunggu `useDictionary` untuk menampilkan identitas data;
- file Excel selalu memakai nama KPPN dan periode yang sama dengan hasil perhitungan server.

### 2. Perketat otorisasi

Ubah helper akses menjadi berbasis role:

```ts
const canAccessWorksheet = (
  role: number,
  requesterKppn: string,
  worksheetKppn: string
) => KANWIL_ROLES.includes(role) || requesterKppn === worksheetKppn;
```

Role Kanwil adalah `3`, `4`, dan `99`. Role KPPN `1` dan `2` hanya boleh meminta `kppnId` yang sama dengan token. Parameter `periodId` dan `peraturanId` tetap divalidasi sebagai integer positif dan `1 | 2`.

### 3. Optimalkan query scoring per KPPN

Untuk peraturan `2`, setelah `worksheetId` ditemukan, perhitungan PB, CK, dan SPML dapat dijalankan paralel dengan `Promise.all`. Untuk peraturan `1`, hanya query PB yang dijalankan.

Tidak diperlukan migrasi tabel untuk kebenaran fungsi. Index berikut perlu dicek dengan `EXPLAIN`; migrasi index baru hanya dibuat bila belum tersedia:

- `worksheet_ref (kppn_id, period)`;
- `worksheet_junction (worksheet_id)`;
- `worksheet_spml_junction (worksheet_id)`;
- `worksheet_ck_junction (worksheet_id)`.

### 4. Event perubahan AKK

Tambahkan kanal WebSocket khusus worksheet, misalnya room `akk:<worksheetId>`:

- client mengirim `joinAKKWorksheet` setelah REST endpoint mengembalikan `worksheetId`;
- backend memvalidasi worksheet dan akses user sebelum menerima join;
- setiap update skor atau perubahan `excluded` pada PB, SPML, dan CK mengirim `akkScoreChanged` setelah transaksi berhasil;
- payload cukup berisi `worksheetId`, `source: 'pb' | 'spml' | 'ck'`, dan waktu perubahan, tanpa membocorkan nilai unit lain;
- sediakan `leaveAKKWorksheet` saat tab berubah atau komponen unmount.

File event baru didaftarkan melalui `backend/src/events/index.ts`. Upload file, link, catatan, dan komentar tidak perlu memicu event ini karena tidak mengubah skor.

## Perubahan Frontend

### 1. Types dan data hook

Buat:

```text
frontend/src/sections/nilai/
├── types.ts
├── useNilaiAKK.ts
└── useNilaiAKKLiveSync.ts
```

`useNilaiAKK` menangani:

- request endpoint berdasarkan `selectedKppnId`, `auth.period`, dan `auth.peraturan`;
- state `data`, `isLoading`, `isRefreshing`, `error`, dan `lastRefreshedAt`;
- pembatalan request lama dengan `AbortController` saat tab berganti cepat;
- refresh senyap dari WebSocket tanpa overlay global;
- mengabaikan response lama yang selesai setelah user berpindah KPPN.

### 2. Pemilihan KPPN

- Kanwil mengambil KPPN dari query `?id=...` dan `SelectionTab`.
- Jika query kosong atau tidak valid, pilih KPPN pertama level `0` dari dictionary dan gunakan `replace: true`.
- KPPN selalu memakai `auth.kppn`; query `id` tidak boleh mengubah unit yang diminta.
- Gunakan role `[3, 4, 99]` sebagai satu definisi Kanwil, bukan panjang string unit.

### 3. Hubungkan komponen halaman

`NilaiSection` akan:

- mengganti judul periode hard-coded dengan `periodName` dari response;
- mengisi `ScorePembinaan` menggunakan `nilaiKPPN` dan `nilaiKanwil`;
- mengubah isi ketika tab Kanwil berpindah;
- menampilkan skeleton lokal pada Card dan tabel ketika load awal;
- mempertahankan layout halaman ketika refresh WebSocket berlangsung;
- menampilkan pesan kosong/error yang berbeda untuk `403`, `404`, `409`, dan gangguan jaringan.

Tidak digunakan global loading overlay agar navigasi halaman tidak terasa freeze.

### 4. Refactor tabel

Hapus mock dan konstanta perhitungan dari `TabelPenilaian`.

Tabel menerima satu object AKK dan memetakan:

- baris self assessment dari `detailKPPN`;
- baris penilaian Kanwil dari `detailKanwil`;
- kolom nilai kertas kerja dari `detail.*.nilai`;
- kolom bobot dari `detail.*.bobot`;
- kolom nilai tertimbang dari `detail.*.kontribusi`;
- kolom AKK dari `nilaiKPPN` atau `nilaiKanwil`.

Untuk peraturan `1`:

- PB memakai bobot `100%` sesuai response server;
- SPML dan CK ditampilkan sebagai `-` karena tidak berlaku;
- AKK sama dengan nilai PB;
- struktur sebelas kolom tetap dipertahankan agar layout UI dan Excel konsisten.

Untuk peraturan `2`, tabel memakai PB `50%`, SPML `15%`, dan CK `35%` dari response.

### 5. Export Excel

`useExcelPenilaian` menerima object response yang sama dengan tabel. Nilai kontribusi dan AKK ditulis dari hasil server, bukan dihitung ulang dengan konstanta frontend.

- tombol export disabled ketika initial load, error, atau data belum tersedia;
- judul dan nama file memakai metadata KPPN/periode dari response;
- format peraturan `1` memakai tanda `-` pada CK/SPML;
- format peraturan `2` tetap sama dengan template `tabel_penilaian.xlsx`;
- error pembuatan file ditampilkan melalui snackbar, bukan hanya `console.error`.

### 6. Live refresh

`useNilaiAKKLiveSync` bergabung ke room berdasarkan `worksheetId`. Event `akkScoreChanged` diproses dengan debounce sekitar 250–400 ms, kemudian memanggil refresh senyap.

Saat socket reconnect:

1. join kembali ke room;
2. lakukan satu refresh senyap untuk menutup kemungkinan event yang terlewat;
3. abaikan event milik worksheet lain.

## Error dan Keadaan Khusus

- `auth.period` atau `auth.peraturan` kosong: jangan mengirim request; tampilkan pesan konfigurasi akun.
- `404`: kertas kerja untuk KPPN/periode belum di-assignment.
- `409`: assignment PB/CK/SPML belum lengkap atau metadata scoring tidak valid.
- `403`: akses unit tidak diizinkan; KPPN tidak boleh fallback ke unit lain.
- pergantian tab cepat: data KPPN lama tidak boleh menggantikan data tab terbaru.
- refresh live gagal: pertahankan data terakhir dan tampilkan snackbar ringan; jangan mengosongkan tabel.

## Route Halaman

Ubah akses `/nilai` dari `[0, 1, 2, 3, 4, 99]` menjadi `[1, 2, 3, 4, 99]` agar konsisten dengan endpoint dan kebutuhan bisnis halaman.

## Pengujian

### Backend

1. Peraturan `1` hanya menghitung PB dan mengembalikan CK/SPML `null`.
2. Peraturan `2` mengembalikan PB 50%, CK 35%, dan SPML 15% untuk KPPN dan Kanwil.
3. Metadata KPPN/periode sesuai worksheet yang dihitung.
4. KPPN tidak dapat mengambil nilai KPPN lain.
5. Role Kanwil dapat mengambil seluruh KPPN.
6. `404` dan `409` tetap memiliki arti yang konsisten.
7. Event `akkScoreChanged` hanya dikirim setelah update skor berhasil.

### Frontend

1. Initial load memakai KPPN, periode, dan peraturan dari sesi.
2. Tab Kanwil memuat data unit baru dan mencegah stale response.
3. User KPPN tidak melihat tab dan tidak dapat mengganti unit melalui URL.
4. Card, tabel, dan Excel menggunakan nilai response yang sama hingga dua desimal.
5. Peraturan `1` dan `2` dirender sesuai aturan masing-masing.
6. Skeleton, error, empty state, refresh senyap, dan disabled export bekerja benar.
7. Event skor PB/SPML/CK memperbarui angka tanpa overlay halaman.
8. Jalankan test backend scoring, lint frontend, dan build TypeScript/Vite.

## Perkiraan File yang Berubah

Backend:

- `backend/src/model/scoringEngine.model.ts`
- `backend/src/controller/scoringEngine.controller.ts`
- `backend/src/events/scoringEngineEvent.ts` (baru)
- `backend/src/events/index.ts`
- `backend/src/events/worksheetEvent.ts`
- `backend/src/events/wsSPMLJunctionEvent.ts`
- `backend/src/events/wsCKJunctionEvent.ts`
- `backend/__test__/model/scoringEngine.model.test.ts`
- test controller/event terkait bila belum tersedia

Frontend:

- `frontend/src/routes.tsx`
- `frontend/src/sections/nilai/types.ts` (baru)
- `frontend/src/sections/nilai/useNilaiAKK.ts` (baru)
- `frontend/src/sections/nilai/useNilaiAKKLiveSync.ts` (baru)
- `frontend/src/sections/nilai/NilaiSection.tsx`
- `frontend/src/sections/nilai/components/TabelPenilaian.tsx`
- `frontend/src/sections/nilai/useExcelPenilaian.ts`

Database:

- tidak ada perubahan skema wajib;
- migrasi index hanya ditambahkan apabila pemeriksaan index database menunjukkan index yang dibutuhkan belum tersedia.

## Urutan Implementasi

1. Kunci kontrak response dan hardening otorisasi backend.
2. Optimalkan query serta tambahkan test backend.
3. Buat types dan hook REST frontend.
4. Hubungkan Card, tabel, dan export ke response server.
5. Tambahkan loading/error/empty state.
6. Tambahkan room dan live refresh WebSocket.
7. Jalankan verifikasi lint, build, test, dan uji manual Kanwil/KPPN.
