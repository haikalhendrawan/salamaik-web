# Rencana Loading API `useWsSPMLJunction`

## Tujuan

Menghubungkan setiap pemanggilan API pada `useWsSPMLJunction` dengan global loading state dari `useLoading`.

## Perubahan

- Memanggil `setIsLoading(true)` sebelum request API dimulai pada:
  - `getWsSPMLJunctionForKanwil`;
  - `getWsSPMLJunctionKPPN`;
  - `getWorksheet`.
- Menambahkan blok `finally` pada setiap request untuk memanggil `setIsLoading(false)` baik request berhasil maupun gagal.
- Mempertahankan penanganan error dan reset state yang sudah ada.
- Tidak menambahkan loading kedua pada fungsi dispatcher `getWsSPMLJunctionKanwil`, karena request aktual sudah ditangani oleh fungsi KPPN/Kanwil yang dipilih.

## Verifikasi

- Jalankan lint terarah pada `useWsSPMLJunction.tsx`.
- Jalankan pemeriksaan TypeScript/build frontend dan laporkan apabila terdapat error lama di file lain.

## Catatan

Implementasi ini mengikuti kontrak global loading boolean yang tersedia saat ini. Jika beberapa request berjalan bersamaan, request yang selesai lebih dahulu dapat menutup indikator ketika request lain masih berjalan; perbaikan reference counter berada di luar lingkup perubahan ini.
