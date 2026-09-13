export type AKKRegulation = 1 | 2;

export type AKKComponentDetail = {
  nilai: number;
  bobot: number;
  kontribusi: number;
};

export type AKKSideDetail = {
  pb: AKKComponentDetail;
  ck: AKKComponentDetail | null;
  spml: AKKComponentDetail | null;
};

export type PBComponentScoreDetail = {
  komponenId: number;
  komponenTitle: string;
  komponenBobot: number;
  jumlahChecklist: number;
  jumlahNA: number;
  jumlahChecklistPembagi: number;
  totalSkorKonversi: number;
  nilaiRataRata: number;
  nilaiTerbobot: number;
};

export type PBScoreDetail = {
  jumlahChecklist: number;
  jumlahChecklistDiisi: number;
  jumlahNA: number;
  jumlahChecklistPembagi: number;
  totalSkorKonversi: number;
  detailKomponen: PBComponentScoreDetail[];
};

export type AKKScoreResponse = {
  worksheetId: string;
  kppnId: string;
  kppnName: string;
  kppnAlias: string;
  periodId: number;
  periodName: string;
  peraturan: AKKRegulation;
  nilaiKPPN: number;
  nilaiKanwil: number;
  detailKPPN: AKKSideDetail;
  detailKanwil: AKKSideDetail;
  detailPBKPPN: PBScoreDetail;
  detailPBKanwil: PBScoreDetail;
};

export type NilaiAKKError = {
  status: number | null;
  message: string;
};

export type AKKScoreChangedEvent = {
  worksheetId: string;
  source: 'pb' | 'spml' | 'ck';
  changedBy?: string;
  timestamp: string;
};

export type AKKContributorCategory =
  | 'A1_PROVINSI'
  | 'A1_NON_PROVINSI'
  | 'A2'
  | 'SELURUH_KPPN';

export type KPPNTipe = 'A1' | 'A2' | 'Kh' | 'K1' | 'K2' | 'K3';

export type AKKContributorUnit = {
  worksheetId: string;
  kppnId: string;
  name: string;
  alias: string;
  tipe: KPPNTipe | null;
  provinsi: 0 | 1;
  pb: AKKComponentDetail;
  ck: AKKComponentDetail | null;
  spml: AKKComponentDetail | null;
  nilaiAKK: number;
  bobotKPPN: number;
  nilaiPenyumbangLHPS: number;
  detailKomponenPB: PBComponentScoreDetail[];
};

export type AKKContributorGroup = {
  kategori: AKKContributorCategory;
  label: string;
  bobot: number;
  jumlahKPPN: number;
  rataRataAKK: number;
  kontribusiLHPS: number;
  kppn: AKKContributorUnit[];
};

export type AKKContributorLHPSResponse = {
  periodId: number;
  periodName: string;
  peraturan: AKKRegulation;
  jumlahKPPN: number;
  kelompok: AKKContributorGroup[];
  totalNilaiKPPN: number;
  jumlahPembagi: number;
  jumlahNilaiAKKSeluruhKPPN: number;
  jumlahBobotKPPNYangMemenuhi: number;
  nilaiAkhirAspekKinerja: number;
};
