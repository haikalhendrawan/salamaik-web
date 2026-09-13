import { WorksheetType } from '../sections/worksheet/types';

export type WorksheetPhase = 'NOT_OPEN' | 'FILLING' | 'WAITING_FOLLOW_UP' | 'FOLLOW_UP' | 'FINAL';

export function getWorksheetPhase(worksheet: WorksheetType | null, now = Date.now()): WorksheetPhase {
  if (!worksheet || now < new Date(worksheet.open_period).getTime()) return 'NOT_OPEN';
  if (now <= new Date(worksheet.close_period).getTime()) return 'FILLING';
  if (now < new Date(worksheet.open_follow_up).getTime()) return 'WAITING_FOLLOW_UP';
  if (now <= new Date(worksheet.close_follow_up).getTime()) return 'FOLLOW_UP';
  return 'FINAL';
}

export function canEditRegulation2Row(worksheet: WorksheetType | null, kanwilScore: number | null, excluded: number): boolean {
  const phase = getWorksheetPhase(worksheet);
  return phase === 'FILLING' || (phase === 'FOLLOW_UP' && excluded !== 1 && (kanwilScore === null || kanwilScore < 10));
}
