import { useMemo, useState } from 'react';
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
import useExcelNilaiAKKPenyumbangLHPS from '../useExcelNilaiAKKPenyumbangLHPS';
import { AKKContributorLHPSResponse } from '../types';

type Props = {
  data: AKKContributorLHPSResponse;
  isRefreshing: boolean;
};

const formatScore = (value: number) => value.toFixed(2);

export default function TabelNilaiAKKPenyumbangLHPSPeraturan1({
  data,
  isRefreshing,
}: Props) {
  const theme = useTheme();
  const { openSnackbar } = useSnackbar();
  const [isExporting, setIsExporting] = useState(false);
  const { generate } = useExcelNilaiAKKPenyumbangLHPS(data);
  const units = useMemo(
    () => data.kelompok.flatMap((group) => group.kppn),
    [data.kelompok]
  );
  const components = units[0]?.detailKomponenPB ?? [];
  const headerBackground =
    theme.palette.mode === 'light' ? theme.palette.grey[700] : theme.palette.grey[800];

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await generate();
      openSnackbar('Tabel nilai AKK penyumbang LHPS berhasil diexport', 'success');
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
      <Card>
        <CardHeader
          title={
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6">Nilai Pembinaan KPPN</Typography>
              {isRefreshing && (
                <CircularProgress size={16} aria-label="Memperbarui nilai AKK penyumbang LHPS" />
              )}
              <Tooltip title="Export Excel">
                <span>
                  <IconButton
                    aria-label="Export nilai AKK penyumbang LHPS ke Excel"
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
          }
          subheader={`Rata-rata nilai KPPN`}
        />

        <TableContainer sx={{ pt: 3 }}>
          <Table
            size="small"
            aria-label="Tabel nilai AKK seluruh KPPN peraturan 1"
            sx={{
              minWidth: Math.max(800, 350 + components.length * 150),
              '& .MuiTableCell-root': {
                borderRight: `1px solid ${theme.palette.divider}`,
                fontSize: '12px',
                py: 1.25,
              },
              '& .MuiTableRow-root > .MuiTableCell-root:last-of-type': { borderRight: 0 },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ bgcolor: headerBackground, color: 'common.white', fontWeight: 700 }}
                >
                  No
                </TableCell>
                <TableCell
                  sx={{ bgcolor: headerBackground, color: 'common.white', fontWeight: 700, minWidth: 170 }}
                >
                  KPPN
                </TableCell>
                {components.map((component) => (
                  <TableCell
                    key={component.komponenId}
                    align="center"
                    sx={{
                      bgcolor: headerBackground,
                      color: 'common.white',
                      fontWeight: 700,
                      minWidth: 135,
                    }}
                  >
                    {component.komponenTitle} ({formatScore(component.komponenBobot)}%)
                  </TableCell>
                ))}
                <TableCell
                  align="center"
                  sx={{
                    bgcolor: headerBackground,
                    color: 'common.white',
                    fontWeight: 700,
                    minWidth: 150,
                  }}
                >
                  Jumlah Setelah Dibobotkan
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {units.map((unit, index) => (
                <TableRow hover key={unit.kppnId}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{unit.alias || unit.name}</TableCell>
                  {components.map((component) => {
                    const unitComponent = unit.detailKomponenPB.find(
                      (item) => item.komponenId === component.komponenId
                    );
                    return (
                      <TableCell key={component.komponenId} align="center">
                        {unitComponent ? formatScore(unitComponent.nilaiTerbobot) : '-'}
                      </TableCell>
                    );
                  })}
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    {formatScore(unit.nilaiAKK)}
                  </TableCell>
                </TableRow>
              ))}

              <FooterRow
                colSpan={components.length + 2}
                label="Total Nilai Seluruh KPPN"
                value={formatScore(data.totalNilaiKPPN)}
              />
              <FooterRow
                colSpan={components.length + 2}
                label="Jumlah KPPN (Bilangan Pembagi)"
                value={String(data.jumlahPembagi)}
              />
              <TableRow>
                <TableCell
                  colSpan={components.length + 2}
                  align="center"
                  sx={{
                    bgcolor: headerBackground,
                    color: 'common.white',
                    fontSize: '13px !important',
                    fontWeight: 700,
                    py: '14px !important',
                  }}
                >
                  NILAI PEMBINAAN KPPN LINGKUP KANWIL DJPb PROVINSI SUMATERA BARAT
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ bgcolor: 'warning.light', fontSize: '16px !important', fontWeight: 800 }}
                >
                  {formatScore(data.nilaiAkhirAspekKinerja)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Grow>
  );
}

function FooterRow({ colSpan, label, value }: { colSpan: number; label: string; value: string }) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        align="center"
        sx={{ bgcolor: 'grey.600', color: 'common.white', fontWeight: 700 }}
      >
        {label}
      </TableCell>
      <TableCell
        align="center"
        sx={{ bgcolor: 'grey.600', color: 'common.white', fontWeight: 700 }}
      >
        {value}
      </TableCell>
    </TableRow>
  );
}
