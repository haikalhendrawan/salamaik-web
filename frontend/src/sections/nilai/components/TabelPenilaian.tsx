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
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from '../../../components/iconify';
import useSnackbar from '../../../hooks/display/useSnackbar';
import useExcelPenilaian from '../useExcelPenilaian';
import { AKKComponentDetail, AKKScoreResponse, AKKSideDetail } from '../types';

type TabelPenilaianProps = {
  data: AKKScoreResponse;
  isRefreshing?: boolean;
};

const formatScore = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatWeight = (value: number) =>
  `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(value)}%`;

const componentTitle = (title: string, detail: AKKComponentDetail | null) =>
  detail ? `${title} (${formatWeight(detail.bobot)})` : `${title} (Tidak berlaku)`;

function ScoreRows({
  kppnName,
  detail,
  nilaiAKK,
  section,
}: {
  kppnName: string;
  detail: AKKSideDetail;
  nilaiAKK: number;
  section: 'self' | 'kanwil';
}) {
  const theme = useTheme();
  const sectionColor = section === 'self' ? theme.palette.info.main : theme.palette.warning.main;
  const sectionTitle =
    section === 'self' ? 'Berdasarkan self assessment KPPN' : 'Berdasarkan penilaian Kanwil';

  return (
    <>
      <TableRow>
        <TableCell
          colSpan={11}
          align="center"
          sx={{
            bgcolor: alpha(sectionColor, theme.palette.mode === 'light' ? 0.28 : 0.2),
            color: 'text.primary',
            fontWeight: 700,
          }}
        >
          {sectionTitle}
        </TableCell>
      </TableRow>

      <TableRow
        hover
        sx={{
          bgcolor: alpha(sectionColor, theme.palette.mode === 'light' ? 0.12 : 0.08),
          '&:last-child td': { borderBottom: 0 },
        }}
      >
        <TableCell sx={{ fontWeight: 600 }}>{kppnName}</TableCell>
        <TableCell align="center">{formatScore(detail.pb.nilai)}</TableCell>
        <TableCell align="center">{formatWeight(detail.pb.bobot)}</TableCell>
        <TableCell align="center">{formatScore(detail.pb.kontribusi)}</TableCell>
        <ScoreComponentCells detail={detail.spml} />
        <ScoreComponentCells detail={detail.ck} />
        <TableCell align="center" sx={{ fontWeight: 700 }}>
          {formatScore(nilaiAKK)}
        </TableCell>
      </TableRow>
    </>
  );
}

function ScoreComponentCells({ detail }: { detail: AKKComponentDetail | null }) {
  if (!detail) {
    return (
      <>
        <TableCell align="center">-</TableCell>
        <TableCell align="center">-</TableCell>
        <TableCell align="center">-</TableCell>
      </>
    );
  }

  return (
    <>
      <TableCell align="center">{formatScore(detail.nilai)}</TableCell>
      <TableCell align="center">{formatWeight(detail.bobot)}</TableCell>
      <TableCell align="center">{formatScore(detail.kontribusi)}</TableCell>
    </>
  );
}

export default function TabelPenilaian({ data, isRefreshing = false }: TabelPenilaianProps) {
  const theme = useTheme();
  const { openSnackbar } = useSnackbar();
  const [isExporting, setIsExporting] = useState(false);
  const { generate } = useExcelPenilaian({ data });
  const headerBackground =
    theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700];
  const headerColor =
    theme.palette.mode === 'light' ? theme.palette.grey[900] : theme.palette.common.white;

  const headerCellSx = {
    bgcolor: headerBackground,
    color: headerColor,
    fontWeight: 700,
    textAlign: 'center',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
  } as const;

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
      <Card sx={{ mt: 3, mb: 1 }}>
        <CardHeader
          title={
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6">Rekapitulasi Nilai Aspek Kinerja KPPN</Typography>
              {isRefreshing && <CircularProgress size={16} aria-label="Memperbarui nilai" />}
              <Tooltip title="Export Excel">
                <span>
                  <IconButton
                    aria-label="Export tabel penilaian ke Excel"
                    onClick={handleExport}
                    disabled={isExporting || isRefreshing}
                  >
                    <Iconify icon="vscode-icons:file-type-excel" />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          }
          subheader={`Detail penilaian per kertas kerja · ${data.periodName}`}
        />

        <TableContainer sx={{ pt: 4 }}>
          <Table
            size="small"
            aria-label="Tabel penilaian aspek kinerja KPPN"
            sx={{
              minWidth: 1280,
              '& .MuiTableCell-root': {
                borderRight: `1px solid ${theme.palette.divider}`,
                fontSize: '12px',
                py: 1.25,
              },
              '& .MuiTableRow-root > .MuiTableCell-root:last-of-type': {
                borderRight: 0,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell rowSpan={3} sx={{ ...headerCellSx, minWidth: 150 }}>
                  Nama KPPN
                </TableCell>
                <TableCell colSpan={10} sx={headerCellSx}>
                  Penilaian Aspek Kinerja KPPN
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={3} sx={headerCellSx}>
                  {componentTitle('Proses Bisnis (PB)', data.detailKPPN.pb)}
                </TableCell>
                <TableCell colSpan={3} sx={headerCellSx}>
                  {componentTitle('Sarana dan Prasarana Mutu Layanan', data.detailKPPN.spml)}
                </TableCell>
                <TableCell colSpan={3} sx={headerCellSx}>
                  {componentTitle('Capaian Kinerja', data.detailKPPN.ck)}
                </TableCell>
                <TableCell rowSpan={2} sx={{ ...headerCellSx, minWidth: 90 }}>
                  AKK KPPN
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ ...headerCellSx, minWidth: 150 }}>Nilai Kertas Kerja PB</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: 90 }}>Bobot PB</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: 90 }}>Nilai PB</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: 170 }}>
                  Nilai Kertas Kerja SPML
                </TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: 100 }}>Bobot SPML</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: 100 }}>Nilai SPML</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: 150 }}>Nilai Kertas Kerja CK</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: 90 }}>Bobot CK</TableCell>
                <TableCell sx={{ ...headerCellSx, minWidth: 90 }}>Nilai CK</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <ScoreRows
                kppnName={data.kppnAlias || data.kppnName}
                detail={data.detailKPPN}
                nilaiAKK={data.nilaiKPPN}
                section="self"
              />
              <ScoreRows
                kppnName={data.kppnAlias || data.kppnName}
                detail={data.detailKanwil}
                nilaiAKK={data.nilaiKanwil}
                section="kanwil"
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Grow>
  );
}
