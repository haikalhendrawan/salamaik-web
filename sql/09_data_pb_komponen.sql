BEGIN;
ALTER TABLE checklist_ref ALTER COLUMN urut_huruf TYPE TEXT;

INSERT INTO public.komponen_ref (id, title, bobot, detail, alias, peraturan, deleted) VALUES (5, 'TREASURY OPERATION', NULL, NULL, 'Treasury Operation', 2, NULL);
INSERT INTO public.komponen_ref (id, title, bobot, detail, alias, peraturan, deleted) VALUES (6, 'DUKUNGAN REGIONAL ECONOMIST', NULL, NULL, 'Dukungan Regional Economist', 2, NULL);
INSERT INTO public.komponen_ref (id, title, bobot, detail, alias, peraturan, deleted) VALUES (7, 'FINANCIAL ADVISORY', NULL, NULL, 'Financial Advisory', 2, NULL);
INSERT INTO public.komponen_ref (id, title, bobot, detail, alias, peraturan, deleted) VALUES (8, 'DUKUNGAN MANAJEMEN', NULL, NULL, 'Dukungan Manajemen', 2, NULL);

INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (25, 5, 'Likuiditas Keuangan di Daerah', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (26, 5, 'Penyaluran Belanja atas Beban APBN (Instansi Pusat)', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (27, 5, 'Pengelolaan Data Kontrak dan Data Supplier', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (28, 5, 'Digitalisasi Pembayaran', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (29, 5, 'Pelaksanaan dan Monitoring Uang Persediaan (UP)/Tambahan Uang Persediaan (TUP)', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (30, 5, 'Pengelolaan Rekening dan Penerimaan Negara', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (31, 5, 'Verifikasi LPJ Bendahara Satker', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (32, 5, 'Akuntabilitas Pelaporan Keuangan', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (33, 5, 'Sistem Keamanan Informasi dan Teknologi Perbendaharaan', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (34, 5, 'Penyaluran Transfer Ke Daerah (TKD)', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (35, 5, 'Pengelolaan Data Kredit Program di Daerah', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (36, 6, 'Analisa dan Rekomendasi Permasalahan Satker APBN', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (37, 6, 'Analisa dan Rekomendasi Permasalahan Penyaluran Belanja TKD', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (38, 6, 'Analisa Data Penerimaan Fihak Ketiga (PFK)', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (39, 6, 'Amplifikasi Dampak Treasury pada Perekonomian Daerah', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (40, 7, 'CENTRAL GOVERNMENT ADVISORY', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (41, 7, 'LOCAL GOVERNMENT ADVISORY', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (42, 7, 'SPECIAL MISSION', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (43, 8, 'Tata Kelola Organisasi', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (44, 8, 'Manajemen Sumber Daya Manusia', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (45, 8, 'Manajemen Keuangan', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (46, 8, 'Pengelolaan Tata Usaha dan Rumah Tangga', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (47, 8, 'Kepatuhan Internal', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (48, 8, 'Peningkatan Keterbukaan Informasi Publik dan Kehumasan', NULL, NULL);
INSERT INTO public.subkomponen_ref (id, komponen_id, title, detail, deleted) VALUES (49, 8, 'Inovasi dan Prestasi', NULL, NULL);


INSERT INTO public.subsubkomponen_ref (id, komponen_id, subkomponen_id, title, detail, deleted) VALUES (21, 7, 40, 'QUALITY ASSURANCE', NULL, NULL);
INSERT INTO public.subsubkomponen_ref (id, komponen_id, subkomponen_id, title, detail, deleted) VALUES (22, 7, 40, 'Layanan Pengguna', NULL, NULL);
INSERT INTO public.subsubkomponen_ref (id, komponen_id, subkomponen_id, title, detail, deleted) VALUES (23, 7, 40, 'Monitoring dan Evaluasi', NULL, NULL);
INSERT INTO public.subsubkomponen_ref (id, komponen_id, subkomponen_id, title, detail, deleted) VALUES (24, 7, 41, 'Layanan Pengguna', NULL, NULL);
INSERT INTO public.subsubkomponen_ref (id, komponen_id, subkomponen_id, title, detail, deleted) VALUES (25, 7, 41, 'Monitoring dan Evaluasi', NULL, NULL);
INSERT INTO public.subsubkomponen_ref (id, komponen_id, subkomponen_id, title, detail, deleted) VALUES (26, 7, 42, 'Layanan Pengguna', NULL, NULL);
INSERT INTO public.subsubkomponen_ref (id, komponen_id, subkomponen_id, title, detail, deleted) VALUES (27, 7, 42, 'Monitoring dan Evaluasi', NULL, NULL);


COMMIT;