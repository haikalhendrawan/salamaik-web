import {useState, useEffect} from'react';
import {Stack, Toolbar, Typography, Table, Card, CardHeader, TableSortLabel,
          Tooltip, TableHead, Grow, TableBody, TableRow, TableCell} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Label from '../../../components/label';
// ---------------------------------------------------
const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 72,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const TABLE_HEAD = [
  { id: 'no', label: 'No', alignRight: false },
  { id: 'komponen', label: 'Nama Komponen', alignRight: false },
  { id: 'totalKomponen', label: 'Total Nilai', alignRight: false },
  { id: 'bilanganPembagi', label: 'Bilangan Pembagi*', alignRight: false },
  { id: 'averageScore', label: 'Rata-Rata Nilai**', alignRight: false },
  { id: 'bobot', label: 'Bobot Nilai***', alignRight: false },
  { id: 'weightedScore', label: 'Nilai Tertimbang', alignRight: false },
];

interface RekapitulasiNilaiData{
  id: number,
  komponen: string,
  totalKomponen: number,
  bilanganPembagi: number,
  averageScore?: number,
  bobot?: number,
  weightedScore?: number,
};

const TABLE_DATA: RekapitulasiNilaiData[] = [
  {id:1, komponen:'Treasurer', totalKomponen: 140, bilanganPembagi:14, averageScore:10, bobot: 20, weightedScore: 20},
  {id:2, komponen:'Pengelola Fiskal, Representasi Kemenkeu di Daerah, dan Special Mission', totalKomponen: 100, bilanganPembagi:10, averageScore:10, bobot: 30, weightedScore: 30},
  {id:3, komponen:'Financial Advisor', totalKomponen: 210, bilanganPembagi:21, averageScore:10, bobot: 20, weightedScore: 20},
  {id:4, komponen:'Tata Kelola Internal', totalKomponen: 150, bilanganPembagi:15, averageScore:10, bobot: 30, weightedScore: 30},
];

// ----------------------------------------------------------------------------------
export default function RekapitulasiNilaiTable() {
  const theme = useTheme();

  return (
    <>
      <Grow in>
        <Card sx={{height:'auto', display:'flex', flexDirection:'column', gap:theme.spacing(1), mb: 1}}>
          <CardHeader title={<Typography variant='h6'>Rekapitulasi Penilaian Kinerja KPPN</Typography>} sx={{mb:2}}/>

          <Table>
            <TableHead>
              <TableRow>
                {TABLE_HEAD.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.alignRight ? 'right' : 'left'}
                  >
                    <TableSortLabel hideSortIcon>
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {TABLE_DATA.map((row) => 
                <TableRow hover key={row.id} tabIndex={-1}>
                  <TableCell align="justify">{row.id}</TableCell>

                  <TableCell align="left">{row.komponen}</TableCell>

                  <TableCell align="left">{row.totalKomponen}</TableCell>

                  <TableCell align="left">{`${row.bilanganPembagi}`}</TableCell>

                  <TableCell align="left">
                    {`${row.averageScore}`}
                  </TableCell> 

                  <TableCell align="left">
                    <Label color={'success'}>
                    {`${row.bobot}%`}
                    </Label>
                  </TableCell>

                  <TableCell align="left">
                    {row.weightedScore}
                  </TableCell> 
                </TableRow>
              )}

              <TableRow>
                <TableCell colSpan={4} />
                <TableCell colSpan={2} align='left' sx={{backgroundColor: theme.palette.warning.main, fontWeight:'bold'}}>
                  Nilai Akhir
                </TableCell>
                <TableCell align='left' sx={{fontWeight:'bold', backgroundColor: theme.palette.warning.main}}>
                  10.00
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </Grow>

      <Stack direction='column' spacing={1} sx={{pl: 2}}>
        <Typography variant='body2' sx={{fontSize: '12px'}}>*Jumlah komponen yang memenuhi kondisi KPPN</Typography>
        <Typography variant='body2' sx={{fontSize: '12px'}}>**Total Nilai kertas kerja dibagi jumlah checklist kertas kerja</Typography>
        <Typography variant='body2' sx={{fontSize: '12px'}}>***Ditentukan Dasar Hukum Pembinaan</Typography>
      </Stack>

    </>
  )
}