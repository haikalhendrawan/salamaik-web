/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {Stack, Typography, Table, Card, CardHeader, TableSortLabel,
        TableHead, Grow, TableBody, TableRow, TableCell} from '@mui/material';
import { useTheme} from '@mui/material/styles';
import { FindingsResponseType } from '../../../followUp/types';
// ---------------------------------------------------
const TABLE_HEAD = [
  { id: 'no', label: 'No', alignRight: false },
  { id: 'checklist', label: 'Checklist', alignRight: false },
  { id: 'hasil', label: 'Hasil Implementasi', alignRight: false },
  { id: 'permasalahan', label: 'Permasalahan', alignRight: false },
  { id: 'rekomendasi', label: 'Rekomendasi', alignRight: false },
  { id: 'peraturan', label: 'Peraturan', alignRight: false },
  { id: 'pic', label: 'PIC', alignRight: false },
  { id: 'nilai', label: 'Nilai', alignRight: false },
  { id: 'subkomponen', label: 'Subkomponen', alignRight: false },
];

interface FollowUpTableProps{
  findings: FindingsResponseType[] | [],
  kppnId: string | null
}

// ----------------------------------------------------------------------------------
export default function FollowUpTable({findings}: FollowUpTableProps) {
  const theme = useTheme();

  const refKomponen = Array(...new Set(findings.map((item) => item.matrixDetail[0].komponen_string)));

  const numberedFindings = findings.map((item, index) => ({
    ...item,
    nomor: index + 1
  }));

  const refSubKomponen =  refKomponen.map((k) => {
    const findingsByKomponen = findings.filter(f => f.matrixDetail[0].komponen_string === k);
    const subkomponen = Array(...new Set(findingsByKomponen.map((item) => item.matrixDetail[0].subkomponen_string)));

    return ({
      komponen: k,
      subkomponen: subkomponen
    }
    )
  })

  return (
    <>
      <Grow in>
      <Card sx={{height:'auto', display:'flex', flexDirection:'column', gap:theme.spacing(1), mb: 1}}>
        <CardHeader title={<Typography variant='h6'>Rekapitulasi Permasalahan</Typography>} sx={{mb:2}}/>

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
            {
              refSubKomponen.map((item, index) => 
                (
                  <>
                    <TableRow hover key={index} tabIndex={-1} sx={{backgroundColor: theme.palette.warning.main}}>
                      <TableCell align="justify" colSpan={TABLE_HEAD.length}>
                        <Typography fontWeight={'bold'} fontSize={'0.9rem'}>
                          Komponen {item.komponen}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {
                        numberedFindings.filter(f => f.matrixDetail[0].komponen_string === item.komponen).map((item) =>{
                          return (
                            <>
                              <TableRow hover key={item.id} tabIndex={-1}>
                                <TableCell align="justify" sx={{fontSize: '13px'}}>{item.nomor}</TableCell>

                                <TableCell align="left" sx={{fontSize: '13px'}}>
                                  {item.matrixDetail[0].checklist[0].matrix_title}
                                </TableCell>

                                <TableCell align="left" sx={{fontSize: '13px'}}>
                                  {item.matrixDetail[0].hasil_implementasi}
                                </TableCell>

                                <TableCell align="left" sx={{fontSize: '13px'}}>
                                  {item.matrixDetail[0].permasalahan}
                                </TableCell>

                                <TableCell align="left" sx={{fontSize: '13px'}}>
                                  {item.matrixDetail[0].rekomendasi}
                                </TableCell>

                                <TableCell align="left" sx={{fontSize: '13px'}}>
                                  {item.matrixDetail[0].peraturan}
                                </TableCell>

                                <TableCell align="left" sx={{fontSize: '13px'}}>
                                  {item.matrixDetail[0].uic}
                                </TableCell> 

                                <TableCell align="left" sx={{fontSize: '13px'}}>
                                  {item.matrixDetail[0].ws_junction[0].kanwil_score}
                                </TableCell> 

                                <TableCell align="left" sx={{fontSize: '13px'}}>
                                  {item.matrixDetail[0].subkomponen_string}
                                </TableCell> 
                              </TableRow>
                            </>  
                          ) 
                        } 
                        )
                    }
                  </>                 
                )
              )
            }

          </TableBody>
        </Table>
      </Card>
      </Grow>

      <Grow in>
        <Stack direction='column' spacing={1} sx={{pl: 2}}>
          <Typography variant='body2' fontWeight='bold' sx={{fontSize: '12px'}}>*Status:</Typography>
          <Typography variant='body2' sx={{fontSize: '12px'}}>1. Belum: belum ditindaklanjuti KPPN </Typography>
          <Typography variant='body2' sx={{fontSize: '12px'}}>2. Proses: sudah ditindaklanjuti & proses verifikasi Kanwil </Typography>
          <Typography variant='body2' sx={{fontSize: '12px'}}>3. Ditolak: tindak lanjut ditolak Kanwil </Typography>
          <Typography variant='body2' sx={{fontSize: '12px'}}>4. Disetujui: tindak lanjut disetujui Kanwil </Typography>
        </Stack>
      </Grow>
    </>
  )
}