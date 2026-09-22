/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import { OpsiType } from "model/worksheetJunction.model"

type ScoreOption = Pick<OpsiType, 'value'>;

export function getMaximumAvailableScore(
  opsi: ScoreOption[] | null | undefined,
  isStandardisasi = false
): number | null {
  if (isStandardisasi) return 12;

  const scores = (opsi || [])
    .map((item) => Number(item.value))
    .filter(Number.isFinite);

  return scores.length > 0 ? Math.max(...scores) : null;
}

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
