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
import useExcelNilaiAKKPenyumbangLHPS from '../useExcelNilaiAKKPenyumbangLHPS';
import {
  AKKComponentDetail,
  AKKContributorCategory,
  AKKContributorGroup,
  AKKContributorLHPSResponse,
} from '../types';
import TabelNilaiAKKPenyumbangLHPSPeraturan1 from './TabelNilaiAKKPenyumbangLHPSPeraturan1';

type TabelNilaiAKKPenyumbangLHPSProps = {
  data: AKKContributorLHPSResponse;
  isRefreshing?: boolean;
};

const CATEGORY_CODES: Record<AKKContributorCategory, string> = {
  A1_PROVINSI: 'A',
  A1_NON_PROVINSI: 'B',
  A2: 'C',
  SELURUH_KPPN: 'A',
};

const formatScore = (value: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatWeight = (value: number) =>
  `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)}%`;

export default function TabelNilaiAKKPenyumbangLHPS({
  data,
  isRefreshing = false,
}: TabelNilaiAKKPenyumbangLHPSProps) {
  if (data.peraturan === 1) {
    return (
      <TabelNilaiAKKPenyumbangLHPSPeraturan1
        data={data}
        isRefreshing={isRefreshing}
      />
    );
  }

  return (
    <TabelNilaiAKKPenyumbangLHPSPeraturan2
      data={data}
      isRefreshing={isRefreshing}
    />
  );
}

function TabelNilaiAKKPenyumbangLHPSPeraturan2({
  data,
  isRefreshing,
}: Required<TabelNilaiAKKPenyumbangLHPSProps>) {
  const theme = useTheme();
  const { openSnackbar } = useSnackbar();
  const [isExporting, setIsExporting] = useState(false);
  const { generate } = useExcelNilaiAKKPenyumbangLHPS(data);
  const headerBackground =
    theme.palette.mode === 'light' ? theme.palette.grey[700] : theme.palette.grey[800];
  const componentWeights = getComponentWeights(data);

  const headerCellSx = {
    bgcolor: headerBackground,
    color: theme.palette.common.white,
    fontWeight: 700,
    textAlign: 'center',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
  } as const;

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
              <Typography variant="h6">Nilai AKK Penyumbang Nilai LHPS</Typography>
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
          subheader={`Pembobotan nilai AKK seluruh KPPN lingkup Kanwil · ${data.periodName}`}
        />

        <TableContainer sx={{ pt: 3 }}>
          <Table
            size="small"
            aria-label="Tabel nilai AKK penyumbang nilai LHPS"
            sx={{
              minWidth: 1540,
              '& .MuiTableCell-root': {
                borderRight: `1px solid ${theme.palette.divider}`,
                fontSize: '12px',
                py: 1.15,
              },
              '& .MuiTableRow-root > .MuiTableCell-root:last-of-type': {
                borderRight: 0,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell rowSpan={3} sx={{ ...headerCellSx, minWidth: 55 }}>No</TableCell>
                <TableCell rowSpan={3} sx={{ ...headerCellSx, minWidth: 170 }}>KPPN</TableCell>
                <TableCell rowSpan={3} sx={{ ...headerCellSx, minWidth: 90 }}>Bobot KPPN</TableCell>
                <TableCell colSpan={10} sx={headerCellSx}>Penilaian Aspek Kinerja KPPN</TableCell>
                <TableCell colSpan={2} sx={headerCellSx}>AKK Penyumbang Nilai LHPS</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} sx={headerCellSx}>
                  Proses Bisnis (PB) ({formatWeight(componentWeights.pb)})
                </TableCell>
                <TableCell colSpan={3} sx={headerCellSx}>
                  Sarana dan Prasarana Mutu Layanan ({formatComponentWeight(componentWeights.spml)})
                </TableCell>
                <TableCell colSpan={3} sx={headerCellSx}>
                  Capaian Kinerja ({formatComponentWeight(componentWeights.ck)})
                </TableCell>
                <TableCell rowSpan={2} sx={{ ...headerCellSx, minWidth: 85 }}>Nilai AKK</TableCell>
                <TableCell rowSpan={2} sx={{ ...headerCellSx, minWidth: 105 }}>Bobot Memenuhi</TableCell>
                <TableCell rowSpan={2} sx={{ ...headerCellSx, minWidth: 155 }}>
                  Hasil AKK Penyumbang Nilai LHPS
                </TableCell>
              </TableRow>
              <TableRow>
                <ScoreHeaderCells headerCellSx={headerCellSx} />
              </TableRow>
            </TableHead>

            <TableBody>
              {data.kelompok.map((group) => (
                <GroupRows key={group.kategori} group={group} />
              ))}

              <SummaryRow
                label="Jumlah Nilai AKK Seluruh KPPN"
                value={formatScore(data.jumlahNilaiAKKSeluruhKPPN)}
              />
              <SummaryRow
                label="Jumlah Bobot KPPN yang Memenuhi"
                value={formatWeight(data.jumlahBobotKPPNYangMemenuhi)}
              />
              <TableRow>
                <TableCell
                  colSpan={14}
                  align="center"
                  sx={{
                    bgcolor: headerBackground,
                    color: theme.palette.common.white,
                    fontSize: '13px !important',
                    fontWeight: 700,
                    py: '14px !important',
                  }}
                >
                  NILAI AKHIR ASPEK KINERJA KPPN LINGKUP KANWIL DJPb PROVINSI SUMATERA BARAT
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    bgcolor: theme.palette.warning.light,
                    color: theme.palette.warning.contrastText,
                    fontSize: '16px !important',
                    fontWeight: 800,
                  }}
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

function ScoreHeaderCells({ headerCellSx }: { headerCellSx: Record<string, unknown> }) {
  return (
    <>
      <TableCell sx={{ ...headerCellSx, minWidth: 125 }}>Nilai Kertas Kerja PB</TableCell>
      <TableCell sx={{ ...headerCellSx, minWidth: 75 }}>Bobot PB</TableCell>
      <TableCell sx={{ ...headerCellSx, minWidth: 75 }}>Nilai PB</TableCell>
      <TableCell sx={{ ...headerCellSx, minWidth: 145 }}>Nilai Kertas Kerja SPML</TableCell>
      <TableCell sx={{ ...headerCellSx, minWidth: 85 }}>Bobot SPML</TableCell>
      <TableCell sx={{ ...headerCellSx, minWidth: 85 }}>Nilai SPML</TableCell>
      <TableCell sx={{ ...headerCellSx, minWidth: 125 }}>Nilai Kertas Kerja CK</TableCell>
      <TableCell sx={{ ...headerCellSx, minWidth: 75 }}>Bobot CK</TableCell>
      <TableCell sx={{ ...headerCellSx, minWidth: 75 }}>Nilai CK</TableCell>
    </>
  );
}

function GroupRows({ group }: { group: AKKContributorGroup }) {
  const theme = useTheme();
  const groupBackground =
    theme.palette.mode === 'light' ? theme.palette.grey[600] : theme.palette.grey[700];

  return (
    <>
      <TableRow>
        <TableCell align="center" sx={{ bgcolor: groupBackground, color: 'common.white', fontWeight: 700 }}>
          {CATEGORY_CODES[group.kategori]}
        </TableCell>
        <TableCell sx={{ bgcolor: groupBackground, color: 'common.white', fontWeight: 700 }}>
          {group.label}
        </TableCell>
        <TableCell align="center" sx={{ bgcolor: groupBackground, color: 'common.white', fontWeight: 700 }}>
          {formatWeight(group.bobot)}
        </TableCell>
        <TableCell colSpan={12} sx={{ bgcolor: groupBackground }} />
      </TableRow>

      {group.kppn.map((unit, index) => (
        <TableRow hover key={unit.kppnId}>
          <TableCell align="center">{index + 1}</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>{unit.alias || unit.name}</TableCell>
          <TableCell align="center">{formatWeight(unit.bobotKPPN)}</TableCell>
          <ScoreCells detail={unit.pb} />
          <ScoreCells detail={unit.spml} />
          <ScoreCells detail={unit.ck} />
          <TableCell align="center" sx={{ fontWeight: 700 }}>{formatScore(unit.nilaiAKK)}</TableCell>
          <TableCell align="center">{formatWeight(unit.bobotKPPN)}</TableCell>
          <TableCell align="center" sx={{ fontWeight: 700 }}>
            {formatScore(unit.nilaiPenyumbangLHPS)}
          </TableCell>
        </TableRow>
      ))}

      <TableRow sx={{ bgcolor: alpha(theme.palette.grey[500], 0.14) }}>
        <TableCell colSpan={13} align="center" sx={{ fontWeight: 700 }}>
          Rata-rata AKK {group.label}
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: 700 }}>{formatWeight(group.bobot)}</TableCell>
        <TableCell align="center" sx={{ fontWeight: 700 }}>
          {formatScore(group.kontribusiLHPS)}
        </TableCell>
      </TableRow>
    </>
  );
}

function ScoreCells({ detail }: { detail: AKKComponentDetail | null }) {
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <TableRow>
      <TableCell
        colSpan={14}
        align="center"
        sx={{ bgcolor: theme.palette.grey[600], color: 'common.white', fontWeight: 700 }}
      >
        {label}
      </TableCell>
      <TableCell
        align="center"
        sx={{ bgcolor: theme.palette.grey[600], color: 'common.white', fontWeight: 700 }}
      >
        {value}
      </TableCell>
    </TableRow>
  );
}

function getComponentWeights(data: AKKContributorLHPSResponse) {
  const firstUnit = data.kelompok.flatMap((group) => group.kppn)[0];
  return {
    pb: firstUnit?.pb.bobot ?? (data.peraturan === 1 ? 100 : 50),
    spml: firstUnit?.spml?.bobot ?? null,
    ck: firstUnit?.ck?.bobot ?? null,
  };
}

function formatComponentWeight(value: number | null) {
  return value === null ? 'Tidak berlaku' : formatWeight(value);
}
