# Rencana Tombol Tutup Drawer SPML

## Tujuan

Mengubah tombol tutup `NavigationDrawerSPML` agar tampil seperti drawer worksheet PB: tombol kecil menempel pada tepi kiri drawer dan terlihat seperti tab pada ujung kertas.

## Perubahan

- Menghapus tombol `Fab` penutup dari bagian header drawer.
- Membuat tombol penutup khusus dengan posisi absolut pada sisi kiri luar panel drawer.
- Bentuk tombol menggunakan radius pada sisi kiri dan sisi kanan rata dengan drawer.
- Menggunakan ikon `lucide:chevron-right` untuk menunjukkan aksi menutup drawer.
- Mempertahankan tombol pembuka di sisi kanan layar dan seluruh isi/status/navigasi drawer.
- Menetapkan `overflow: visible` pada paper drawer agar bagian tombol yang berada di luar panel tetap terlihat dan dapat diklik.

## Verifikasi

- Tombol tampil menempel pada tepi kiri drawer.
- Klik tombol menutup drawer.
- Tombol tidak tertutup oleh backdrop atau isi scrollbar.
- Lint dan build frontend berhasil.

Implementasi dimulai setelah rencana disetujui.
