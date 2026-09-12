import { useMemo } from 'react';
import {
  AspekSpmlRefType,
  KomponenSpmlRefType,
  SubKomponenSpmlRefType,
} from '../../../../hooks/useDictionary';
import { WsSPMLJunctionType } from '../../types';

export interface SPMLAspekViewModel {
  aspek: AspekSpmlRefType;
  checklist: WsSPMLJunctionType[];
}

export interface SPMLSubKomponenViewModel {
  subKomponen: SubKomponenSpmlRefType;
  aspek: SPMLAspekViewModel[];
}

export interface SPMLKomponenViewModel {
  komponen: KomponenSpmlRefType;
  subKomponen: SPMLSubKomponenViewModel[];
}

const appendToMap = <T,>(map: Map<number, T[]>, key: number, value: T) => {
  const values = map.get(key);
  if (values) values.push(value);
  else map.set(key, [value]);
};

export default function useSPMLTableViewModel(
  komponenRef: KomponenSpmlRefType[] | null,
  subKomponenRef: SubKomponenSpmlRefType[] | null,
  aspekRef: AspekSpmlRefType[] | null,
  junctions: WsSPMLJunctionType[]
) {
  return useMemo<SPMLKomponenViewModel[]>(() => {
    if (!komponenRef || !subKomponenRef || !aspekRef) return [];

    const subKomponenByKomponen = new Map<number, SubKomponenSpmlRefType[]>();
    const aspekBySubKomponen = new Map<number, AspekSpmlRefType[]>();
    const junctionByAspek = new Map<number, WsSPMLJunctionType[]>();

    subKomponenRef.forEach((item) => {
      appendToMap(subKomponenByKomponen, item.komponen_spml_id, item);
    });
    aspekRef.forEach((item) => {
      appendToMap(aspekBySubKomponen, item.subkomponen_spml_id, item);
    });
    junctions.forEach((item) => {
      appendToMap(junctionByAspek, item.aspek_spml_id, item);
    });

    return komponenRef.map((komponen) => ({
      komponen,
      subKomponen: (subKomponenByKomponen.get(komponen.id) ?? []).map((subKomponen) => ({
        subKomponen,
        aspek: (aspekBySubKomponen.get(subKomponen.id) ?? []).map((aspek) => ({
          aspek,
          checklist: junctionByAspek.get(aspek.id) ?? [],
        })),
      })),
    }));
  }, [aspekRef, junctions, komponenRef, subKomponenRef]);
}
