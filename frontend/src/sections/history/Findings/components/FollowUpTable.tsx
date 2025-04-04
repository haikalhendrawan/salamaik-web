/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { useState} from 'react';
import {Stack, Typography, Table, Card, CardHeader, TableSortLabel,
        TableHead, Grow, TableBody, TableRow, TableCell, Button} from '@mui/material';
import { useTheme} from '@mui/material/styles';
import ExcelPrintout from './ExcelPrintout';
import { DerivedFindingsType } from '../../../../types/findings.type';
import Iconify from '../../../../components/iconify';
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
  isFinal: boolean | null,
  nonFinalFindings: DerivedFindingsType[] | null,
  finalFindings: DerivedFindingsType[] | null, 
  kppnId: string | null,
  period: number
}

// ----------------------------------------------------------------------------------
export default function FollowUpTable({isFinal, nonFinalFindings, finalFindings, kppnId, period}: FollowUpTableProps) {
  const theme = useTheme();

  const [showFinal, setShowFinal] = useState<boolean>(isFinal || false);

  const allowFinalState = isFinal && showFinal;

  const findings = allowFinalState ? finalFindings : nonFinalFindings;

  const refKomponen = Array(...new Set(findings?.map((item) => item.komponen.title)));

  const handleChangeFinal = (final: boolean) => {
    if(isFinal){
      setShowFinal(final);
    }
  };

  const numberedFindings = findings?.map((item, index) => ({
    ...item,
    nomor: index + 1
  }));

  const refSubKomponen =  refKomponen.map((k) => {
    const findingsByKomponen = findings?.filter(f => f.komponen.title === k);
    const subkomponen = Array(...new Set(findingsByKomponen?.map((item) => item.subkomponen.title)));

    return ({
      komponen: k,
      subkomponen: subkomponen
    }
    )
  });

  return (
    <>
      <Grow in>
      <Card sx={{height:'auto', display:'flex', flexDirection:'column', gap:theme.spacing(1), mb: 1}}>
        <CardHeader 
          title={
            <>
              <Stack direction="row"  justifyContent={'space-between'} maxWidth={'100%'}>
                <Typography variant='h6'>{`Rekapitulasi Permasalahan ${allowFinalState ? '(Final)' : '(Non-Final)'}`}</Typography>
                <ExcelPrintout kppnId={kppnId || ""} period={period}/>
              </Stack>
            </>
          } 
          sx={{mb:2}}
        />

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
                        numberedFindings?.filter(f => f.komponen.title === item.komponen).map((item) =>{
                          return (
                            <>
                              <TableRow hover key={item.id} tabIndex={-1}>
                                <TableCell align="justify" sx={{fontSize: '13px'}}>{item.nomor}</TableCell>

                                <TableCell align="left" sx={{fontSize: '13px'}}>
                                  {item.checklist.title}
                                </TableCell>

                                <TableCell align="left" sx={{fontSize: '13px'}}>
                                  {item.matrix.hasil_implementasi}
                                </TableCell>

                                <TableCell align="left" sx={{fontSize: '13px'}}>
                                  {item.matrix.permasalahan}
                                </TableCell>

                                <TableCell align="left" sx={{fontSize: '13px'}}>
                                  {item.matrix.rekomendasi}
                                </TableCell>

                                <TableCell align="left" sx={{fontSize: '13px'}}>
                                  {item.matrix.peraturan}
                                </TableCell>

                                <TableCell align="left" sx={{fontSize: '13px'}}>
                                  {item.matrix.uic}
                                </TableCell> 

                                <TableCell align="left" sx={{fontSize: '13px'}}>
                                  {item.ws_junction.kanwil_score}
                                </TableCell> 

                                <TableCell align="left" sx={{fontSize: '13px'}}>
                                  {item.subkomponen.title}
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
      
      {
        isFinal ? showFinal 
          ? (
              <Button 
                variant='contained' 
                endIcon={<Iconify icon="solar:eye-bold-duotone" />} 
                sx={{mt: 2}}
                onClick={() => handleChangeFinal(false)}
              >
                Show Permasalahan Non Final
              </Button>
            )
          : (
              <Button 
                variant='contained' 
                endIcon={<Iconify icon="solar:eye-closed-bold-duotone" />} 
                sx={{mt: 2}}
                onClick={() => handleChangeFinal(true)}
              >
                Hide Permasalahan Non Final
              </Button>
            )
        : null
      }
      {/* <Grow in>
        <Stack direction='column' spacing={1} sx={{pl: 2}}>
          <Typography variant='body2' fontWeight='bold' sx={{fontSize: '12px'}}>*Status:</Typography>
          <Typography variant='body2' sx={{fontSize: '12px'}}>1. Belum: belum ditindaklanjuti KPPN </Typography>
          <Typography variant='body2' sx={{fontSize: '12px'}}>2. Proses: sudah ditindaklanjuti & proses verifikasi Kanwil </Typography>
          <Typography variant='body2' sx={{fontSize: '12px'}}>3. Ditolak: tindak lanjut ditolak Kanwil </Typography>
          <Typography variant='body2' sx={{fontSize: '12px'}}>4. Disetujui: tindak lanjut disetujui Kanwil </Typography>
        </Stack>
      </Grow> */}
    </>
  )
}