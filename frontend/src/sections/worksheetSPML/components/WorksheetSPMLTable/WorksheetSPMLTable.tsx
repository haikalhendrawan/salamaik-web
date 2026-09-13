import { Fragment, useMemo } from 'react';
import {
  Table,
  TableSortLabel,
  TableHead,
  TableContainer,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
} from '@mui/material';
import useDictionary from '../../../../hooks/useDictionary';
import { useTheme } from '@mui/material';
import {useAuth} from '../../../../hooks/useAuth';
import { SPMLScoreType, WsSPMLJunctionType } from '../../types';
import formatOrderedTitle from '../../../../utils/formatOrderedTitle';
import ScoreFooterCell from './components/ScoreFooterCell';
import SPMLChecklistRow from './components/SPMLChecklistRow';
import WorksheetSPMLTableSkeleton from './components/WorksheetSPMLTableSkeleton';
import useSPMLTableViewModel from './useSPMLTableViewModel';
import { WorksheetType } from '../../../worksheet/types';
import { canEditRegulation2Row, getWorksheetPhase } from '../../../../utils/worksheetPhase';
//-----------------------------------------------------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'no', label: 'No', alignRight: false },
  { id: 'aspek', label: 'Aspek', alignRight: false },
  { id: 'kegiatan', label: 'Kegiatan', alignRight: false },
  { id: 'nilai', label: 'Nilai KPPN', alignRight: false },
  { id: 'nilai_k', label: 'Nilai Kanwil', alignRight: false },
  { id: 'dokumen', label: 'Dokumen Dukung', alignRight: false },
  { id: 'catatan_kanwil', label: 'Catatan Kanwil', alignRight: false },
  {id: 'comment', label: 'Comment', alignRight: false},
];

const COLUMN_WIDTHS = ['4%', '13%', '28%', '7%', '7%', '15%', '20%', '6%'];

interface WorksheetSPMLTable{
  wsSPMLJunction: WsSPMLJunctionType[];
  spmlScore: SPMLScoreType | null;
  isScoreLoading: boolean;
  isInitialLoading: boolean;
  isPastDue: boolean;
  worksheetDetail: WorksheetType | null;
}
//-----------------------------------------------------------------------------------------------------------------

export default function WorksheetSPMLTable({
  wsSPMLJunction,
  spmlScore,
  isScoreLoading,
  isInitialLoading,
  isPastDue,
  worksheetDetail,
}: WorksheetSPMLTable) {
  const {komponenSpmlRef, subKomponenSpmlRef, aspekSpmlRef } = useDictionary();
  const hierarchy = useSPMLTableViewModel(
    komponenSpmlRef,
    subKomponenSpmlRef,
    aspekSpmlRef,
    wsSPMLJunction
  );

  const tableHead = useMemo(() =>
    TABLE_HEAD.map((headCell) => (
      <TableCell
        key={headCell.id}
        align={['no', 'comment'].includes(headCell.id) ? 'center' : 'left'}
        sx={{
          backgroundColor: 'primary.main',
          color: 'common.white',
          '& .MuiTableSortLabel-root': {
            color: 'common.white',
            '&:hover': { color: 'common.white' },
          },
        }}
      >
        <TableSortLabel hideSortIcon>{headCell.label}</TableSortLabel>
      </TableCell>
    )),
    []
  );

  const theme = useTheme();

  const {auth} = useAuth();

  const isKanwil = auth?.kppn?.length === 5;

  const tableRows = useMemo(() => hierarchy.map(({ komponen, subKomponen }) => (
    <Fragment key={komponen.id}>
      <TableRow>
        <TableCell
          align="left"
          colSpan={8}
          sx={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {formatOrderedTitle(komponen.urut, komponen.title)}
        </TableCell>
      </TableRow>
      {subKomponen.map(({ subKomponen: subKomponenItem, aspek }) => (
        <Fragment key={subKomponenItem.id}>
          <TableRow>
            <TableCell
              align="left"
              colSpan={8}
              sx={{
                backgroundColor: theme.palette.text.main,
                color: theme.palette.text.main,
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              color="secondary"
            >
              {formatOrderedTitle(subKomponenItem.urut, subKomponenItem.title)}
            </TableCell>
          </TableRow>
          {aspek.map(({ aspek: aspekItem, checklist }) => (
            <Fragment key={aspekItem.id}>
              {checklist.map((item, index) => (
                <SPMLChecklistRow
                  key={item.junction_id}
                  checklist={item}
                  aspek={index === 0 ? aspekItem : undefined}
                  aspekRowSpan={index === 0 ? checklist.length : undefined}
                  isKanwil={isKanwil}
                  isPastDue={auth?.peraturan === 2
                    ? !canEditRegulation2Row(worksheetDetail, item.kanwil_score, item.excluded)
                    : isPastDue}
                  isFinding={auth?.peraturan === 2 && getWorksheetPhase(worksheetDetail) === 'FOLLOW_UP' && item.excluded !== 1 && (item.kanwil_score === null || item.kanwil_score < 10)}
                />
              ))}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </Fragment>
  )), [auth?.peraturan, hierarchy, isKanwil, isPastDue, worksheetDetail, theme.palette.background.default, theme.palette.text.main, theme.palette.text.primary]);

  return (
    <>
      <TableContainer sx={{ maxHeight: 800 }}>
        <Table stickyHeader sx={{ width: '100%', tableLayout: 'fixed' }}>
          <colgroup>
            {COLUMN_WIDTHS.map((width, index) => (
              <col key={TABLE_HEAD[index].id} style={{ width }} />
            ))}
          </colgroup>
          <TableHead>
            <TableRow>{tableHead}</TableRow>
          </TableHead>
          <TableBody>
            {isInitialLoading ? (
              <WorksheetSPMLTableSkeleton />
            ) : wsSPMLJunction.length > 0 ? (
              tableRows
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  Checklist SPML belum tersedia
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={3}
                sx={{ fontWeight: 'bold', color: 'text.primary', backgroundColor: 'background.default' }}
              >
                Total Nilai
              </TableCell>
              <ScoreFooterCell
                value={spmlScore?.detailKPPN.totalSkorKonversi}
                detail={spmlScore?.detailKPPN}
                loading={isInitialLoading || isScoreLoading}
                label="KPPN"
              />
              <ScoreFooterCell
                value={spmlScore?.detailKanwil.totalSkorKonversi}
                detail={spmlScore?.detailKanwil}
                loading={isInitialLoading || isScoreLoading}
                label="Kanwil"
              />
              <TableCell colSpan={3} sx={{ backgroundColor: 'background.default' }} />
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={3}
                sx={{ fontWeight: 'bold', color: 'text.primary', backgroundColor: 'background.default' }}
              >
                Rata-Rata Total Nilai
              </TableCell>
              <ScoreFooterCell
                value={spmlScore?.nilaiKPPN}
                detail={spmlScore?.detailKPPN}
                loading={isInitialLoading || isScoreLoading}
                label="KPPN"
              />
              <ScoreFooterCell
                value={spmlScore?.nilaiKanwil}
                detail={spmlScore?.detailKanwil}
                loading={isInitialLoading || isScoreLoading}
                label="Kanwil"
              />
              <TableCell colSpan={3} sx={{ backgroundColor: 'background.default' }} />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  )
}
