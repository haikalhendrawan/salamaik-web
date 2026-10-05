# Rencana: Penyesuaian Format Excel Kertas Kerja

## Scope yang Disetujui

Perubahan hanya mencakup format export Excel di frontend:

1. **PB:** row komponen/subkomponen merge sampai kolom G, bukan H.
2. **SPML dan CK:** row komponen/subkomponen merge sampai kolom E dan rata kiri. Row footer diberi merge pada area label yang sesuai dengan kolom nilai dan teks rata tengah.

Mekanisme nilai N/A tidak diubah.

## Verifikasi

- Pastikan batas merge PB A:G.
- Pastikan section SPML/CK merge A:E dan rata kiri.
- Pastikan label footer SPML/CK rata tengah dan nilai pada kolom skor tetap terpisah.
- Jalankan TypeScript check frontend.
