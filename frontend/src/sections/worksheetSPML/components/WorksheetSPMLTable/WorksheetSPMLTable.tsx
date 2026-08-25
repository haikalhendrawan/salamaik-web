import { Fragment, useMemo } from 'react';
import { Table, TableSortLabel, TableHead, TableContainer, TableBody, TableRow, TableCell } from '@mui/material';
import useDictionary from '../../../../hooks/useDictionary';
import { AspekSpmlRefType, SubKomponenSpmlRefType } from '../../../../hooks/useDictionary';
import { useTheme, styled } from '@mui/material';
import formatNumberedList from '../../../../utils/formatNumberedList';
import ScoreSelect from './components/ScoreSelect';
import {useAuth} from '../../../../hooks/useAuth';
import FileActions from './components/FileActions';
import { WsSPMLJunctionType } from '../../types';
import formatOrderedTitle from '../../../../utils/formatOrderedTitle';

//-----------------------------------------------------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'no', label: 'No', alignRight: false },
  { id: 'aspek', label: 'Aspek', alignRight: false },
  { id: 'kegiatan', label: 'Kegiatan', alignRight: false },
  { id: 'nilai', label: 'Nilai KPPN', alignRight: false },
  { id: 'nilai_k', label: 'Nilai Kanwil', alignRight: false },
  { id: 'dokumen', label: 'Dokumen Dukung', alignRight: false },
];

const StyledTableCell = styled(TableCell)(({theme}) => ({
  fontSize: "12px",
  textAlign: "left",
  color: theme.palette.text.secondary
}));

interface WorksheetSPMLTable{
  wsSPMLJunction: WsSPMLJunctionType[]
}

//-----------------------------------------------------------------------------------------------------------------

export default function WorksheetSPMLTable({wsSPMLJunction}: WorksheetSPMLTable) {
  const {komponenSpmlRef, subKomponenSpmlRef, aspekSpmlRef } = useDictionary();

  const tableHead = useMemo(() =>
    TABLE_HEAD.map((headCell) => (
      <TableCell
        key={headCell.id}
        align={headCell.id === 'no' ? 'center' : 'left'}
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

  const getAspekSPMLRow = (aspekSpml: AspekSpmlRefType[]) =>
    aspekSpml.map((row) => {
      const checklist = wsSPMLJunction?.filter((item) => item.aspek_spml_id === row.id) || [];
      const checklist0 = checklist[0];
      const otherChecklist = checklist.length > 1 ? checklist.slice(1) : [];

      if (!checklist0) {
        return null;
      }

      return (
        <Fragment key={row.id}>
          <TableRow
            id={`spml-checklist-${checklist0.junction_id}`}
            style={{ display: 'table-row' }}
          >
            <StyledTableCell
              rowSpan={checklist.length}
            >
              {row.urut}
            </StyledTableCell>
            <StyledTableCell
              rowSpan={checklist.length}
            >
              {row.title}
            </StyledTableCell>
            <StyledTableCell>
              {formatNumberedList(checklist0.uraian)}
            </StyledTableCell>
            <StyledTableCell>
              <ScoreSelect checklist={checklist0} scoreType="kppn" disabled={isKanwil} />
            </StyledTableCell>
            <StyledTableCell>
              <ScoreSelect checklist={checklist0} scoreType="kanwil" disabled={!isKanwil} />
            </StyledTableCell>
            <StyledTableCell>
              <FileActions checklist={checklist0} />
            </StyledTableCell>
          </TableRow>
          {
            otherChecklist.map((item) => (
              <TableRow
                key={item.id}
                id={`spml-checklist-${item.junction_id}`}
                style={{ display: 'table-row' }}
              >
                <StyledTableCell>
                  {formatNumberedList(item.uraian)}
                </StyledTableCell>
                <StyledTableCell>
                  <ScoreSelect checklist={item} scoreType="kppn" disabled={isKanwil} />
                </StyledTableCell>
                <StyledTableCell>
                  <ScoreSelect checklist={item} scoreType="kanwil" disabled={!isKanwil} />
                </StyledTableCell>
                <StyledTableCell>
                  <FileActions checklist={item} />
                </StyledTableCell>
              </TableRow>
            ))
          }
        </Fragment>
      )
  });

  const getSubKomponenSPMLRow = (subKomponen: SubKomponenSpmlRefType[]) => 
    subKomponen?.map((row) => {
      const aspekSPML = aspekSpmlRef?.filter((item) => item.subkomponen_spml_id=== row.id) || [];

      return (
        <Fragment key={row.id}>
          <TableRow
            style={{ display: 'table-row' }}
          >
            <TableCell
              align="left"
              colSpan={6}
              sx={{
                backgroundColor: theme.palette.text.main,
                color: theme.palette.text.main,
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              color='secondary'
            >
              {formatOrderedTitle(row.urut, row.title)}
            </TableCell>
          </TableRow>
          {getAspekSPMLRow(aspekSPML)}
        </Fragment>
      )
  });

  const komponenSPMLRow = () =>
    komponenSpmlRef?.map((row) => {
      const subKomponenSPML = subKomponenSpmlRef?.filter((item) => item.komponen_spml_id === row.id) || [];

      return (
        <Fragment key={row.id}>
          <TableRow
            style={{ display: 'table-row' }}
          >
            <TableCell
              align="left"
              colSpan={6}
              sx={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {formatOrderedTitle(row.urut, row.title)}
            </TableCell>
          </TableRow>
          {getSubKomponenSPMLRow(subKomponenSPML)}
        </Fragment>
      )
  });

  return (
    <>
      <TableContainer sx={{ maxHeight: 800 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>{tableHead}</TableRow>
          </TableHead>
          <TableBody>
            {komponenSPMLRow()}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
