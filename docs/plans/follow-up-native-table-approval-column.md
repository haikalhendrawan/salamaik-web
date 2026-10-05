# Rencana: Kolom Status Tindak Lanjut pada Tabel Detail CK/SPML

## Tujuan

Pada detail temuan CK/SPML, tempatkan status dan aksi approval tindak lanjut di dalam tabel worksheet, bukan di luar tabel.

## Perubahan

- Tambahkan satu kolom paling kanan berjudul `Tindak Lanjut` setelah `Comment` pada tabel detail CK/SPML.
- Render komponen `Approval` pada sel tersebut di baris checklist temuan yang sama.
- Hapus panel `Status Tindak Lanjut` di bawah tabel.
- Detail PB dan alur status/backend tidak berubah.

## Verifikasi

- Tabel CK dan SPML menampilkan kolom Tindak Lanjut di ujung kanan dengan status serta tombol aksi.
- Tidak ada status/approval yang ter-render lagi di luar tabel.
- Periksa TypeScript dan lint komponen terkait.
