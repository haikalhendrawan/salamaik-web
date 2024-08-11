import {useState, useEffect} from'react';
import { Link } from 'react-router-dom';
import {Stack, Toolbar, Typography, Table, Card, CardHeader, TableSortLabel,
        TableHead, Grow, TableBody, TableRow, TableCell, Button} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify/Iconify';
import { FindingsResponseType } from '../types';
// ---------------------------------------------------
const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 72,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  height: '30px', 
  width: '90px', 
  fontSize:'12px', 
  display: 'inline-flex',   
  alignItems: 'center', 
  justifyContent: 'center', 
  paddingRight: 0,
  paddingLeft: 0,
  borderRadius: '8px'
})) as typeof Button;  

const TABLE_HEAD = [
  { id: 'no', label: 'No', alignRight: false },
  { id: 'komponen', label: 'Komponen', alignRight: false },
  { id: 'checklist', label: 'Checklist', alignRight: false },
  { id: 'finding', label: 'Permasalahan', alignRight: false },
  { id: 'status', label: 'Status*', alignRight: false },
  { id: 'pic', label: 'PIC', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface FollowUpTableProps{
  findings: FindingsResponseType[] | [],
}

// ----------------------------------------------------------------------------------
export default function FollowUpTable({findings}: FollowUpTableProps) {
  const theme = useTheme();

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
              {findings.map((item, index) => 
                <TableRow hover key={item.id} tabIndex={-1}>
                  <TableCell align="justify" sx={{fontSize: '13px'}}>{index+1}</TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    <Typography variant='body2' fontWeight={'bold'} fontSize={'13px'}>Komponen {item.matrixDetail[0]?.komponen_string}</Typography>
                    <Typography variant='body2' fontSize={'13px'}>Subkomponen {item.matrixDetail[0]?.subkomponen_string}</Typography>
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    {item.matrixDetail[0].checklist[0].matrix_title}
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>{item.matrixDetail[0].permasalahan}</TableCell>

                  <TableCell align="left">
                    {item.status===0
                      ? <Label color={'error'}> Belum </Label>
                      : item.status===1
                        ? <Label color={'warning'}> Proses </Label>
                        : item.status===2
                          ? <Label color={'error'}> Ditolak </Label>
                          : <Label color={'success'}> Disetujui </Label>
                    }
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    {item.matrixDetail[0].uic}
                  </TableCell> 

                  <TableCell align="left">
                    <Stack>
                      <StyledButton
                        endIcon={<Iconify icon="eva:arrow-ios-forward-outline" />} 
                        variant="contained" 
                        color="warning"
                        component={Link}  
                        to={`/followUp/detail?id=010`}
                      >
                        Follow Up
                      </StyledButton>
                    </Stack>
                  </TableCell> 
                </TableRow>
              )}

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