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
  const isRegulation2Finding = selectedFindings?.matrix_id == null && Boolean(selectedFindings?.worksheet_type);
  const checklist = selectedFindings?.matrixDetail?.[0]?.checklist?.[0] as unknown as { materi?: string; title?: string; uraian?: string } | undefined;
  const isCK = selectedFindings?.worksheet_type === 'CK';
  const finding = selectedFindings;

  if (isRegulation2Finding) {
    const rows = [
      ['Kertas Kerja', `Kertas Kerja ${selectedFindings?.worksheet_type}`],
      [isCK ? 'Materi' : 'Aspek / Kegiatan', isCK ? (checklist?.materi || checklist?.title) : (checklist?.uraian || checklist?.title)],
      ['Permasalahan', finding?.finding_description],
      ['Rekomendasi', finding?.rekomendasi_snapshot],
      ['Peraturan Terkait', finding?.peraturan_snapshot],
      ['UIC', finding?.uic_snapshot],
    ];
    return (
      <Card sx={{ overflow: 'auto', mb: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>{rows.map(([label]) => <TableCell key={label} sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700 }}>{label}</TableCell>)}</TableRow>
          </TableHead>
          <TableBody>
            <TableRow>{rows.map(([label, value]) => <TableCell key={label} sx={{ fontSize: 12, verticalAlign: 'top' }}>{value || '-'}</TableCell>)}</TableRow>
          </TableBody>
        </Table>
      </Card>
    );
  }

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
