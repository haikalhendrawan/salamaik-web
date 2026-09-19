# Rencana Perubahan Hak Akses Link Worksheet PB

## Tujuan

Memungkinkan user KPPN dan Kanwil menambah, mengedit, serta menghapus link bukti dukung pada kertas kerja PB selama periode kertas kerja masih terbuka.

## Perubahan UI

### `frontend/src/sections/worksheet/component/LinkFilePopover.tsx`

- Menghapus penggunaan `useAuth` dan perhitungan `isKanwil` yang hanya diperlukan untuk membatasi pengeditan link.
- Menampilkan tombol Edit dan Hapus kepada KPPN maupun Kanwil ketika `!isPastDue`.
- Mengaktifkan input link bagi KPPN maupun Kanwil ketika periode masih terbuka.
- Menampilkan tombol Simpan kepada kedua role ketika periode masih terbuka.
- Mempertahankan tombol Buka bagi kedua role, termasuk setelah periode ditutup.
- Mempertahankan seluruh handler dan event socket `updateLinkFile` yang sudah ada.

## Perilaku Akhir

- Periode terbuka:
  - KPPN dan Kanwil dapat menambah, mengedit, menghapus, dan membuka link.
- Periode ditutup:
  - KPPN dan Kanwil hanya dapat melihat serta membuka link yang sudah tersedia.
  - Input dan seluruh aksi perubahan tidak ditampilkan/diaktifkan.

## Batas Perubahan

- Perubahan hanya pada UI kertas kerja PB sesuai permintaan.
- Validasi otorisasi backend event `updateLinkFile` tidak diubah dalam pekerjaan ini.
- Tidak mengubah fungsionalitas upload atau penghapusan file fisik.

## Verifikasi

- Menjalankan lint terarah pada `LinkFilePopover.tsx`.
- Menjalankan pemeriksaan TypeScript/build frontend dan melaporkan error lama di luar lingkup secara terpisah.
