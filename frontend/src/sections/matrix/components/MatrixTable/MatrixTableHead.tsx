/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {  TableSortLabel, TableHead, TableRow, TableCell} from '@mui/material';
import { useTheme} from '@mui/material/styles';

// ---------------------------------------------------
const TABLE_HEAD = [
  { id: 'no', label: 'No', alignRight: false, width: '5%' },
  { id: 'komponen', label: 'Komponen Supervisi', alignRight: false, width: '10%' },
  { id: 'hasil', label: 'Hasil Implementasi', alignRight: false, width: '15%' },
  { id: 'permasalahan', label: 'Permasalahan (Apabila Ada)', alignRight: false , width: '15%'},
  { id: 'rekomendasi', label: 'Rekomendasi Atas Permasalahan', alignRight: false , width: '15%'},
  { id: 'peraturan', label: 'Peraturan Terkait', alignRight: false, width: '10%' },
  { id: 'pic', label: 'PIC', alignRight: false, width: '5%' },
  { id: 'tindakLanjut', label: 'Tindak lanjut', alignRight: false, width: '15%' },
  { id: 'statusTL', label: 'Status Tindak Lanjut', alignRight: false , width: '5%'},
  { id: 'action', label: 'Action', alignRight: true, width: '5%' },
];
// ---------------------------------------------------
export default function MatrixTableHead() {
  const theme = useTheme();

  return (
    <TableHead>
      <TableRow>
        {TABLE_HEAD.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            width={headCell.width}
            sx={{backgroundColor: theme.palette.grey[200]}}
          >
            <TableSortLabel hideSortIcon>
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
  </TableHead>
  )
}
