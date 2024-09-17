/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {Typography, Table, Card, TableSortLabel, TableHead, TableBody, TableRow, TableCell} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FindingsResponseType } from '../types';
// ---------------------------------------------------
const TABLE_HEAD = [
  { id: 'komponen', label: 'Komponen Supervisi', alignRight: false },
  { id: 'hasil', label: 'Hasil Implementasi', alignRight: false },
  { id: 'permasalahan', label: 'Permasalahan', alignRight: false },
  { id: 'rekomendasi', label: 'Rekomendasi Atas Permasalahan', alignRight: false },
  { id: 'peraturan', label: 'Peraturan Terkait', alignRight: false },
  { id: 'pic', label: 'PIC', alignRight: false },
];

interface FollowUpHeaderProps{
  selectedFindings: FindingsResponseType | null
}

// ----------------------------------------------------------------------------------
export default function FollowUpHeader({selectedFindings}: FollowUpHeaderProps) {
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
                <TableRow key={selectedFindings?.id} tabIndex={-1}>

                  <TableCell align="left" >
                    <Typography variant='body2' fontWeight={'bold'} sx={{fontSize: '12px'}}>{selectedFindings?.matrixDetail[0]?.komponen_string}</Typography>
                    <Typography variant='body2' sx={{fontSize: '12px'}}>{selectedFindings?.matrixDetail[0]?.subkomponen_string}</Typography>
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '12px'}}>{selectedFindings?.matrixDetail[0]?.hasil_implementasi}</TableCell>

                  <TableCell align="left" sx={{fontSize: '12px'}}>{selectedFindings?.matrixDetail[0]?.permasalahan}</TableCell>

                  <TableCell align="left" sx={{fontSize: '12px'}} >{selectedFindings?.matrixDetail[0]?.rekomendasi}</TableCell>

                  <TableCell align="left" sx={{fontSize: '12px'}}>{selectedFindings?.matrixDetail[0]?.peraturan}</TableCell>

                  <TableCell align="left" sx={{fontSize: '12px'}}>{selectedFindings?.matrixDetail[0]?.uic}</TableCell>

                </TableRow>
            </TableBody>
          </Table>
        </Card>
    </>
  )
}