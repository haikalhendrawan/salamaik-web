# Rencana Optimisasi Perceived Rendering Tabel SPML

## Masalah Saat Ini

Tabel SPML dibentuk dari dua kelompok data yang datang pada waktu berbeda:

- struktur komponen, subkomponen, dan aspek berasal dari `useDictionary`;
- row checklist beserta nilai/file/catatan berasal dari `wsSPMLJunction`.

Ketika dictionary telah tersedia tetapi request junction belum selesai, fungsi `komponenSPMLRow()` tetap merender komponen dan subkomponen. Pada setiap aspek, `getAspekSPMLRow()` tidak menemukan junction dan mengembalikan `null`. Akibatnya user melihat kerangka bagian tabel lebih dahulu, lalu row checklist muncul terlambat dan mendorong layout.

Selain latensi request, proses render saat ini melakukan filter berulang:

- filter subkomponen untuk setiap komponen;
- filter aspek untuk setiap subkomponen;
- filter seluruh junction untuk setiap aspek.

Pola tersebut mengulang pencarian setiap render dan ikut menambah jeda ketika data junction masuk.

### Bottleneck utama yang ditemukan

Pada `getWsSPMLJunctionForKanwil()` dan `getWsSPMLJunctionKPPN()`, setelah response junction diterima, alurnya masih menunggu:

```ts
setWsSPMLJunction(rows);
await getSPMLScore(rows[0].worksheet_id);
```

Global loading baru dimatikan pada blok `finally` setelah request skor selesai. Akibatnya response junction dapat sudah tersedia dengan cepat, tetapi user masih belum melihat row karena siklus initial load ikut menunggu endpoint scoring. Nilai footer sebenarnya tidak perlu memblokir isi tabel.

Selain itu, `getWorksheet()` dan `getWsSPMLJunctionKanwil()` sama-sama mengendalikan satu boolean global loading ketika dipanggil bersamaan. Dua request paralel yang mengubah boolean yang sama dapat menghasilkan timing overlay yang tidak stabil.

## Hasil yang Diinginkan

1. Halaman langsung memberikan feedback visual tanpa overlay yang membuat aplikasi terasa freeze.
2. Struktur tabel tidak terlihat kosong atau meloncat ketika junction selesai dimuat.
3. Jumlah placeholder sama dengan jumlah checklist referensi sehingga tinggi awal mendekati tinggi akhir.
4. Live refresh websocket tidak mengganti tabel menjadi skeleton penuh.
5. Mapping dan pencarian row dilakukan sekali per perubahan data, bukan berulang di setiap tingkat hierarchy.

## Tahap 1 — Loading Lokal untuk Initial Fetch

Tambahkan state lokal pada `WorksheetSPMLWorkspace`:

```ts
const [isInitialTableLoading, setIsInitialTableLoading] = useState(true);
```

Saat `selectedKppnId` berubah:

1. Set `isInitialTableLoading = true` sebelum request.
2. Ambil detail worksheet dan junction secara paralel dengan `Promise.all`.
3. Gunakan opsi `showOverlay: false` untuk request junction.
4. Sesuaikan `getWorksheet` agar menerima opsi `showOverlay`, kemudian matikan overlay untuk pemuatan workspace ini.
5. Set `isInitialTableLoading = false` pada `finally`.

Request dari websocket tetap menggunakan `showOverlay: false`, tetapi tidak mengaktifkan `isInitialTableLoading`. Dengan demikian live refresh hanya men-disable kontrol row yang berubah sebagaimana mekanisme saat ini.

State loading dikirim ke tabel:

```tsx
<WorksheetSPMLTable isInitialLoading={isInitialTableLoading} />
```

## Tahap 1A — Pisahkan Fetch Junction dan Fetch Skor

Ini merupakan perubahan dengan dampak terbesar dan perlu dikerjakan sebelum optimisasi mapping.

Setelah response junction diterima:

1. Commit `setWsSPMLJunction(rows)` segera.
2. Tandai initial table loading selesai agar row langsung terlihat.
3. Jalankan refresh skor secara terpisah tanpa ditunggu oleh loading tabel.
4. Biarkan `isScoreLoading` hanya mengaktifkan skeleton pada footer skor.

Dengan demikian jalur kritis tampilan row menjadi:

```text
request junction → set rows → tampilkan tabel
```

bukan:

```text
request junction → set rows → tunggu request skor → tutup overlay → tampilkan tabel
```

Implementasinya dapat memisahkan method menjadi dua tanggung jawab:

```ts
refreshJunction(...)
refreshScore(...)
```

Workspace mengorkestrasi keduanya, sedangkan live sync tetap dapat meminta refresh skor hanya untuk event `score`.

Hindari promise tanpa penanganan error. Jika refresh skor dijalankan tanpa `await`, panggil dengan `void getSPMLScore(...)` dan pastikan fungsi tersebut sudah menangani error internal sebagaimana implementasi saat ini.

## Tahap 2 — Skeleton yang Mengikuti Struktur Tabel

Buat komponen terpisah:

```text
WorksheetSPMLTable/components/WorksheetSPMLTableSkeleton.tsx
```

Skeleton tidak berupa kotak besar tunggal. Komponen ini tetap menampilkan judul komponen dan subkomponen, lalu menampilkan placeholder pada setiap aspek berdasarkan `checklistSpmlRef`.

Untuk setiap checklist referensi, tampilkan:

- skeleton teks pada kolom Kegiatan;
- skeleton berbentuk select pada Nilai KPPN dan Nilai Kanwil;
- dua skeleton tombol kecil pada Dokumen;
- skeleton multiline pada Catatan Kanwil;
- skeleton tombol bulat pada Comment.

Nomor dan judul aspek tetap ditampilkan dengan `rowSpan` yang dihitung dari jumlah checklist referensi. Hasilnya, user langsung melihat bentuk akhir tabel dan tidak mengalami layout shift ketika data aktual masuk.

Footer nilai menggunakan skeleton yang sudah didukung `ScoreFooterCell` sampai scoring selesai dimuat.

Jika request telah selesai tetapi benar-benar menghasilkan array kosong, tampilkan empty state “Checklist SPML belum tersedia”, bukan skeleton tanpa akhir.

## Tahap 3 — View Model Terindeks

Buat utility/hook lokal, misalnya:

```text
WorksheetSPMLTable/useSPMLTableViewModel.ts
```

Gunakan `useMemo` untuk membentuk indeks berikut:

```ts
subKomponenByKomponenId: Map<number, SubKomponenSpmlRefType[]>
aspekBySubKomponenId: Map<number, AspekSpmlRefType[]>
checklistRefByAspekId: Map<number, ChecklistSpmlRefType[]>
junctionByAspekId: Map<number, WsSPMLJunctionType[]>
```

Setiap array sumber hanya dilalui satu kali. Renderer kemudian melakukan lookup `Map` O(1), menggantikan filter seluruh array di setiap nested mapping.

View model menghasilkan hierarchy siap render:

```ts
komponen[] -> subKomponen[] -> aspek[] -> checklist[]
```

Urutan tetap mengikuti urutan referensi yang sudah diterima dari API.

## Tahap 4 — Pemisahan dan Memoisasi Row

Ekstrak row aktual menjadi komponen:

```text
WorksheetSPMLTable/components/SPMLChecklistRow.tsx
```

Komponen menerima hanya:

- satu junction;
- metadata aspek untuk row pertama;
- `rowSpan`;
- `isKanwil`;
- `isPastDue`.

Bungkus dengan `React.memo`. Ini membuat perubahan pada satu checklist tidak perlu menjalankan seluruh fungsi pembentukan row secara berulang. Header tabel dan row hierarchy juga dapat dimemoisasi karena tidak berubah ketika user mengedit skor/file/catatan.

Optimisasi ini tetap kompatibel dengan live sync. Mekanisme `isJunctionSyncing(junctionId, changeType)` tetap berada pada komponen input terkait sehingga hanya kontrol yang sedang disinkronkan yang dinonaktifkan.

## Tahap 5 — Transisi Data Tanpa Freeze

Saat response junction selesai:

- pertahankan UI skeleton sampai data baru siap disusun;
- commit pergantian dataset melalui transisi React (`startTransition`) bila profiling menunjukkan mapping masih memblokir main thread;
- jangan gunakan timeout buatan atau minimum loading duration karena hanya memperlambat data yang sebenarnya sudah siap.

`startTransition` bersifat tahap optimisasi setelah view model diterapkan. Jika profiling menunjukkan render sudah cepat, mekanisme ini tidak perlu ditambahkan.

## Perubahan API Context

Pada `useWsSPMLJunction.tsx`:

- perluas `getWorksheet(kppnId, options?)` dengan opsi `showOverlay?: boolean`;
- default tetap `true` agar pemanggil lama tidak berubah;
- workspace SPML memanggilnya dengan `{ showOverlay: false }`;
- request error tetap menampilkan snackbar;
- silent/live refresh tidak menghapus data lama ketika gagal.

Tidak diperlukan perubahan backend. Sumber jeda visual berasal dari urutan fetch dan pekerjaan render frontend, bukan format response server.

## Perilaku Pergantian KPPN

Saat user Kanwil berpindah KPPN:

1. Tabel segera masuk skeleton lokal.
2. Data KPPN sebelumnya tidak pernah ditampilkan sebagai data KPPN baru.
3. Request lama tetap dilindungi oleh `junctionRequestId` yang sudah ada.
4. Setelah response KPPN terbaru selesai, skeleton diganti secara atomik dengan data aktual.

## File yang Akan Diubah

- `frontend/src/sections/worksheetSPML/WorksheetSPMLWorkspace.tsx`
- `frontend/src/sections/worksheetSPML/useWsSPMLJunction.tsx`
- `frontend/src/sections/worksheetSPML/components/WorksheetSPMLTable/WorksheetSPMLTable.tsx`
- `frontend/src/sections/worksheetSPML/components/WorksheetSPMLTable/components/WorksheetSPMLTableSkeleton.tsx` (baru)
- `frontend/src/sections/worksheetSPML/components/WorksheetSPMLTable/components/SPMLChecklistRow.tsx` (baru)
- `frontend/src/sections/worksheetSPML/components/WorksheetSPMLTable/useSPMLTableViewModel.ts` (baru)

## Verifikasi

1. Throttle jaringan dan buka workspace: header serta skeleton row tampil segera tanpa overlay global.
2. Setelah data masuk, tinggi dan posisi row tidak meloncat secara signifikan.
3. Pindah KPPN dengan jaringan lambat: tidak ada flash data KPPN sebelumnya.
4. Trigger websocket pada satu skor/file/note: tabel lain tetap dapat digunakan dan skeleton penuh tidak muncul.
5. Gunakan React Profiler untuk membandingkan waktu commit sebelum dan sesudah indeks `Map`.
6. Pastikan drawer, toolbar, footer score, scroll-to-checklist, serta sticky header tetap bekerja.
7. Jalankan lint dan build frontend.

## Urutan Implementasi

1. Lepaskan request skor dari jalur kritis request junction.
2. Tambahkan loading lokal dan matikan overlay workspace.
3. Tambahkan skeleton struktural.
4. Bentuk view model terindeks.
5. Ekstrak dan memo-kan row checklist bila profiling masih menunjukkan commit yang mahal.
6. Profiling; tambahkan `startTransition` hanya bila masih dibutuhkan.
