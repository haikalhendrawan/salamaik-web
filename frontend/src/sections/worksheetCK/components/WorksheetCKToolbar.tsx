import { useMemo } from 'react';
import { format } from 'date-fns';
import { Box, Grid, IconButton, LinearProgress, Tooltip, Typography } from '@mui/material';
import Iconify from '../../../components/iconify';
import useLoading from '../../../hooks/display/useLoading';
import useSnackbar from '../../../hooks/display/useSnackbar';
import useExcelWorksheetCK from '../../excel/useExcelWorksheetCK';
import { WsCKJunctionType } from '../types';
import useWsCKJunction from '../useWsCKJunction';

function Progress({ completed, total }: { completed: number; total: number }) {
  const value = total ? (completed / total) * 100 : 0;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={value} sx={{ borderRadius: 2 }} />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }} noWrap>
        {`${completed}/${total} (${Math.round(value)}%)`}
      </Typography>
    </Box>
  );
}

export default function WorksheetCKToolbar({
  rows,
  kppnName,
  lastRefreshedAt,
}: {
  rows: WsCKJunctionType[];
  kppnName: string;
  lastRefreshedAt: Date | null;
}) {
  const { setIsLoading } = useLoading();
  const { openSnackbar } = useSnackbar();
  const { ckScore } = useWsCKJunction();
  const excel = useExcelWorksheetCK({ rows, kppnName, ckScore });
  const progress = useMemo(() => ({
    total: rows.length,
    kppn: rows.filter((row) => row.kppn_score !== null || row.excluded === 1).length,
    kanwil: rows.filter((row) => row.kanwil_score !== null || row.excluded === 1).length,
  }), [rows]);

  const exportExcel = async () => {
    if (!rows.length) return openSnackbar('Data worksheet CK belum tersedia', 'error');
    try {
      setIsLoading(true);
      await excel.generate();
      openSnackbar('Worksheet CK berhasil diexport', 'success');
    } catch (error: unknown) {
      openSnackbar(error instanceof Error ? error.message : 'Gagal membuat file Excel CK', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const toolbarRows = [
    { label: 'Progress KPPN', content: <Progress completed={progress.kppn} total={progress.total} /> },
    { label: 'Progress Kanwil', content: <Progress completed={progress.kanwil} total={progress.total} /> },
    {
      label: 'Refresh Terakhir',
      content: <Typography variant="body2" color="text.secondary">{lastRefreshedAt ? format(lastRefreshedAt, 'dd/MM/yyyy HH:mm:ss') : '-'}</Typography>,
    },
    {
      label: 'Export',
      content: (
        <Tooltip title="Export Excel CK">
          <IconButton aria-label="Export worksheet CK ke Excel" onClick={exportExcel} sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
            <Iconify icon="vscode-icons:file-type-excel" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box sx={{ mx: 4, mb: 3, py: 1, width: { xs: 'calc(100% - 64px)', sm: '65%', md: '65%' } }}>
      <Grid container spacing={2} alignItems="center">
        {toolbarRows.map((row) => (
          <Grid item xs={12} container spacing={2} alignItems="center" key={row.label}>
            <Grid item xs={4} md={2}><Typography variant="body2">{row.label}</Typography></Grid>
            <Grid item xs={1}><Typography variant="body2">:</Typography></Grid>
            <Grid item xs={7} md={9}>{row.content}</Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
