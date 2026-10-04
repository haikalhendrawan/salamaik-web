import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { FindingsResponseType } from '../types';
import useDictionary from '../../../hooks/useDictionary';
import { WsJunctionType } from '../../worksheet/types';
import formatNumberedList from '../../../utils/formatNumberedList';
import Dokumen from './FollowUpCard/Dokumen';
import Nilai from './FollowUpCard/Nilai';
import Catatan from './FollowUpCard/Catatan';
import Approval from './FollowUpCard/Approval';
import CommentActionCK from '../../worksheetCK/components/WorksheetCKTable/components/CommentActionCK';
import CommentActionSPML from '../../worksheetSPML/components/WorksheetSPMLTable/components/CommentAction';

interface Props {
  finding: FindingsResponseType;
  getData: () => Promise<void>;
  isDisabled: boolean;
}

type ChecklistSnapshot = {
  urut?: number | string | null;
  checklist_urut?: number | string | null;
  materi?: string | null;
  uraian?: string | null;
  kriteria_penilaian?: string | null;
  aspek_spml_id?: number;
};

type JunctionSnapshot = {
  junction_id: number;
  checklist_urut?: number | string | null;
  comment_count?: number;
};

const CK_HEADERS = ['No', 'Materi', 'Kriteria Penilaian', 'Dokumen', 'Nilai KPPN', 'Nilai Kanwil', 'Tanggapan KPPN', 'Catatan Kanwil', 'Comment', 'Tindak Lanjut'];
const SPML_HEADERS = ['No', 'Aspek', 'Kegiatan', 'Nilai KPPN', 'Nilai Kanwil', 'Dokumen Dukung', 'Tanggapan KPPN', 'Catatan Kanwil', 'Comment', 'Tindak Lanjut'];
const CK_WIDTHS = ['4%', '11%', '16%', '9%', '6%', '6%', '15%', '15%', '5%', '13%'];
const SPML_WIDTHS = ['5%', '8%', '17%', '5%', '5%', '9%', '15%', '15%', '5%', '16%'];

/** Detail follow-up CK/SPML memakai susunan tabel worksheet sumber dengan satu baris checklist. */
export default function FollowUpWorksheetTable({ finding, getData, isDisabled }: Props) {
  const { aspekSpmlRef } = useDictionary();
  const detail = finding.matrixDetail?.[0];
  const checklist = detail?.checklist?.[0] as unknown as ChecklistSnapshot | undefined;
  const junction = detail?.ws_junction?.[0] as unknown as (WsJunctionType & JunctionSnapshot) | undefined;
  const isCK = finding.worksheet_type === 'CK';
  const headers = isCK ? CK_HEADERS : SPML_HEADERS;
  const widths = isCK ? CK_WIDTHS : SPML_WIDTHS;
  const aspect = !isCK ? aspekSpmlRef?.find((item) => item.id === checklist?.aspek_spml_id) : undefined;
  const number = isCK
    ? (junction?.checklist_urut ?? checklist?.checklist_urut ?? checklist?.urut ?? '-')
    : (aspect?.urut ?? '-');
  const subject = isCK ? checklist?.materi : aspect?.title;
  const content = isCK ? checklist?.kriteria_penilaian : checklist?.uraian;
  const scoreColumns = isCK ? [4, 5] : [3, 4];
  const ckOptions = (detail?.opsi || []) as unknown as Array<{
    id: number;
    value: number;
    title?: string;
    label?: string;
    description?: string | null;
  }>;

  return (
    <Stack spacing={2}>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 1450, width: '100%', tableLayout: 'fixed' }}>
          <colgroup>
            {widths.map((width, index) => <col key={headers[index]} style={{ width }} />)}
          </colgroup>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell
                  key={header}
                  align={index === 0 || scoreColumns.includes(index) || index === 8 ? 'center' : 'left'}
                  sx={{ bgcolor: 'primary.main', color: 'common.white', fontWeight: 700, fontSize: 12, whiteSpace: 'normal' }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover>
              <TableCell align="center" sx={{ fontSize: 12 }}>{number}</TableCell>
              <TableCell sx={{ fontSize: 12 }}>{subject || '-'}</TableCell>
              {isCK ? (
                <TableCell sx={{ verticalAlign: 'top' }}>
                  <Typography variant="body2" fontSize={12} fontWeight={600} sx={{ mb: 1 }}>
                    {checklist?.kriteria_penilaian || ''}
                  </Typography>
                  {ckOptions.map((option) => (
                    <Typography key={option.id} variant="body2" fontSize={12} sx={{ mb: 0.5 }}>
                      <strong>Nilai {option.value} — {option.label || option.title || ''}</strong>
                      {option.description ? `: ${option.description}` : ''}
                    </Typography>
                  ))}
                </TableCell>
              ) : (
                <TableCell sx={{ fontSize: 12, whiteSpace: 'pre-line' }}>
                  {formatNumberedList(content || '') || '-'}
                </TableCell>
              )}
              {!isCK && (
                <>
                  <TableCell align="center" sx={{ verticalAlign: 'top' }}>
                    <Nilai findingResponse={finding} getData={getData} isDisabled={isDisabled} scoreSide="kppn" />
                  </TableCell>
                  <TableCell align="center" sx={{ verticalAlign: 'top' }}>
                    <Nilai findingResponse={finding} getData={getData} isDisabled={isDisabled} scoreSide="kanwil" />
                  </TableCell>
                </>
              )}
              <TableCell sx={{ verticalAlign: 'top' }}>
                <Dokumen openInstruction={() => undefined} findingResponse={finding} getData={getData} isDisabled={isDisabled} />
              </TableCell>
              {isCK && (
                <>
                  <TableCell align="center" sx={{ verticalAlign: 'top' }}>
                    <Nilai findingResponse={finding} getData={getData} isDisabled={isDisabled} scoreSide="kppn" />
                  </TableCell>
                  <TableCell align="center" sx={{ verticalAlign: 'top' }}>
                    <Nilai findingResponse={finding} getData={getData} isDisabled={isDisabled} scoreSide="kanwil" />
                  </TableCell>
                </>
              )}
              <TableCell sx={{ verticalAlign: 'top', minWidth: 250 }}>
                <Catatan findingResponse={finding} getData={getData} isDisabled={isDisabled} responseSide="kppn" />
              </TableCell>
              <TableCell sx={{ verticalAlign: 'top', minWidth: 250 }}>
                <Catatan findingResponse={finding} getData={getData} isDisabled={isDisabled} responseSide="kanwil" />
              </TableCell>
              <TableCell align="center" sx={{ verticalAlign: 'top' }}>
                {isCK ? (
                  <CommentActionCK junctionId={junction?.junction_id || 0} initialCount={junction?.comment_count || 0} disabled={isDisabled} />
                ) : (
                  <CommentActionSPML wsSPMLJunctionId={junction?.junction_id || 0} initialCommentCount={junction?.comment_count || 0} isPastDue={isDisabled} />
                )}
              </TableCell>
              <TableCell sx={{ verticalAlign: 'top', minWidth: 170 }}>
                <Approval findingResponse={finding} getData={getData} isDisabled={isDisabled} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
