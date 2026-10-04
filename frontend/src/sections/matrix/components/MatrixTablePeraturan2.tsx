import { useState } from 'react';
import { Button, Card, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import Iconify from '../../../components/iconify';
import { Regulation2MatrixRow, Regulation2WorksheetType } from '../types';
import useExcelMatrixPeraturan2 from '../../excel/useExcelMatrixPeraturan2';
import MatrixTablePeraturan2EditModal from './MatrixTablePeraturan2EditModal';

const HEADERS = ['No', 'No. pada Kertas Kerja', 'Komponen Supervisi', 'Hasil Implementasi di Lapangan', 'Permasalahan', 'Rekomendasi atas Permasalahan', 'Peraturan/Ketentuan Terkait', 'PIC Subbag/Seksi', 'Tindak Lanjut Atas Permasalahan', 'Status Penyelesaian Tindak Lanjut', 'Aksi'];
const SECTIONS: { key: Regulation2WorksheetType; label: string }[] = [
  { key: 'PB', label: 'Proses Bisnis' }, { key: 'SPML', label: 'Sarana dan Prasarana Mutu Layanan' }, { key: 'CK', label: 'Capaian Kinerja' },
];

interface Props {
  rows: Regulation2MatrixRow[];
  kppnName: string;
  periodName: string;
  getMatrix: () => Promise<void>;
  canEdit: boolean;
}

export default function MatrixTablePeraturan2({ rows, kppnName, periodName, getMatrix, canEdit }: Props) {
  const excel = useExcelMatrixPeraturan2(rows, kppnName, periodName);
  const [selectedRow, setSelectedRow] = useState<Regulation2MatrixRow | null>(null);
  let number = 0;
  return <Card>
    <Stack direction="row" alignItems="center" sx={{ p: 2 }}>
      <Typography variant="subtitle1">Temuan aktif ({rows.length})</Typography><span style={{ flex: 1 }} />
      <Button variant="text" endIcon={<Iconify icon="vscode-icons:file-type-excel" />} onClick={() => void excel.generate()}>Export</Button>
    </Stack>
    <TableContainer><Table sx={{ minWidth: 1580 }} size="small">
      <TableHead><TableRow>{HEADERS.map((header) => <TableCell key={header} align="center" sx={{ fontSize: 12, fontWeight: 700, whiteSpace: 'normal' }}>{header}</TableCell>)}</TableRow></TableHead>
      <TableBody>
        {SECTIONS.map((section) => {
          const sectionRows = rows.filter((row) => row.worksheet_type === section.key);
          if (!sectionRows.length) return null;
          return [<TableRow key={`${section.key}-header`}><TableCell colSpan={11} sx={{ fontWeight: 700, bgcolor: 'grey.200' }}>{section.label}</TableCell></TableRow>, ...sectionRows.map((row) => {
            number += 1;
            const cells = [number, row.nomor_kertas_kerja, row.komponen_supervisi, row.hasil_implementasi, row.permasalahan, row.rekomendasi, row.peraturan, row.uic, row.tindak_lanjut, row.status_penyelesaian];
            return <TableRow key={`${row.worksheet_type}-${row.junction_id}`} hover>
              {cells.map((cell, index) => <TableCell key={index} align={index < 2 ? 'center' : 'left'} sx={{ fontSize: 12, verticalAlign: 'top', whiteSpace: 'pre-wrap' }}>{cell || '-'}</TableCell>)}
              <TableCell align="center">
                {canEdit && <Tooltip title="Edit matriks"><IconButton color="warning" onClick={() => setSelectedRow(row)}><Iconify icon="mdi:edit" /></IconButton></Tooltip>}
              </TableCell>
            </TableRow>;
          })];
        })}
        {!rows.length && <TableRow><TableCell colSpan={11} align="center">Tidak ada temuan aktif.</TableCell></TableRow>}
      </TableBody>
    </Table></TableContainer>
    <MatrixTablePeraturan2EditModal row={selectedRow} onClose={() => setSelectedRow(null)} getMatrix={getMatrix} />
  </Card>;
}
