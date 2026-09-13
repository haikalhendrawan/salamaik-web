import { useState } from 'react';
import {
  Card,
  CardHeader,
  CircularProgress,
  Grow,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Iconify from '../../../components/iconify';
import useSnackbar from '../../../hooks/display/useSnackbar';
import useExcelPenilaian from '../useExcelPenilaian';
import { AKKScoreResponse } from '../types';

type Props = {
  data: AKKScoreResponse;
  isRefreshing: boolean;
};

const formatScore = (value: number) => value.toFixed(2);

export default function TabelPenilaianPeraturan1({ data, isRefreshing }: Props) {
  const theme = useTheme();
  const { openSnackbar } = useSnackbar();
  const [scoreVersion, setScoreVersion] = useState<'kppn' | 'kanwil'>('kppn');
  const [isExporting, setIsExporting] = useState(false);
  const { generate } = useExcelPenilaian({ data });
  const isKPPN = scoreVersion === 'kppn';
  const detail = isKPPN ? data.detailPBKPPN : data.detailPBKanwil;
  const finalScore = isKPPN ? data.nilaiKPPN : data.nilaiKanwil;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await generate();
    } catch (error: unknown) {
      openSnackbar(
        error instanceof Error ? error.message : 'Gagal membuat file Excel',
        'error'
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Grow in>
      <Stack spacing={1}>
        <Card sx={{ mt: 3, mb: 1 }}>
          <CardHeader
            title={
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <IconButton
                  aria-label="Tampilkan self assessment KPPN"
                  disabled={isKPPN}
                  onClick={() => setScoreVersion('kppn')}
                  sx={{ visibility: isKPPN ? 'hidden' : 'visible' }}
                >
                  <Iconify icon="eva:arrow-ios-back-outline" />
                </IconButton>
                <Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h6">Rekapitulasi Penilaian Kinerja KPPN</Typography>
                    {isRefreshing && <CircularProgress size={16} aria-label="Memperbarui nilai" />}
                    <Tooltip title="Export Excel">
                      <span>
                        <IconButton
                          aria-label="Export tabel penilaian ke Excel"
                          onClick={handleExport}
                          disabled={isExporting || isRefreshing}
                        >
                          {isExporting ? (
                            <CircularProgress size={20} />
                          ) : (
                            <Iconify icon="vscode-icons:file-type-excel" />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Berdasarkan {isKPPN ? 'Self Assessment KPPN' : 'Penilaian Kanwil'}
                  </Typography>
                </Stack>
                <IconButton
                  aria-label="Tampilkan penilaian Kanwil"
                  disabled={!isKPPN}
                  onClick={() => setScoreVersion('kanwil')}
                  sx={{ visibility: isKPPN ? 'visible' : 'hidden' }}
                >
                  <Iconify icon="eva:arrow-ios-forward-outline" />
                </IconButton>
              </Stack>
            }
          />

          <TableContainer sx={{ pt: 3 }}>
            <Table
              size="small"
              aria-label="Rekapitulasi nilai per komponen kertas kerja PB"
              sx={{
                '& .MuiTableCell-root': {
                  borderRight: `1px solid ${theme.palette.divider}`,
                  fontSize: '12px',
                },
                '& .MuiTableRow-root > .MuiTableCell-root:last-of-type': { borderRight: 0 },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">No</TableCell>
                  <TableCell>Nama Komponen</TableCell>
                  <TableCell align="center">Total Nilai</TableCell>
                  <TableCell align="center">Bilangan Pembagi*</TableCell>
                  <TableCell align="center">Rata-Rata Nilai**</TableCell>
                  <TableCell align="center">Bobot Nilai***</TableCell>
                  <TableCell align="center">Nilai Tertimbang</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detail.detailKomponen.map((component, index) => (
                  <TableRow hover key={component.komponenId}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>{component.komponenTitle}</TableCell>
                    <TableCell align="center">{formatScore(component.totalSkorKonversi)}</TableCell>
                    <TableCell align="center">{component.jumlahChecklistPembagi}</TableCell>
                    <TableCell align="center">{formatScore(component.nilaiRataRata)}</TableCell>
                    <TableCell align="center">
                      <Typography
                        component="span"
                        sx={{
                          display: 'inline-flex',
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          bgcolor: 'success.lighter',
                          color: 'success.darker',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      >
                        {formatScore(component.komponenBobot)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{formatScore(component.nilaiTerbobot)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5} />
                  <TableCell
                    align="center"
                    sx={{ bgcolor: 'warning.main', fontWeight: 700 }}
                  >
                    Nilai Akhir
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ bgcolor: 'warning.main', fontWeight: 700 }}
                  >
                    {formatScore(finalScore)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Stack spacing={0.5} sx={{ pl: 2 }}>
          <Typography variant="body2" sx={{ fontSize: '12px' }}>
            *Jumlah checklist komponen yang tidak dikecualikan (N/A)
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '12px' }}>
            **Total nilai komponen dibagi bilangan pembagi
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '12px' }}>
            ***Bobot komponen ditentukan oleh dasar hukum pembinaan
          </Typography>
        </Stack>
      </Stack>
    </Grow>
  );
}
