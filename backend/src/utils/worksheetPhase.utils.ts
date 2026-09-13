import ErrorDetail from '../model/error.model';
import worksheet, { WorksheetType } from '../model/worksheet.model';

export type WorksheetPhase = 'NOT_OPEN' | 'FILLING' | 'WAITING_FOLLOW_UP' | 'FOLLOW_UP' | 'FINAL';

const time = (value: Date | string | null | undefined) => value ? new Date(value).getTime() : Number.NaN;

export function getWorksheetPhase(item: WorksheetType, now = new Date()): WorksheetPhase {
  const current = now.getTime();
  if (current < time(item.open_period)) return 'NOT_OPEN';
  if (current <= time(item.close_period)) return 'FILLING';
  if (current < time(item.open_follow_up)) return 'WAITING_FOLLOW_UP';
  if (current <= time(item.close_follow_up)) return 'FOLLOW_UP';
  return 'FINAL';
}

export function isRegulation2Finding(kanwilScore: number | null, excluded: number): boolean {
  return excluded !== 1 && (kanwilScore === null || kanwilScore < 10);
}

export function createWorksheetReadState<T extends { kanwil_score: number | null; excluded: number }>(
  rows: T[], item: WorksheetType, peraturan: number, role: number
) {
  const phase = getWorksheetPhase(item);
  const isKanwil = [3, 4, 99].includes(role);
  const mappedRows = rows.map((row) => {
    const isFinding = peraturan === 2 && isRegulation2Finding(row.kanwil_score, row.excluded);
    const editable = phase === 'FILLING' || (phase === 'FOLLOW_UP' && isFinding);
    return {
      ...row,
      isFinding,
      permissions: {
        editKPPNScore: editable && !isKanwil,
        editKanwilScore: editable && isKanwil,
        editDocument: editable,
        editKPPNNote: editable && !isKanwil,
        editKanwilNote: editable && isKanwil,
        editComment: editable,
      },
    };
  });
  return {
    rows: mappedRows,
    meta: { phase, isFollowUpPeriod: phase === 'FOLLOW_UP', jumlahTemuan: mappedRows.filter((row) => row.isFinding).length },
  };
}

export async function assertWorksheetMutationAllowed({
  worksheetId, peraturan, kanwilScore, excluded,
}: { worksheetId: string; peraturan: number; kanwilScore: number | null; excluded: number }): Promise<WorksheetPhase> {
  if (peraturan !== 2) return 'FILLING';
  const worksheetRows = await worksheet.getById(worksheetId);
  if (!worksheetRows.length) throw new ErrorDetail(404, 'Worksheet not found');
  const phase = getWorksheetPhase(worksheetRows[0]);
  if (phase === 'FILLING') return phase;
  if (phase === 'FOLLOW_UP' && isRegulation2Finding(kanwilScore, excluded)) return phase;
  if (phase === 'FOLLOW_UP') throw new ErrorDetail(409, 'Checklist ini bukan lagi temuan dan sudah dikunci');
  throw new ErrorDetail(409, 'Worksheet tidak dapat diedit pada periode ini');
}
