# Rencana: Samakan Bukti Dukung Tindak Lanjut dengan FollowUpCard Asli

## Tujuan

Pada detail tindak lanjut Peraturan 2, hilangkan pemisahan antara “Bukti dukung awal” dan “Bukti dukung tindak lanjut”. Tampilan dan perilakunya mengikuti `FollowUpCard` asli: satu bagian bukti dukung yang menampilkan/mengelola bukti tindak lanjut. Aksi untuk melihat atau mengubah link file tetap tersedia.

## Perubahan

1. Ubah cabang Peraturan 2 di `FollowUpCard/Dokumen.tsx` agar tidak merender file/link dari worksheet asal sebagai bagian bukti tersendiri.
2. Tampilkan file tindak lanjut yang tersimpan pada temuan, dengan aksi unggah atau hapus mengikuti perilaku file pada FollowUpCard asli.
3. Tampilkan link tindak lanjut pada bagian yang sama, dengan aksi tambah/edit (dan hapus jika perilaku link asli mendukungnya).
4. Pertahankan API findings, aturan periode, izin akses, serta bukti worksheet asal di database tanpa perubahan.

## Verifikasi

- Detail PB/CK/SPML Peraturan 2 hanya menampilkan satu bagian bukti dukung.
- Tidak ada tautan/file bukti worksheet awal yang ditampilkan sebagai read-only di bagian ini.
- File dan link tindak lanjut tetap dapat dikelola sesuai kewenangan/periode.
- Peraturan 1 tidak berubah; jalankan pemeriksaan TypeScript frontend.
