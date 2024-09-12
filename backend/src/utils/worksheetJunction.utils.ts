/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import { OpsiType } from "model/worksheetJunction.model"

export function validateScore(score: number, opsi: OpsiType[] | null, isStandardisasi: boolean){

  const scoreIsOutOfRange = isStandardisasi ? (score<0 || score>12) : (score<0 || score>10);
  const scoreIsNotANumber = isNaN(score) || score===null || score===undefined;
  const opsiIsNotAvailable = isStandardisasi ? false : (!opsi || opsi.length===0);
  const scoreNotIncludedInOpsi = isStandardisasi ? false :  !(opsi?.some((item) => item?.value===score));
  
  if(scoreIsOutOfRange || scoreIsNotANumber || opsiIsNotAvailable || scoreNotIncludedInOpsi){
    return false
  };

  return true
}