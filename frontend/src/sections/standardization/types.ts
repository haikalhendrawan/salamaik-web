/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

export interface StandardizationType{
  id: number;
  title: string;
  cluster: number;
  cluster_name?: string;
  interval: number;
  interval_name?: string;
  list:[
    StandardizationJunctionType[],
    StandardizationJunctionType[],
    StandardizationJunctionType[],
    StandardizationJunctionType[],
    StandardizationJunctionType[],
    StandardizationJunctionType[]
  ],
  score: number,
  short: number[]
};

export interface StandardizationJunctionType{
  id: number;
  kppn_id: number;
  period_id: number;
  standardization_id: number
  month: number;
  file: string;
  uploaded_at: string
};

export interface StandardizationDasarType{
  id: number,
  dasar: string,
  active: boolean,
  date: string,
  current: boolean
};

export interface ClusteredStandardizationType{
  cluster: number;
  cluster_name: string;
  data: StandardizationType[]
};