import { Fragment, useMemo } from 'react';
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../../../hooks/useAuth';
import formatOrderedTitle from '../../../../utils/formatOrderedTitle';
import { CKScoreType, WsCKJunctionType } from '../../types';
import CommentActionCK from './components/CommentActionCK';
import FileActionsCK from './components/FileActionsCK';
import ScoreSelectCK from './components/ScoreSelectCK';
import ScoreFooterCellCK from './components/ScoreFooterCellCK';
import KanwilNoteCK from './components/KanwilNoteCK';

const HEADERS = [
  'No',
  'Materi',
  'Kriteria Penilaian',
  'Dokumen',
  'Nilai KPPN',
  'Nilai Kanwil',
  'Catatan Kanwil',
  'Comment',
];

const BodyCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 12,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  verticalAlign: 'top',
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
}));

const COLUMN_WIDTHS = ['4%', '15%', '20%', '17%', '9%', '9%', '20%', '6%'];

export default function WorksheetCKTable({
  rows,
  isPastDue,
  ckScore,
  isScoreLoading,
}: {
  rows: WsCKJunctionType[];
  isPastDue: boolean;
  ckScore: CKScoreType | null;
  isScoreLoading: boolean;
}) {
  const { auth } = useAuth();
  const isKanwil = auth?.kppn?.length === 5;
  const groupedRows = useMemo(() => {
    const groups = new Map<number, WsCKJunctionType[]>();
    rows.forEach((row) => groups.set(row.komponen_ck_id, [...(groups.get(row.komponen_ck_id) || []), row]));
    return Array.from(groups.values());
  }, [rows]);

  return (
    <TableContainer sx={{ maxHeight: 800 }}>
      <Table stickyHeader sx={{ width: '100%', tableLayout: 'fixed' }}>
        <colgroup>
          {COLUMN_WIDTHS.map((width, index) => (
            <col key={HEADERS[index]} style={{ width }} />
          ))}
        </colgroup>
        <TableHead>
          <TableRow>
            {HEADERS.map((header, index) => (
              <TableCell
                key={header}
                align={[0, 4, 5, 7].includes(index) ? 'center' : 'left'}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'common.white',
                  fontWeight: 700,
                  px: 1,
                  whiteSpace: 'normal',
                  overflowWrap: 'break-word',
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {groupedRows.map((componentRows) => {
            const component = componentRows[0];
            return (
              <Fragment key={component.komponen_ck_id}>
                <TableRow>
                  <TableCell
                    colSpan={8}
                    sx={{ bgcolor: 'grey.200', color: 'text.primary', fontWeight: 700, fontSize: 12 }}
                  >
                    {formatOrderedTitle(component.komponen_urut, component.komponen_title)}
                  </TableCell>
                </TableRow>
                {componentRows.map((row) => (
                  <TableRow key={row.junction_id} id={`ck-checklist-${row.junction_id}`} hover>
                    <BodyCell align="center">{row.checklist_urut}</BodyCell>
                    <BodyCell>{row.materi}</BodyCell>
                    <BodyCell>
                      <Stack spacing={1}>
                        <Typography variant="body2" fontSize={12} fontWeight={600}>
                          {row.kriteria_penilaian}
                        </Typography>
                        {[...(row.opsi || [])]
                          .sort((left, right) => left.urut - right.urut)
                          .map((option) => (
                            <Typography key={option.id} variant="body2" fontSize={12}>
                              <strong>{`Nilai ${option.value} – ${option.label}`}</strong>
                              {option.description ? `: ${option.description}` : ''}
                            </Typography>
                          ))}
                      </Stack>
                    </BodyCell>
                    <BodyCell>
                      <FileActionsCK checklist={row} disabled={isPastDue} />
                    </BodyCell>
                    <BodyCell align="center">
                      <ScoreSelectCK checklist={row} scoreType="kppn" disabled={isKanwil || isPastDue} />
                    </BodyCell>
                    <BodyCell align="center">
                      <ScoreSelectCK checklist={row} scoreType="kanwil" disabled={!isKanwil || isPastDue} />
                    </BodyCell>
                    <BodyCell>
                      <KanwilNoteCK checklist={row} isPastDue={isPastDue} />
                    </BodyCell>
                    <BodyCell align="center">
                      <CommentActionCK
                        junctionId={row.junction_id}
                        initialCount={Number(row.comment_count) || 0}
                        disabled={isPastDue}
                      />
                    </BodyCell>
                  </TableRow>
                ))}
              </Fragment>
            );
          })}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ fontSize: 12 }}>
                Data worksheet CK belum tersedia.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} align="center" sx={{ bgcolor: 'grey.200', fontWeight: 700, color: 'text.primary' }}>
              Total Nilai
            </TableCell>
            <ScoreFooterCellCK
              value={ckScore?.detailKPPN.totalSkorKonversi}
              detail={ckScore?.detailKPPN}
              loading={isScoreLoading}
              label="KPPN"
            />
            <ScoreFooterCellCK
              value={ckScore?.detailKanwil.totalSkorKonversi}
              detail={ckScore?.detailKanwil}
              loading={isScoreLoading}
              label="Kanwil"
            />
            <TableCell colSpan={2} sx={{ bgcolor: 'grey.200' }} />
          </TableRow>
          <TableRow>
            <TableCell colSpan={4} align="center" sx={{ bgcolor: 'grey.200', fontWeight: 700, color: 'text.primary' }}>
              Nilai Kertas Kerja CK
            </TableCell>
            <ScoreFooterCellCK
              value={ckScore?.nilaiKPPN}
              detail={ckScore?.detailKPPN}
              loading={isScoreLoading}
              label="KPPN"
              decimals={2}
            />
            <ScoreFooterCellCK
              value={ckScore?.nilaiKanwil}
              detail={ckScore?.detailKanwil}
              loading={isScoreLoading}
              label="Kanwil"
              decimals={2}
            />
            <TableCell colSpan={2} sx={{ bgcolor: 'grey.200' }} />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
