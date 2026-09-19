# SALAMAIK-WEB (Self Assessment dan Penilaian Mandiri KPPN)

## Overview

Salamaik Web adalah aplikasi berbasis web yang digunakan dalam proses pembinaan KPPN oleh Kanwil. User Salamaik Web terdiri dari user KPPN dan Kanwil. Fungsi Utama aplikasi yaitu pengisian kertas kerja pembinaan. Pengisian kertas kerja tidak hanya dilakukan oleh Kanwil sebagai pihak yang menilai, namun juga oleh KPPN, sehingga mengakomodir proses self assessment di awal. Selain fungsi utama, aplikasi juga menyediakan modul standardisasi yang memonitor kegiatan yang telah dilaksanakan KPPN.

## Goals

1. Memungkinkan User KPPN untuk mengisi Kertas Kerja dengan nilai versinya
2. Memungkinkan User Kanwil untuk melihat self assessment awal KPPN
3. Memungkinkan User Kanwil untuk mengisi Kertas Kerja dengan nilai versinya, serta memberikan catatan
4. Memungkinkan User KPPN untuk mengetahui hal-hal yang membutuhkan perbaikan (tindak lanjut)
5. Memungkinkan User Kanwil dan KPPN untuk melihat hasil skor pembinaan, serta matrix hal yang membutuhkan perbaikan, serta apakah telah ditindaklanjuti oleh KPPN


## Core Application Flow
1. User Admin Kanwil mengatur referensi periode, referensi kertas kerja, dan melakukan assignment (pembagian) kertas kerja
2. User KPPN mengakses aplikasi dan mengisi kertas kerja. Pengisian yang dilakukan yaitu mengisi nilai versi KPPN dan mengupload file bukti dukung.
3. User Kanwil melihat kertas kerja, memverifikasi, dan memberikan nilai versinya
4. User Admin Kanwil melakukan posting/assign data kertas kerja ke Matrix Pembinaan, sehingga didapatkan hal-hal atau checklist kertas kerja yang membutuhkan perbaikan.
4. (Diluar Aplikasi), pihak Kanwil dan KPPN mengadakan meeting untuk membahas pelaksanaan pembinaan serta checklist yang membutuhkan perbaikan
5. (Diluar Aplikasi), pihak KPPN mengumpulkan dokumen pendukung yang kurang atau mengadakan kegiatan yang kurang untuk dapat memenuhi hal yang membutuhkan perbaikan
6. User KPPN mengisi tindak lanjut atas hal-hal yang membutuhkan perbaikan pada aplikasi
7. Nilai akhir pembinaan didapatkan, dan datanya dimanfaatkan sebagai arsip

## Other Application Flow (menu standardisasi)
1. User KPPN mengupload file pada menu standardisasi, sesuai dengan kegiatan dan periodisasi yang ditentukan dalam aturan
2. User Kanwil mengecek file yang diupload KPPN serta menghapus apabila terdapat ketidaksesuaian
3. User Kanwil dapat mencetak pdf laporan untuk membantu mengingatkan KPPN apabila terdapat dokumen yang belum diupload sesuai dengan aturan deadline upload file

## Pengembangan
Seiring dengan perubahan regulasi, pada tahun 2026 terdapat perubahan proses pembinaan. Pada peraturan awal (PER-1 2023) hanya terdapat 1 jenis kertas kerja. Pada regulasi baru, akan terdapat 3 kertas kerja. Kertas kerja awal akan dinamakan Kertas Kerja Proses Bisnis (PB), selain itu akan ada kertas kerja SPML yang menilai standar sarana prasarana, serta kertas kerja CK yang menilai capaian kerja kppn. Pengembangan saat ini dan kedepan berfokus untuk mengakomodir perubahan regulasi tersebut

### Development Plan
1. Pertama perlu ditambahkan referensi kertas kerja SPML dan menu untuk pengisian Kertas Kerja SPML
2. Kedua perlu ditambahkan referensi kertas kerja CK menu untuk pengisian Kertas Kerja CK
3. Ketiga perlu mengupdate logika aplikasi untuk menentukan skor pembinaan sesuai dengan aturan baru
4. Keempat update logika pada aplikasi harus dapat bersifat compatible ke belakang sehingga histori penilaian tidak rusak


## Aturan Bagi Agent
Setelah menerima arahan dari user, buatkan dulu planningnya dalam sebuah dokumen yang dapat dibaca oleh user. Anda dilarang langsung merubah kode tanpa planning yang telah disetujui user. Ketentuan ini perlu anda abaikan apabila pada prompt user menyertakan command "--no-plan"