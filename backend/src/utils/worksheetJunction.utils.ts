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

export function validateScore(
  score: number,
  opsi: OpsiType[] | null,
  isStandardisasi: boolean,
  peraturan: number
) {
  if (!Number.isFinite(score)) return false;

  if (isStandardisasi) return score >= 0 && score <= 12;
  if (!opsi?.length || score < 0) return false;
  if (score > 10 && !(score === 15 && peraturan === 2)) return false;

  return opsi.some((item) => Number(item.value) === score);
}
