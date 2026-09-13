import { getWorksheetPhase, isRegulation2Finding } from '../../src/utils/worksheetPhase.utils';
import { WorksheetType } from '../../src/model/worksheet.model';

const worksheet = {
  open_period: new Date('2026-01-01T00:00:00.000Z'),
  close_period: new Date('2026-01-31T23:59:59.000Z'),
  open_follow_up: new Date('2026-02-10T00:00:00.000Z'),
  close_follow_up: new Date('2026-02-28T23:59:59.000Z'),
} as WorksheetType;

describe('worksheetPhase utilities', () => {
  it.each([
    ['2025-12-31T23:59:59.000Z', 'NOT_OPEN'],
    ['2026-01-01T00:00:00.000Z', 'FILLING'],
    ['2026-02-05T00:00:00.000Z', 'WAITING_FOLLOW_UP'],
    ['2026-02-10T00:00:00.000Z', 'FOLLOW_UP'],
    ['2026-03-01T00:00:00.000Z', 'FINAL'],
  ])('maps %s to %s', (now, expected) => {
    expect(getWorksheetPhase(worksheet, new Date(now))).toBe(expected);
  });

  it('treats null and scores below 10 as findings, except N/A', () => {
    expect(isRegulation2Finding(null, 0)).toBe(true);
    expect(isRegulation2Finding(0, 0)).toBe(true);
    expect(isRegulation2Finding(5, 0)).toBe(true);
    expect(isRegulation2Finding(10, 0)).toBe(false);
    expect(isRegulation2Finding(null, 1)).toBe(false);
  });
});
