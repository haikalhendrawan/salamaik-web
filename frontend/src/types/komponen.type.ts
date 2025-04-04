export interface KomponenType{
  id: number,
  title: string,
  bobot: number,
  detail: string | null,
  alias: string
};

export interface SubKomponenType{
  id: number,
  title: string,
  komponen_id: number,
  detail: string | null,
  alias: string
};

export interface SubSubKomponenType{
  id: number;
  komponen_id: number;
  subkomponen_id: number;
  title: number;
  detail: string | null;
}