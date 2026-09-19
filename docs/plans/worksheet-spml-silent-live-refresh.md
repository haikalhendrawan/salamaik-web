# Rencana Silent Live Refresh Kertas Kerja SPML

## Tujuan

Menghilangkan loading overlay global ketika frontend menerima event live SPML. Refresh awal halaman tetap memakai overlay, sedangkan refresh websocket berjalan di background dan hanya menandai komponen terkait sebagai sedang disinkronkan.

## Perubahan context `useWsSPMLJunction`

### Opsi refresh

Ubah fungsi refresh junction agar menerima opsi:

```ts
interface WsSPMLRefreshOptions {
  showOverlay?: boolean;
  syncingJunctionId?: number;
  refreshScore?: boolean;
}
```

Default untuk pemanggilan biasa:

```ts
{
  showOverlay: true,
  refreshScore: true
}
```

Pemanggilan dari websocket menggunakan:

```ts
{
  showOverlay: false,
  syncingJunctionId: event.junctionId,
  refreshScore: event.changeType === 'score'
}
```

### State sinkronisasi

Tambahkan:

```ts
syncingJunctionIds: Set<number>
```

Sediakan helper context:

- `isJunctionSyncing(junctionId)`; atau
- expose `syncingJunctionIds` secara readonly.

Ketika silent refresh dimulai, junction ID dimasukkan ke set. ID dikeluarkan pada blok `finally`. Gunakan functional state update agar beberapa event bersamaan tidak saling menghapus status.

### Penggunaan overlay

- `setIsLoading(true/false)` hanya dijalankan jika `showOverlay === true`.
- Silent refresh tidak boleh mengosongkan `wsSPMLJunction` ketika request dimulai.
- Jika silent refresh gagal, data lama dipertahankan dan snackbar error tetap ditampilkan.
- Initial load yang gagal tetap boleh mengosongkan data karena belum ada snapshot valid.

### Race condition

- Tambahkan request sequence/ID untuk data junction seperti yang sudah digunakan pada scoring.
- Hanya response request terbaru untuk worksheet aktif yang boleh mengganti state.
- Setiap request tetap membersihkan junction ID miliknya dari state sinkronisasi.

## Perubahan `useWsSPMLLiveSync`

- Pertahankan room filtering dan debounce yang sudah ada.
- Simpan event terakhir yang lolos filter.
- Panggil refresh dalam mode silent:

```ts
getWsSPMLJunctionKanwil(kppnId, {
  showOverlay: false,
  syncingJunctionId: event.junctionId,
  refreshScore: event.changeType === 'score',
});
```

- Debounce harus mempertahankan kumpulan junction ID jika beberapa checklist berubah dalam satu interval, bukan hanya ID event terakhir.
- Perubahan `comment-add`/`comment-delete`, link, dan file tidak perlu memanggil ScoringEngine.
- Perubahan `score` termasuk N/A harus me-refresh ScoringEngine.

## Perubahan komponen

### `ScoreSelect`

- Baca status sinkronisasi junction dari context.
- Disabled jika:
  - user tidak berwenang mengedit;
  - penyimpanan lokal sedang berjalan; atau
  - junction tersebut sedang menerima sinkronisasi live bertipe score.
- Tampilkan indikator kecil pada select atau di sisi kanan cell ketika sedang sinkronisasi.
- Checklist lain tetap aktif.

Untuk membedakan jenis perubahan, context dapat menyimpan map:

```ts
syncingJunctions: Map<number, Set<SPMLChangeType>>
```

Ini lebih tepat daripada set ID biasa karena event komentar tidak seharusnya menonaktifkan select skor.

### `FileActions`

- Tombol file/link hanya diberi loading atau disabled jika junction yang sama sedang disinkronkan dengan jenis `file-upload`, `file-delete`, atau `link`.
- Tidak terpengaruh oleh event komentar atau nilai.

### Komentar

- Badge dan popover tetap diperbarui seperti sekarang.
- Event komentar tidak menonaktifkan select maupun tombol file.
- Loading daftar komentar tetap berada di dalam popover.

### Footer skor

- Gunakan `isScoreLoading` yang sudah tersedia.
- Pertahankan nilai lama dan tampilkan spinner kecil saat skor baru diminta.
- Tidak menggunakan overlay global.

## Perubahan signature yang diperkirakan

```ts
getWsSPMLJunctionKanwil(
  kppnId: string,
  options?: WsSPMLRefreshOptions
): Promise<void>
```

Signature internal KPPN/Kanwil juga menerima opsi yang sama agar perilakunya konsisten untuk kedua jenis user.

## File yang diperkirakan berubah

- `frontend/src/sections/worksheetSPML/useWsSPMLJunction.tsx`
- `frontend/src/sections/worksheetSPML/useWsSPMLLiveSync.ts`
- `frontend/src/sections/worksheetSPML/types.ts`
- `frontend/src/sections/worksheetSPML/components/WorksheetSPMLTable/components/ScoreSelect.tsx`
- `frontend/src/sections/worksheetSPML/components/WorksheetSPMLTable/components/FileActions.tsx`
- Opsional komponen indikator kecil jika markup loading digunakan berulang.

Backend dan format event websocket tidak perlu diubah karena payload saat ini sudah membawa `junctionId` dan `changeType`.

## Verifikasi

1. Membuka worksheet pertama kali tetap menampilkan overlay loading.
2. Event score dari user lain tidak menampilkan overlay halaman.
3. Hanya `ScoreSelect` junction terkait yang sementara disabled.
4. Checklist lain tetap dapat diedit saat silent refresh.
5. Footer mempertahankan nilai lama dan menampilkan spinner kecil.
6. Event komentar tidak menonaktifkan select atau tombol file.
7. Event link hanya memengaruhi kontrol link junction terkait.
8. Event file hanya memengaruhi kontrol file junction terkait.
9. Beberapa event checklist berbeda dalam interval debounce tetap menandai seluruh junction terkait.
10. Response request lama tidak menimpa worksheet baru.
11. Kegagalan silent refresh mempertahankan snapshot data lama.
12. Frontend TypeScript build dan ESLint terarah berhasil.
