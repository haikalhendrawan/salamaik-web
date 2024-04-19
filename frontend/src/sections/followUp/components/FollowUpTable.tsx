import {useState, useEffect} from'react';
import { Link } from 'react-router-dom';
import {Stack, Toolbar, Typography, Table, Card, CardHeader, TableSortLabel,
        TableHead, Grow, TableBody, TableRow, TableCell, Button} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify/Iconify';
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

interface FollowUpData{
  id: number,
  komponen: string,
  checklist: string,
  finding: string,
  pic: string,
  status: number,
};

const TABLE_DATA: FollowUpData[] = [
  {
    id: 1,
    komponen: 'Treasurer',
    checklist: 'Digitalisasi Pembayaran',
    finding: 'Tren KKP Digipay Fluktuatif',
    pic: 'MSKI/PDMS',
    status: 0,
  },
  {
    id: 2,
    komponen: 'Treasurer',
    checklist: 'Penyaluran atas Beban APBN',
    finding: 'Belum terdapat karya tulis pada media massa tingkat nasional/regional, terdapat karya tulis dengan judul insentif fiskal wujud Apresiasi Pemerintah atas Kinerja keuangan daerah dengan penulis Ika Sari Heniyatun dimuat pada tanggal media sosial kantor tanggal 15 November 2023',
    pic: 'Umum',
    status: 1,
  },
  {
    id: 3,
    komponen: 'Treasurer',
    checklist: 'Digitalisasi Pembayaran',
    finding: 'Tren KKP Digipay Fluktuatif',
    pic: 'MSKI/PDMS',
    status: 0,
  },
];

// ----------------------------------------------------------------------------------
export default function FollowUpTable() {
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
              {TABLE_DATA.map((row) => 
                <TableRow hover key={row.id} tabIndex={-1}>
                  <TableCell align="justify" sx={{fontSize: '13px'}}>{row.id}</TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>{row.komponen}</TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>{row.checklist}</TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>{`${row.finding}`}</TableCell>

                  <TableCell align="left">
                    {row.status===0
                      ? <Label color={'error'}> Belum </Label>
                      : <Label color={'success'}> approved </Label>
                    }
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    {`${row.pic}`}
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
          <Typography variant='body2' sx={{fontSize: '12px'}}>1. Belum: belum ditindaklanjuti KPPN (belum terhitung progress)</Typography>
          <Typography variant='body2' sx={{fontSize: '12px'}}>2. Process: proses verifikasi Kanwil </Typography>
          <Typography variant='body2' sx={{fontSize: '12px'}}>3. Reject: tindak lanjut ditolak Kanwil </Typography>
          <Typography variant='body2' sx={{fontSize: '12px'}}>4. Approved: tindak lanjut disetujui Kanwil </Typography>
        </Stack>
      </Grow>
    </>
  )
}