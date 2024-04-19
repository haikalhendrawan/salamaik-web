import {useState, useEffect} from'react';
import {Stack, Toolbar, Typography, Table, Card, TableContainer, TableSortLabel,
          Tooltip, TableHead, Grow, TableBody, TableRow, TableCell} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Label from '../../../components/label';
// ---------------------------------------------------
const TABLE_HEAD = [
  { id: 'komponen', label: 'Komponen Supervisi', alignRight: false },
  { id: 'hasil', label: 'Hasil Implementasi', alignRight: false },
  { id: 'permasalahan', label: 'Permasalahan', alignRight: false },
  { id: 'rekomendasi', label: 'Rekomendasi Atas Permasalahan', alignRight: false },
  { id: 'peraturan', label: 'Peraturan Terkait', alignRight: false },
  { id: 'pic', label: 'PIC', alignRight: false },
];

interface FollowUpHeaderData{
  id: number,
  komponen: string | number,
  subKomponen: string | number,
  hasil: string | null,
  permasalahan: string | null,
  rekomendasi: string | null,
  peraturan: string | null,
  pic: string | null,
  tindakLanjut: string | null,
  statusTL: number | null
};

const TABLE_DATA: FollowUpHeaderData[] = [
  {
    id:1, 
    komponen:'Treasurer', 
    subKomponen: 'Penyaluran atas Beban APBN', 
    hasil: 'Terdapat Karya Tulis oleh pegawai KPPN yang diterbitkan di media massa tingkat nasional', 
    permasalahan: 'Belum terdapat karya tulis pada media massa tingkat nasional/regional, terdapat karya tulis dengan judul insentif fiskal wujud Apresiasi Pemerintah atas Kinerja keuangan daerah dengan penulis Ika Sari Heniyatun dimuat pada tanggal media sosial kantor tanggal 15 November 2023',
    rekomendasi: 'Agar dapat dihasilkan karya tulis pegawai yang dimuat pada media massa nasional. KPPN dapat menginisiasi kegiatan untuk meningkatkan minat menulis pegawai (FGD, sharing session, dll)',
    peraturan: 'PP 61 Tahun 2010, Kertas Kerja PER-1/PB/2023',
    pic: 'umum',
    tindakLanjut: 'Karya tulis a.n Ika Sari Heniyatun diterbitkan pada tanggal 15 November 2023 telah diupload pada media nasional. Dokumen terlampir',
    statusTL: 1
  },
];

// ----------------------------------------------------------------------------------
export default function FollowUpHeader() {
  const theme = useTheme();

  return (
    <>
        <Card sx={{height:'auto', display:'flex', flexDirection:'column', gap:theme.spacing(1), mb: 1}}>
          <Table stickyHeader>
            <TableHead >
              <TableRow >
                {TABLE_HEAD.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.alignRight ? 'right' : 'left'}
                    sx={{backgroundColor: theme.palette.grey[200]}}
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

                  <TableCell align="left" >
                    <Typography variant='body2' fontWeight={'bold'} sx={{fontSize: '12px'}}>{row.komponen}</Typography>
                    <Typography variant='body2' sx={{fontSize: '12px'}}>{row.subKomponen}</Typography>
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '12px'}}>{row.hasil}</TableCell>

                  <TableCell align="left" sx={{fontSize: '12px'}}>{row.permasalahan}</TableCell>

                  <TableCell align="left" sx={{fontSize: '12px'}} >{row.rekomendasi}</TableCell>

                  <TableCell align="left" sx={{fontSize: '12px'}}>{row.peraturan}</TableCell>

                  <TableCell align="left" sx={{fontSize: '12px'}}>{row.pic}</TableCell>

                </TableRow>
              )}

            </TableBody>
          </Table>
        </Card>
    </>
  )
}