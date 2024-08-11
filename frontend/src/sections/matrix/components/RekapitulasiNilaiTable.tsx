import {useState, useEffect} from'react';
import {Stack, Toolbar, Typography, Table, Card, CardHeader, TableSortLabel, IconButton, TableHead, Grow, TableBody, TableRow, TableCell} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Label from '../../../components/label';
import { MatrixScoreAndProgressType } from '../types';
import Iconify from '../../../components/iconify/Iconify';
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

interface RekapitulasiNilaiTableProps{
  matrixScore: MatrixScoreAndProgressType | null,
  kppnName: string
}

// ----------------------------------------------------------------------------------
export default function RekapitulasiNilaiTable({matrixScore, kppnName}: RekapitulasiNilaiTableProps) {
  const theme = useTheme();

  const [value, setValue] = useState<number>(0);

  const scoreVersion = value === 0 ? matrixScore?.scorePerKomponenKPPN : matrixScore?.scorePerKomponen;

  const title = (
    <>
    <Stack direction={'row'} alignItems="center">
      <IconButton 
        disabled={value===0?true:false} 
        sx={{height:'40px', width:'40px', visibility: value==1?'visible':'hidden'}}
        onClick={() => setValue(0)}
      >
        <Iconify icon={'eva:arrow-ios-back-outline'}/> 
      </IconButton>

      <Stack direction='column'>
        <Typography variant='h6'>Rekapitulasi Penilaian Kinerja KPPN</Typography>
        <Typography variant='body3' sx={{fontWeight: 'normal'}}>Berdasarkan {value===1?'Penilaian Kanwil' : 'Self Assessment'}</Typography>
      </Stack>

      <IconButton
        disabled={value===1?true:false}   
        sx={{height:'40px', width:'40px', visibility: value==1?'hidden':'visible' }}
        onClick={() => setValue(1)}
      >
        <Iconify icon={'eva:arrow-ios-forward-outline'} />
      </IconButton>
    </Stack> 
      
    </>
  )

  return (
    <>
      <Grow in>
        <Card sx={{height:'auto', display:'flex', flexDirection:'column', gap:theme.spacing(1), mb: 1}}>
          <CardHeader title={title} sx={{mb:2, gap: 0}}/>

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
              {scoreVersion?.map((item, index) => 
                <TableRow hover key={index} tabIndex={-1}>
                  <TableCell align="justify">{index+1}</TableCell>

                  <TableCell align="left">{item?.komponenTitle}</TableCell>

                  <TableCell align="left">{item?.totalNilai?.toFixed(2)}</TableCell>

                  <TableCell align="left">{`${item?.bilanganPembagi}`}</TableCell>

                  <TableCell align="left">
                    {`${item?.avgPerKomponen?.toFixed(2)}`}
                  </TableCell> 

                  <TableCell align="left">
                    <Label color={'success'}>
                    {`${item?.komponenBobot?.toFixed(2)}%`}
                    </Label>
                  </TableCell>

                  <TableCell align="left">
                    {item?.weightedScore?.toFixed(2)}
                  </TableCell> 
                </TableRow>
              )}

              <TableRow>
                <TableCell colSpan={4} />
                <TableCell colSpan={2} align='left' sx={{backgroundColor: theme.palette.warning.main, fontWeight:'bold'}}>
                  Nilai Akhir
                </TableCell>
                <TableCell align='left' sx={{fontWeight:'bold', backgroundColor: theme.palette.warning.main}}>
                  {value===0?matrixScore?.scoreByKPPN?.toFixed(2):matrixScore?.scoreByKanwil?.toFixed(2)}
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