--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

--
-- Data for Name: komponen_spml_ref; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.komponen_spml_ref VALUES (2, 'KAPABILITAS INTERNAL', 0, NULL, 'KI', 2, NULL, 'II');
INSERT INTO public.komponen_spml_ref VALUES (3, 'TATA KELOLA DAN KEPATUHAN', 0, NULL, 'TK', 2, NULL, 'III');
INSERT INTO public.komponen_spml_ref VALUES (4, 'INOVASI DAN PENGEMBANGAN ORGANISASI', 0, NULL, 'IP', 2, NULL, 'IV');
INSERT INTO public.komponen_spml_ref VALUES (5, 'LINGKUNGAN DAN ECO OFFICE', 0, NULL, 'LE', 2, NULL, 'V');
INSERT INTO public.komponen_spml_ref VALUES (1, 'KUALITAS PELAYANAN', 0, NULL, 'KP', 2, NULL, 'I');


--
-- Data for Name: subkomponen_spml_ref; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.subkomponen_spml_ref VALUES (13, 5, 'Implementasi Eco Office', NULL, NULL, NULL);
INSERT INTO public.subkomponen_spml_ref VALUES (1, 1, 'Standar dan Informasi Layanan', NULL, NULL, 'A');
INSERT INTO public.subkomponen_spml_ref VALUES (2, 1, 'Layanan Front Office & Ruang Publik', NULL, NULL, 'B');
INSERT INTO public.subkomponen_spml_ref VALUES (3, 2, 'Manajemen Mutu & Standar Pelayanan', NULL, NULL, 'A');
INSERT INTO public.subkomponen_spml_ref VALUES (4, 2, 'Manajemen Perubahan', NULL, NULL, 'B');
INSERT INTO public.subkomponen_spml_ref VALUES (5, 2, 'Manajemen Perencanaan dan Kepemimpinan', NULL, NULL, 'C');
INSERT INTO public.subkomponen_spml_ref VALUES (6, 2, 'Pemanfaatan TI', NULL, NULL, 'D');
INSERT INTO public.subkomponen_spml_ref VALUES (7, 2, 'Pendukung Intress Office', NULL, NULL, 'E');
INSERT INTO public.subkomponen_spml_ref VALUES (8, 3, 'Manajemen Keberlangsungan Bisnis dan Sarana Keamanan', NULL, NULL, 'A');
INSERT INTO public.subkomponen_spml_ref VALUES (9, 3, 'Sarana Prasarana Khusus dan Aksesibilitas', NULL, NULL, 'B');
INSERT INTO public.subkomponen_spml_ref VALUES (10, 3, 'Implementasi PUG', NULL, NULL, 'C');
INSERT INTO public.subkomponen_spml_ref VALUES (11, 4, 'INOVASI PELAYANAN PUBLIK', NULL, NULL, 'A');
INSERT INTO public.subkomponen_spml_ref VALUES (12, 4, 'PENGUATAN BRANDING INTRESS', NULL, NULL, 'B');


--
-- Data for Name: aspek_spml_ref; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.aspek_spml_ref VALUES (4, 4, NULL, 1, 1, 'Monitoring Layanan', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (1, 1, NULL, 1, 1, 'Standar Pelayanan', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (2, 2, NULL, 1, 1, 'Pengelolaan SIPPN', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (3, 3, NULL, 1, 1, 'Jam Layanan', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (5, 5, NULL, 1, 1, 'Layanan Pengaduan', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (6, 6, NULL, 1, 1, 'Layanan Jemput Bola', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (7, 7, NULL, 1, 1, 'Pelaksanaan FKP dan Tindak Lanjut FKP', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (8, 8, NULL, 1, 1, 'Pelaksanaan SKM/SKPL dan Publikasi Hasil', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (9, 9, NULL, 1, 1, 'Publikasi Video Profil Layanan', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (10, 10, NULL, 1, 2, 'Media Informasi', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (11, 11, NULL, 1, 2, 'Motto', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (12, 12, NULL, 1, 2, 'Janji Layanan/Standar Pelayanan', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (13, 13, NULL, 1, 2, 'Pakta Integritas', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (14, 14, NULL, 1, 2, 'Jam Layanan', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (15, 15, NULL, 1, 2, 'Papan Petunjuk', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (16, 16, NULL, 1, 2, 'Larangan dan Himbauan', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (17, 17, NULL, 1, 2, 'Layanan Pengaduan', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (18, 18, NULL, 1, 2, 'Kotak Saran', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (19, 19, NULL, 1, 2, 'Tempat koran, buku, dan majalah', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (20, 20, NULL, 1, 2, 'Fasilitas Pendukung', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (21, 21, NULL, 1, 2, 'Sistem Antrean Elektronik', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (22, 22, NULL, 1, 2, 'Tempat Sampah', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (23, 23, NULL, 1, 2, 'Penunjuk Waktu', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (24, 24, NULL, 1, 2, 'Wireless Fidelity', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (25, 25, NULL, 1, 2, 'Bunga dan Tanaman Hijau', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (26, 26, NULL, 1, 2, 'Pengharum Ruangan', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (27, 27, NULL, 1, 2, 'Televisi/LCD monitor', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (28, 28, NULL, 1, 2, 'Charger Station', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (29, 29, NULL, 1, 2, 'Meja Tempat Petugas Resepsionis dan Keamanan', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (30, 30, NULL, 1, 2, 'Area Receptionist', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (31, 31, NULL, 1, 2, 'Area Custormer Service Officer (CSO)', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (32, 32, NULL, 1, 2, 'Area Stakeholders Lounge', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (33, 33, NULL, 1, 2, 'Mini TLC', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (34, 34, NULL, 1, 2, 'Area Self Service', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (35, 35, NULL, 1, 2, 'Area Sinergi/Kolaborati f Kemenkeu di Daerah', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (36, 36, NULL, 1, 2, 'Area Pelayanan Special Mission (UMKM, Umi, Co- Location, dan lainnya)', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (37, 37, NULL, 2, 3, 'Publikasi Sistem Manajemen Mutu', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (38, 38, NULL, 2, 3, 'Internalisasi Pedoman Mutu', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (39, 39, NULL, 2, 4, 'Penunjukan Tim Manajemen Perubahan', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (40, 40, NULL, 2, 4, 'Perencanaan dan Pelaporan Proyek/Kegiatan', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (41, 41, NULL, 2, 4, 'Sertifikasi atau Pelatihan Tim Manajemen Perubahan', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (42, 42, NULL, 2, 5, 'Rapat Kerja Tahunan', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (43, 43, NULL, 2, 5, 'In House Training', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (44, 44, NULL, 2, 5, 'Pelatihan Service Excellent', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (45, 45, NULL, 2, 6, 'Penggunaan Collaboration Tools Kemenkeu', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (46, 46, NULL, 2, 6, 'Penggunaan Micro Website DJPb', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (47, 47, NULL, 2, 6, 'Media Sosial', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (48, 48, NULL, 2, 7, 'Loker Pegawai', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (49, 49, NULL, 2, 7, 'Area Kerja Khusus', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (50, 50, NULL, 2, 7, 'Ruang Kerja Khusus', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (51, 51, NULL, 2, 7, 'Meja Kerja Bersama', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (52, 52, NULL, 2, 7, 'Area Kolaborasi', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (53, 53, NULL, 2, 7, 'Focus Booth', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (54, 54, NULL, 2, 7, 'Smart TV/LED', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (55, 55, NULL, 2, 7, 'Wifi Kemenkeu', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (56, 56, NULL, 2, 7, 'Mushola/Masjid', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (57, 57, NULL, 3, 8, 'Penunjukan Tim MKB', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (58, 58, NULL, 3, 8, 'Hydrant kebakaran', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (59, 59, NULL, 3, 8, 'Pintu keluar darurat', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (60, 60, NULL, 3, 8, 'Area kumpul', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (61, 61, NULL, 3, 8, 'Kontak Darurat', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (62, 62, NULL, 3, 8, 'Closed Circuit Television (CCTV)', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (63, 63, NULL, 3, 8, 'APAR', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (64, 64, NULL, 3, 8, 'Uninterruptible Power Supply (UPS) dan server', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (65, 65, NULL, 3, 9, 'Ruang Laktasi', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (66, 66, NULL, 3, 9, 'Tempat bermain anak', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (67, 67, NULL, 3, 9, 'Toilet Terpisah', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (68, 68, NULL, 3, 9, 'Parking Prioritas', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (69, 69, NULL, 3, 9, 'Guiding block', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (70, 70, NULL, 3, 9, 'Jalur Landai', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (71, 71, NULL, 3, 9, 'Toilet Difabel', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (72, 72, NULL, 3, 9, 'Loket Prioritas', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (73, 73, NULL, 3, 10, 'Sertifikasi pelatihan PUG', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (74, 74, NULL, 3, 10, 'Internalisasi penguatan PUG', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (75, 75, NULL, 3, 10, 'Pembentukan Tim PUG', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (76, 76, NULL, 3, 10, 'Rencana Kerja Tim PUG', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (77, 77, NULL, 3, 10, 'Pengolahan Data Gender dan Terpilah Gender', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (78, 78, NULL, 3, 10, 'Publikasi Data Gender dan Terpilah Gender', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (79, 79, NULL, 3, 10, 'Kelengkapan Pemenuhan SIPEGIKU', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (80, 80, NULL, 3, 10, 'Piagam Komitmen PUG dan Anti Kekerasan/Pelec ahan Seksual', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (81, 81, NULL, 3, 10, 'Pemenuhan Fasilitas Pendukung PUG', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (82, 82, NULL, 3, 10, 'Pelaporan PUG', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (83, 83, NULL, 4, 11, 'Mal Pelayanan Publik (opsional)', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (84, 84, NULL, 4, 12, 'Media Tulis', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (85, 85, NULL, 4, 12, 'Media Sosial', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (86, 86, NULL, 4, 12, 'Backdrop Receptionist', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (87, 87, NULL, 4, 12, 'Name Building', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (88, 88, NULL, 4, 12, 'Signage Office', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (89, 89, NULL, 5, 13, 'Clean Desk and Paperless Policy', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (90, 90, NULL, 5, 13, 'Penunjukan Petugas Go Green', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (91, 91, NULL, 5, 13, 'Tempat Sampah', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (92, 92, NULL, 5, 13, 'Pengelolaan Sampah', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (93, 93, NULL, 5, 13, 'Terdapat himbauan implementasi eco office', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (94, 94, NULL, 5, 13, 'Minimalisasi pemakaian energi', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (95, 95, NULL, 5, 13, 'Sumur resapan', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (96, 96, NULL, 5, 13, 'Tanda larangan merokok dalam gedung', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (97, 97, NULL, 5, 13, 'Tanaman Hidup Ruang Kerja', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (98, 98, NULL, 5, 13, 'Refreshment/ Internalisasi/ Sosialisasi terkait eco-office', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (99, 99, NULL, 5, 13, 'Fasilitas Parkir Sepeda', NULL, NULL);
INSERT INTO public.aspek_spml_ref VALUES (100, 100, NULL, 5, 13, 'Konten Edukasi', NULL, NULL);


--
-- Data for Name: checklist_spml_ref; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.checklist_spml_ref VALUES (211, NULL, 'Seluruh fasilitas pendukung di bawah ini telah tersedia dan dapat digunakan dengan baik dan aman. 1. Loket Khusus 2. Ruang Tunggu Khusus 3. Ruang Laktasi 4. Tempat Bermain Anak 5. Sarana Layanan Kesehatan Fisik 6. Layanan Konseling Pegawai 7. Toilet Terpisah Gender 8. Toilet Khusus Difabel 9. Parkir Khusus Difabel 10. Parkir Khusus Perempuan 11. Lift Ramah Difabel (Opsional) 12. Guiding Block 13. Ruang/Jalur Layanan Khusus Kelompok rentan 14. Sarpras Disabilitas Lainnya (kursi roda, paduan huruf braille, dll)', 'Dokumentasi Foto', 3, 10, 81, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (120, NULL, 'Unit kerja menetapkan kembali standar pelayanan KPPN yang telah ditetapkan dalam Kepdirjen dan melakukan publikasi pada media sosial.', 'Dokumen Surat Keputusan Pimpinan Unit', 1, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (121, NULL, 'Unit kerja menyusun maklumat pelayanan sesuai ketentua dalam PMK tentang Standar Pelayanan setiap adanya pergantian pimpinan unit kerja. Maklumat pelayanan dipublikasikan melalui social media.', 'Dokumen Maklumat Pelayanan dan Tangkapan Layar Media Sosial', 1, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (122, NULL, 'Unit kerja aktif mengelola portal SIPPN dengan melakukan unggah SK, jumlah pelaksana, maklumat pelayanan, layanan terdata, dan profil unit.', 'Tangkapan Layar Portal SIPPN', 1, 1, 2, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (123, NULL, 'Jam Layanan telah dilaksanakan sesuai ketentuan: pukul 08.00- 15.00 (dengan antrean), dan pukul 08.00-17.00 (tanpa antrean, misal loket surat, layanan online, dll)', 'Papan Jam Layanan', 1, 1, 3, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (124, NULL, 'Di ruang Kepala Kantor terdapat monitor CCTV yang aktif dan terhubung ke seluruh kamera dalam dan luar area kantor.', 'Dokumentasi Kelengkapan CCTV', 1, 1, 4, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (125, NULL, 'Terdapat petugas yang menerima pengaduan secara langsung maupun melalui box pengaduan.', 'Dokumentasi Layanan Pengaduan secara langsung (petugas/kotak pengaduan)', 1, 1, 5, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (126, NULL, 'Tersedia layanan jemput bola melalui kanal grup WA, inovasi layanan, atau jemput bola layanan mobile.', 'Dokumentasi Layanan Jemput Bola', 1, 1, 6, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (127, NULL, 'Telah dilaksanakan FKP minimal 1 kali dalam setahun dengan mengikutsertakan komponen pentahelix dan terdokumentasi secara sempurna sesuai ketentuan pelaksanaan FKP.', 'Laporan Pelaksanaan FKP, Berita Acara FKP, Dokumentasi Pelaksanaan Kegiatan', 1, 1, 7, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (128, NULL, 'Unit kerja telah melaksanakan SKM/SKPL sesuai ketentuan dan melakukan publikasi baik melalui persuratan maupun media sosial.', 'Laporan SKM dan Dokumen Tindak Lanjut SKM/SKPL', 1, 1, 8, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (129, NULL, 'Unit kerja telah menyusun dan mempublikasikan video profil layanan KPPN.', 'Laporan SKM dan Dokumen Tindak Lanjut SKM/SKPL', 1, 1, 9, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (130, NULL, 'Visi dan Misi', 'Papan Media Informasi Unit', 1, 2, 10, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (131, NULL, 'Terdapat Nilai-Nilai dan Budaya Kemenkeu', 'Papan Media Informasi Unit', 1, 2, 10, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (132, NULL, 'Terdapat Maklumat Pelayanan', 'Papan Media Informasi Unit', 1, 2, 10, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (133, NULL, 'Terdapat motto (kebijakan mutu)', 'Surat Keputusan Pimpinan Unit', 1, 2, 11, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (134, NULL, 'Terdapat petunjuk mengenai jenis layanan meliputi: syarat, mekanisme dan prosedur, jangka waktu, tarif, dan produk layanan.', 'Surat Keputusan Pimpinan Unit', 1, 2, 12, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (135, NULL, 'Terdapat piagam pakta integritas yang ditandatangani seluruh pejabat/pegawai.', 'Pakta/Piagam Integritas', 1, 2, 13, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (136, NULL, 'Dipasang pada pintu/akses utama tanpa mencantumkan istirahat.', 'Papan Jam Layanan', 1, 2, 14, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (137, NULL, 'Terdapat penunjuk arah, minimal: toilet, mushola TLC, smoking area, jalur evakuasi, tempat berkumpul.', 'Dokumentasi Papan Petunjuk', 1, 2, 15, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (138, NULL, 'Terdapat tanda larangan merokok, jaga kebersihan, Stop KKN, hemat energi, WBK/WBBM', 'Papan Larangan/ Himbauan Manual/Elektronik', 1, 2, 16, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (139, NULL, 'Terdapat prosedur dan informasi pengaduan', 'Poster Manual/Elektronik', 1, 2, 17, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (140, NULL, 'Terdapat kotak saran yang dilengkapi dengan alat tulis dan kertas', 'Dokumentasi', 1, 2, 18, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (141, NULL, 'Tersedia dengan koleksi koran, buku, dan majalah', 'Dokumentasi', 1, 2, 19, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (142, NULL, 'Terdapat air minum gratis', 'Dokumentasi', 1, 2, 20, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (143, NULL, 'Terdapat permen', 'Dokumentasi', 1, 2, 20, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (144, NULL, 'Terdapat tissue', 'Dokumentasi', 1, 2, 20, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (145, NULL, 'Terdapat kalender meja', 'Dokumentasi', 1, 2, 20, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (146, NULL, 'Terdapat mesin antrean aktif (dapat berupa sistem antrian online)', 'Dokumentasi', 1, 2, 21, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (147, NULL, 'Terdapat tempat sampah terpilah dengan model tertutup dengan jumlah yang cukup', 'Dokumentasi', 1, 2, 22, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (148, NULL, 'Terdapat jam/penunjuk waktu yang sesuai', 'Dokumentasi', 1, 2, 23, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (149, NULL, 'Terdapat WiFi dengan akses internet gratis', 'Dokumentasi', 1, 2, 24, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (150, NULL, 'Terdapat Bunga/tanaman hijau di ruang layanan', 'Dokumentasi', 1, 2, 25, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (151, NULL, 'Manual/elektrik', 'Dokumentasi', 1, 2, 26, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (152, NULL, 'Terdapat televisi/monitor di Ruang Layanan sebagai media informatif dan Ruang Kerja Pimpinan sebagai penayang bahan rapat', 'Dokumentasi', 1, 2, 27, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (153, NULL, 'Terdapat tempat pengisian daya elektronik beserta charger.', 'Dokumentasi', 1, 2, 28, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (154, NULL, 'Terdapat meja khusus untuk Resepsionis dan petugas keamanan untuk standby', 'Dokumentasi', 1, 2, 29, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (155, NULL, 'Terdapat tempat untuk pelayanan pertama bagi stakeholders', 'Dokumentasi Foto Ruangan', 1, 2, 30, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (156, NULL, 'Terdapat tempat CSO atau Jafung Analis Perbendaharaan dan Pembina Teknis Perbendaharaan Negara (PTPN) untuk standby', 'Dokumentasi Foto Ruangan', 1, 2, 31, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (157, NULL, 'Terdapat Area Stakeholders Lounge berupa meja dan kursi layanan bagi stakeholders yang digunakan CSO untuk mendatangi stakeholders', 'Dokumentasi Foto Ruangan', 1, 2, 32, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (158, NULL, 'Tersedia Mini TLC yang terintegrasi dengan ruang layanan', 'Dokumentasi Foto Ruangan', 1, 2, 33, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (159, NULL, 'Terdapat area santai bagi stakeholders untuk menunggu layanan sekaligus mengakses berbagai media dan fasilitas KPPN', 'Dokumentasi Foto Ruangan', 1, 2, 34, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (160, NULL, 'Terdapat area khusus yang mendukung layanan Kemenkeu di daerah secara umum yang diselenggarakan oleh unit eselon I lainnya di daerah', 'Dokumentasi Foto Ruangan', 1, 2, 35, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (161, NULL, 'Terdapat area khusus yang didedikasikan untuk mendukung layanan konsultatif.', 'Dokumentasi Foto Ruangan', 1, 2, 36, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (162, NULL, 'Pada KPPN, pelaksanaan SMM sesuai standar ISO 9001:2015 dan dibuktikan dengan penataan dokumen, dan pemasangan Sertifikat ISO pada ruang layanan dan dipublikasi melalui media sosial.', 'Dokumentasi Kegiatan', 2, 3, 37, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (163, NULL, 'Unit kerja telah melakukan internalisasi pedoman mutu kepada seluruh pejabat/pegawai.', 'Dokumentasi atau Laporan Kegiatan', 2, 3, 38, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (164, NULL, 'Terdapat Penunjukkan pegawai unit kerja sebagai personel dalam mendukung pelaksanaan program transformasi organisasi.', 'Surat keputusan penunjukkan pegawai unit kerja dalam mendukung program transformasi.', 2, 4, 39, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (165, NULL, 'Tim manajemen perubahan telah menyusun inisiasi ide proyek dan/atau kegiatan serta menyusun laporan kegiatan selama satu tahun.', 'Daftar Rencana Kegiatan', 2, 4, 40, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (166, NULL, 'Tim manajemen perubahan telah mengikuti pelatihan terkait dengan manajemen perubahan yang bisa dibuktikan dengan sertifikat/badge/foto pelatihan kegiatan yang dilakukan.', 'Tangkapan Layar Badge atau Sertifikat Pelatihan', 2, 4, 41, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (167, NULL, 'Pelaksanaan Rapat Kerja pada awal tahun dan menghasilkan agenda kerja tahunan dalam bentuk kalender kegiatan.', 'Dokumentasi atau Laporan Kegiatan', 2, 5, 42, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (168, NULL, 'Dilaksanakan minimal 1 kali dalam satu tahun', 'Dokumentasi atau Laporan Kegiatan', 2, 5, 43, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (169, NULL, 'Dilaksanakan minimal 1 kali dalam satu tahun.', 'Dokumentasi atau Laporan Kegiatan', 2, 5, 44, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (170, NULL, 'Dalam pelaksanaan tugas sehari- hari telah menggunakan Collaboration Tools (rapat online, share dokumen, dll.)', 'Daftar Rekapitulasi Pemanfaatan Collaboration Tools', 2, 6, 45, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (171, NULL, 'Situs online telah sesuai standar DJPb', 'Tangkapan Layar Micro Website', 2, 6, 46, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (172, NULL, '- Whatsapp', 'Tangkapan Layar atau User Media Sosial', 2, 6, 47, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (173, NULL, '- Facebook', 'Tangkapan Layar atau User Media Sosial', 2, 6, 47, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (174, NULL, '- Twitter', 'Tangkapan Layar atau User Media Sosial', 2, 6, 47, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (175, NULL, '- Instagram', 'Tangkapan Layar atau User Media Sosial', 2, 6, 47, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (176, NULL, '- Youtube', 'Tangkapan Layar atau User Media Sosial', 2, 6, 47, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (177, NULL, '- Tiktok', 'Tangkapan Layar atau User Media Sosial', 2, 6, 47, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (178, NULL, 'Tersedia loker pegawai yang telah dilabeli nama pegawai.', 'Dokumentasi Foto', 2, 7, 48, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (179, NULL, 'Terdapat ruang area kerja khusus.', '', 2, 7, 49, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (180, NULL, 'Terdapat ruang kerja khusus.', '', 2, 7, 50, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (181, NULL, 'Tidak terdapat sekat antar meja.', '', 2, 7, 51, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (182, NULL, 'Terdapat area kolaborasi.', '', 2, 7, 52, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (183, NULL, 'Terdapat focus booth.', '', 2, 7, 53, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (184, NULL, 'Terdapat smart TV/LED', '', 2, 7, 54, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (185, NULL, 'Tersedia wifi kemenkeu khusus pegawai dan khusus public.', '', 2, 7, 55, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (186, NULL, 'Tersedia tempat ibadah yang layak pakai.', '', 2, 7, 56, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (187, NULL, 'Terdapat SK pembentukan Tim MKB.', 'Surat Keputusan Pimpinan Unit', 3, 8, 57, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (188, NULL, 'Terdapat hydrant tempel pada tempat rawan dan Lokasi sesuai ketentuan.', 'Dokumentasi Foto', 3, 8, 58, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (189, NULL, 'Terdapat pintu emergency exit yang mudah diakses dan mampu menampung pegawai keluar dalam jumlah banyak.', 'Dokumentasi Foto', 3, 8, 59, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (190, NULL, 'Terdapat rambu tempat titik kumpul pada tempat terbuka yang mudah diakses, terlihat, dan luas/aman.', 'Dokumentasi Foto', 3, 8, 60, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (191, NULL, 'Terdapat info kontak darurat pada telepon kantor yang memuat, daftar RS, pemadam kebakaran, dan kantor polisi terdekat.', 'Dokumentasi Foto', 3, 8, 61, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (192, NULL, 'Terdapat CCTV pada ruang layanan', 'Dokumentasi', 3, 8, 62, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (193, NULL, 'Terdapat Alat Pemadam Api Ringan dengan penempatan yang mudah dijangkau dan belum expired.', 'Dokumentasi', 3, 8, 63, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (194, NULL, 'Terdapat UPS dan server yang masih berfungsi.', 'Dokumentasi', 3, 8, 64, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (195, NULL, 'Terdapat ruang laktasi dilengkapi kursi, meja, lemari es, wastafel, tempat sampah, dan informasi ASI.', 'Dokumentasi Foto', 3, 9, 65, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (196, NULL, 'Terdapat permainan aman, penerangan cukup, pengawasan orang dewasa, dan lokasi mudah diakses.', 'Dokumentasi Foto', 3, 9, 66, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (197, NULL, 'Terdapat toilet terpisah gender yang dilengkapi dengan kloset, kran air, tisu, sabun, wastafel.', 'Dokumentasi Foto', 3, 9, 67, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (198, NULL, 'Terdapat parkir prioritas dengan penanda rambu dan warna khusus.', 'Dokumentasi Foto', 3, 9, 68, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (199, NULL, 'Terdapat guiding block (ubin pengarah (garis) dan ubin peringatan (bulat), setidaknya dari areal parkir sampai dengan depan pintu ruang pelayanan.', 'Dokumentasi Foto', 3, 9, 69, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (200, NULL, 'Memiliki pegangan tangan, rambu, dan penerangan cukup, serta permukaan rata (kemiringan 1:12 sampai 1:20, lebar minimal 1,2 m; panjang maks 9 m).', 'Dokumentasi Foto', 3, 9, 70, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (201, NULL, 'Terdapat toilet difabel dengan pintu geser, dilengkapi panic button, serta dilengkapi pegangan dan pemenuhan kebutuhan toilet lainnya.', 'Dokumentasi Foto', 3, 9, 71, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (202, NULL, 'Terdapat loket khusus prioritas.', 'Dokumentasi Foto', 3, 9, 72, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (203, NULL, 'Terdapat bukti dukung pelatihan PUG.', 'Tangkapan Layar Badge atau Sertifikat Pelatihan', 3, 10, 73, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (204, NULL, 'Unit kerja telah melakukan internalisasi penguatan komponen PUG kepada seluruh pejabat/pegawai KPPN.', 'Dokumentasi atau Laporan Kegiatan', 3, 10, 74, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (205, NULL, 'Pimpinan unit kerja telah membentuk Tim Kerja PUG yang ditetapkan dalam SK.', 'Surat Keputusan Pimpinan Unit', 3, 10, 75, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (206, NULL, 'Tim PUG telah menyusun program kerja implementasi PUG dalam setahun.', 'Daftar Rencana Kerja', 3, 10, 76, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (207, NULL, 'Tim PUG telah melakukan pengolah data gender dan terpilah gender, misalnya gender berdasarkan debitur, dll.', 'Laporan', 3, 10, 77, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (208, NULL, 'Tim PUG telah melakukan publikasi data gender dan terpilah gender sebagai sarana edukasi inklusi gender.', 'Tangkapan Layar Publikasi', 3, 10, 78, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (209, NULL, 'Tim PUG telah mengelola SIPEGIKU dengan lengkap dari profil, ARG, dan komponen lainnya.', 'Laporan SIPEGIKU', 3, 10, 79, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (210, NULL, 'Unit kerja telah memiliki piagam komitmen PUG dan Anti Kekerasan/Pelecehan Seksual yang ditandatangani oleh seluruh pejabat/pegawai KPPN.', 'Piagam Komitmen Bersama', 3, 10, 80, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (213, NULL, 'Laporan PUG telah disampaikan tepat waktu.', 'Laporan PUG', 3, 10, 82, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (214, NULL, 'Unit kerja berpartisipasi dalam penyelenggaraan MPP.', 'Surat tugas/SK Tim/dokumentasi laporan kegiatan', 4, 11, 83, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (215, NULL, 'Terdapat pada template pada slide paparan', 'Sampling Dokumentasi Kegiatan', 4, 12, 84, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (216, NULL, 'Terdapat pada laporan KPPN', 'Sampling Dokumentasi Kegiatan', 4, 12, 84, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (217, NULL, 'Terdapat pada leaflet yang dapat dibawa pulang', 'Sampling Dokumentasi Kegiatan', 4, 12, 84, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (218, NULL, 'Terdapat pada banner atau poster elektronik', 'Sampling Dokumentasi Kegiatan', 4, 12, 84, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (219, NULL, 'Terdapat pada spanduk atau backdrop kegiatan', 'Sampling Dokumentasi Kegiatan', 4, 12, 84, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (220, NULL, 'Terdapat pada kaos kegiatan, pakaian olahraga, dan kalung nametag', 'Sampling Dokumentasi Kegiatan', 4, 12, 84, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (221, NULL, 'Terdapat penggunaan visualisasi DJPb dan InTress sebagai profile picture media sosial resmi unit kerja dan website resmi unit kerja DJPb', 'Dokumentasi Tangkapan Layar', 4, 12, 85, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (222, NULL, 'Terdapat penggunaan tagar #InTress pada media sosial resmi DJPb dan media sosial pegawai pada postingan yang berhubungan dengan tugas dan fungsi DJP', 'Dokumentasi Tangkapan Layar', 4, 12, 85, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (223, NULL, 'Terdapat Backdrop Receptionist yang mempertegas identitas KPPN sebagai Indonesian Treasury pada area pelayanan kantor', 'Dokumentasi Foto', 4, 12, 86, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (224, NULL, 'Terdapat Name Building yang mempertegas identitas KPPN sebagai Indonesian Treasury yang mudah dilihat oleh stakeholders maupun masyarakat luas', 'Dokumentasi Foto', 4, 12, 87, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (225, NULL, 'Terdapat signage office pada area yang memiliki akses langsung dengan jalan utama guna menunjukan adanya unit kerja DJPb (Indonesian Treasury) bagi pengguna jalan atau masyarakat.', 'Dokumentasi Foto', 4, 12, 88, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (226, NULL, 'Memastikan meja kerja bersih dan rapi dan minim penggunaan kertas atau reuse kertas bekas.', 'Dokumentasi Foto', 5, 13, 89, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (227, NULL, 'Terdapat pembentukan Tim Go Green yang dibuktikan dengan SK Tim.', 'Surat Keputusan Pimpinan Unit', 5, 13, 90, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (228, NULL, '1. Terdapat tempat sampah terpilah di dalam gedung, minimal 2 (dua) pembagian organik dan anorganik; dan 2. Terdapat tempat sampah terpilah di luar gedung, minimal 2 pembagian organik dan anorganik.', 'Dokumentasi Foto', 5, 13, 91, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (229, NULL, 'Tersedia dokumentasi pengelolaan sampah organik menjadi kompos.', 'Poster Manual atau Elektronik', 5, 13, 92, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (230, NULL, '1. Tersedia himbauan dan dokumentasi implementasi eco-office termasuk himbauan penggunaan botol minum/tumbler. 2. Terdapat dokumentasi penggunaan tumbler pada rapat, reusable bag, dan alat makan tidak sekali pakai oleh semua pegawai. 3. Terdapat larangan penggunaan plastic di kantor. 4. Terdapat himbauan untuk meminimalir penggunaan kertas. 5. Terdapat himbauan terkait penggunaan kertas bekas.', 'Dokumentasi', 5, 13, 93, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (231, NULL, '1. Terdapat minimal satu lampu sensor pendeteksi gerak pada area toilet atau koridor atau kran sensor. 2. Terdapat penggunaan lampu LED minimal 50% dari total lampu pada kantor. 3. Terdapat himbauan terkait pembatasan penggunaan sistem elevator Gedung (opsional) 4. Terdapat himbauan untuk mematikan keran (penghematan air).', 'Dokumentasi', 5, 13, 94, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (232, NULL, 'Tersedia minimal satu sumur resapan di lingkungan kantor.', 'Dokumentasi Foto', 5, 13, 95, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (233, NULL, 'Tersedia tanda larangan merokok dalam Gedung.', 'Dokumentasi Foto', 5, 13, 96, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (234, NULL, 'Tersedia minimal satu tanaman hidup dalam setiap lantai ruang kerja.', 'Dokumentasi Foto', 5, 13, 97, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (235, NULL, 'Terdapat penguatan kapasitas pegawai mengenai eco-office minimal sekali dalam setahun.', 'Dokumentasi/ Laporan Kegiatan', 5, 13, 98, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (236, NULL, 'Terdapat fasilitas parkir sepeda.', 'Dokumentasi Foto', 5, 13, 99, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.checklist_spml_ref VALUES (237, NULL, '1. Pengelolaan sampah 2. Hemat Listrik 3. Hemat Air', 'Dokumentasi Foto', 5, 13, 100, NULL, NULL, NULL, NULL, NULL, NULL);




--
-- PostgreSQL database dump complete
--

