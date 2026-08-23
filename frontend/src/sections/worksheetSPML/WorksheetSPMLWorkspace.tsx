/**
 * Salamaik Client
 * © Kanwil DJPb Sumbar 2024
 */

import { useMemo } from 'react';
import { Typography, Table, Card, CardHeader, TableSortLabel, TableHead, Grow, TableBody, TableRow, TableCell } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useDictionary, { AspekSpmlRefType, SubKomponenSpmlRefType } from '../../hooks/useDictionary';

const TABLE_HEAD = [
  { id: 'no', label: 'No', alignRight: false },
  { id: 'aspek', label: 'Aspek', alignRight: false },
  { id: 'kegiatan', label: 'Kegiatan', alignRight: false },
  { id: 'nilai', label: 'Nilai', alignRight: false },
  { id: 'dokumen', label: 'Dokumen Dukung', alignRight: false },
];


export default function WorksheetSPMLWorkspace() {
  const theme = useTheme();

  const {komponenSpmlRef, subKomponenSpmlRef, aspekSpmlRef, checklistSpmlRef} = useDictionary();

  const tableHead = useMemo(() =>
    TABLE_HEAD.map((headCell) => (
      <TableCell key={headCell.id} align={headCell.id === 'no' ? 'center' : 'left'}>
        <TableSortLabel hideSortIcon>{headCell.label}</TableSortLabel>
      </TableCell>
    )),
    []
  );

  const getAspekSPMLRow = (aspekSpml: AspekSpmlRefType[]) => useMemo(() =>
    aspekSpml.map((row) => {
      const checklist = checklistSpmlRef?.filter((item) => item.aspek_spml_id === row.id) || [];
      const checklist0 = checklist[0];
      const otherChecklist = checklist.length > 1 ? checklist.slice(1) : [];

      return (
        <>
          <TableRow
            key={row.id}
            style={{ display: 'table-row' }}
          >
            <TableCell
              align="left"
              rowSpan={checklist.length}
              sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.secondary,
                fontSize: '12px',
              }}
            >
              {row.urut}
            </TableCell>
            <TableCell
              align="left"
              rowSpan={checklist.length}
              sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.secondary,
                fontSize: '12px',
              }}
            >
              {row.title}
            </TableCell>
            <TableCell
              align="left"
              sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.secondary,
                fontSize: '12px',
              }}
            >
              {checklist0.uraian}
            </TableCell>
            <TableCell
              align="left"
              sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.secondary,
                fontSize: '12px',
              }}
            >
              Nilai
            </TableCell>
            <TableCell
              align="left"
              sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.secondary,
                fontSize: '12px',
              }}
            >
              {checklist0.dokumen}
            </TableCell>
          </TableRow>
          {
            otherChecklist.map((item, id) => (
              <TableRow
                key={id}
                style={{ display: 'table-row' }}
              >
                <TableCell
                  align="left"
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.secondary,
                    fontSize: '12px',
                  }}
                >
                  {item.uraian}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.secondary,
                    fontSize: '12px',
                  }}
                >
                  Nilai
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.secondary,
                    fontSize: '12px',
                  }}
                >
                  {item.dokumen}
                </TableCell>
              </TableRow>
            ))
          }
        </>
      )
    }),[aspekSpmlRef]
  );

  const getSubKomponenSPMLRow = (subKomponen: SubKomponenSpmlRefType[]) => useMemo(() =>
    subKomponen?.map((row) => {
      const aspekSPML = aspekSpmlRef?.filter((item) => item.subkomponen_spml_id=== row.id) || [];

      return (
        <>
          <TableRow
            key={row.id}
            style={{ display: 'table-row' }}
          >
            <TableCell
              align="left"
              colSpan={5}
              sx={{
                backgroundColor: theme.palette.text.main,
                color: theme.palette.text.main,
                fontSize: '12px',
                fontWeight: 'bold',
              }}
              color='secondary'
            >
              {row.title}
            </TableCell>
          </TableRow>
          {getAspekSPMLRow(aspekSPML)}
        </>
      )
    }),
    [subKomponenSpmlRef]
  );

  const komponenSPMLRow = useMemo(() =>
    komponenSpmlRef?.map((row) => {
      const subKomponenSPML = subKomponenSpmlRef?.filter((item) => item.komponen_spml_id === row.id) || [];

      return (
        <>
          <TableRow
            key={row.id}
            style={{ display: 'table-row' }}
          >
            <TableCell
              align="left"
              colSpan={5}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.white.main,
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {row.title}
            </TableCell>
          </TableRow>
          {getSubKomponenSPMLRow(subKomponenSPML)}
        </>
      )
    }),
    [komponenSpmlRef]
  );

  return (
    <>
      <Grow in>
        <Card
          sx={{
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(1),
            mb: 1,
          }}
        >
          <CardHeader
            title={
              <Typography variant='h6' sx={{ mb: 2 }}>
                Kertas Kerja SPML
              </Typography>
            }
          />
          <Table>
            <TableHead>
              <TableRow>{tableHead}</TableRow>
            </TableHead>
            <TableBody>
              {komponenSPMLRow}
            </TableBody>
          </Table>
        </Card>
      </Grow>
    </>
  )
}