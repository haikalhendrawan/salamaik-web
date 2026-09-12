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
