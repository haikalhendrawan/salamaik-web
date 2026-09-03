import { PoolClient } from 'pg';
import pool from '../../src/config/db';
import wsCKJunction from '../../src/model/wsCKJunction.model';

jest.mock('../../src/config/db', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

const queryMock = pool.query as jest.MockedFunction<typeof pool.query>;

describe('WsCKJunction model', () => {
  beforeEach(() => {
    queryMock.mockReset();
  });

  it('returns joined CK rows with options and active comment count query', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] } as never);

    await wsCKJunction.getByWorksheetId('worksheet-id');

    const [query, params] = queryMock.mock.calls[0];
    expect(query).toContain('FROM worksheet_ck_junction AS junction');
    expect(query).toContain('FROM opsi_ck_ref AS opsi');
    expect(query).toContain('komentar.ws_ck_junction_id = junction.junction_id');
    expect(params).toEqual(['worksheet-id']);
  });

  it('aggregates KPPN and Kanwil progress for every worksheet in a period', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] } as never);

    await wsCKJunction.getProgressAllByPeriod(4);

    const [query, params] = queryMock.mock.calls[0];
    expect(query).toContain('COUNT(junction.junction_id)::int AS "jumlahChecklist"');
    expect(query).toContain('junction.kppn_score IS NOT NULL OR junction.excluded = 1');
    expect(query).toContain('junction.kanwil_score IS NOT NULL OR junction.excluded = 1');
    expect(params).toEqual([4]);
  });

  it('updates both scores to 10 atomically when KPPN selects N/A', async () => {
    queryMock.mockResolvedValueOnce({
      rows: [{ kppn_score: 10, kanwil_score: 10, excluded: 1 }],
    } as never);

    const result = await wsCKJunction.updateKPPNScore(
      12,
      'worksheet-id',
      10,
      1,
      'User KPPN'
    );

    const [query, params] = queryMock.mock.calls[0];
    expect(query).toContain('kppn_score = CASE WHEN $2 = 1 THEN 10 ELSE $1 END');
    expect(query).toContain('kanwil_score = CASE WHEN $2 = 1 THEN 10 ELSE kanwil_score END');
    expect(params).toEqual([10, 1, 'User KPPN', 12, 'worksheet-id']);
    expect(result).toMatchObject({ kppn_score: 10, kanwil_score: 10, excluded: 1 });
  });

  it('updates both scores to 10 atomically when Kanwil selects N/A', async () => {
    queryMock.mockResolvedValueOnce({
      rows: [{ kppn_score: 10, kanwil_score: 10, excluded: 1 }],
    } as never);

    await wsCKJunction.updateKanwilScore(13, 'worksheet-id', 10, 1, 'User Kanwil');

    const [query] = queryMock.mock.calls[0];
    expect(query).toContain('kanwil_score = CASE WHEN $2 = 1 THEN 10 ELSE $1 END');
    expect(query).toContain('kppn_score = CASE WHEN $2 = 1 THEN 10 ELSE kppn_score END');
  });

  it('assigns active CK checklists using the selected regulation', async () => {
    const transactionQuery = jest.fn().mockResolvedValue({ rows: [{ junction_id: 1 }] });
    const client = { query: transactionQuery } as unknown as PoolClient;

    const result = await wsCKJunction.assignWorksheet('worksheet-id', 2, client);

    const [query, params] = transactionQuery.mock.calls[0];
    expect(query).toContain('INSERT INTO worksheet_ck_junction');
    expect(query).toContain('komponen.peraturan = $2');
    expect(query).toContain('ON CONFLICT (worksheet_id, checklist_ck_id) DO NOTHING');
    expect(params).toEqual(['worksheet-id', 2]);
    expect(result).toEqual([{ junction_id: 1 }]);
  });

  it('only fills file_1 when the CK junction has no server file', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] } as never);

    const result = await wsCKJunction.addFile(
      10,
      'worksheet-id',
      'ck-document.pdf',
      'User'
    );

    const [query] = queryMock.mock.calls[0];
    expect(query).toContain('AND file_1 IS NULL');
    expect(result).toBeUndefined();
  });
});
