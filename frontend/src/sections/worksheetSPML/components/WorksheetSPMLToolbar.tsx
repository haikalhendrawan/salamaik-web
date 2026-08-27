import { useMemo } from 'react';
import { Box, Grid, IconButton, LinearProgress, Tooltip, Typography } from '@mui/material';
import Iconify from '../../../components/iconify';
import useDictionary from '../../../hooks/useDictionary';
import useLoading from '../../../hooks/display/useLoading';
import useSnackbar from '../../../hooks/display/useSnackbar';
import useExcelWorksheetSPML from '../../excel/useExcelWorksheetSPML';
import { WsSPMLJunctionType } from '../types';
import { format } from 'date-fns';
import useWsSPMLJunction from '../useWsSPMLJunction';

interface WorksheetSPMLToolbarProps {
  wsSPMLJunction: WsSPMLJunctionType[];
  kppnName: string;
  lastRefreshedAt: Date | null;
}

interface ChecklistProgressProps {
  completed: number;
  total: number;
  value: number;
  tooltip: string;
}

function ChecklistProgress({ completed, total, value, tooltip }: ChecklistProgressProps) {
  return (
    <Tooltip title={tooltip}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" value={value} sx={{ borderRadius: '12px' }} />
        </Box>
        <Box sx={{ minWidth: 100 }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {`${completed}/${total} (${Math.round(value)}%)`}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
}

export default function WorksheetSPMLToolbar({
  wsSPMLJunction,
  kppnName,
  lastRefreshedAt,
}: WorksheetSPMLToolbarProps) {
  const { komponenSpmlRef, subKomponenSpmlRef, aspekSpmlRef } = useDictionary();
  const { setIsLoading } = useLoading();
  const { openSnackbar } = useSnackbar();
  const { spmlScore } = useWsSPMLJunction();
  const excelWorksheet = useExcelWorksheetSPML({
    rows: wsSPMLJunction,
    kppnName,
    komponenRef: komponenSpmlRef,
    subKomponenRef: subKomponenSpmlRef,
    aspekRef: aspekSpmlRef,
    spmlScore,
  });

  const progress = useMemo(() => {
    const total = wsSPMLJunction.length;
    const completedKPPN = wsSPMLJunction.filter((item) => item.kppn_score !== null).length;
    const completedKanwil = wsSPMLJunction.filter((item) => item.kanwil_score !== null).length;

    return {
      total,
      completedKPPN,
      completedKanwil,
      kppn: total > 0 ? (completedKPPN / total) * 100 : 0,
      kanwil: total > 0 ? (completedKanwil / total) * 100 : 0,
    };
  }, [wsSPMLJunction]);

  const handleExportExcel = async () => {
    if (wsSPMLJunction.length === 0) {
      openSnackbar('Data worksheet SPML belum tersedia', 'error');
      return;
    }

    try {
      setIsLoading(true);
      await excelWorksheet.generate();
      openSnackbar('Worksheet SPML berhasil diexport', 'success');
    } catch (err: unknown) {
      openSnackbar(err instanceof Error ? err.message : 'Gagal membuat file Excel SPML', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        mx: 4,
        mb: 3,
        py: 1,
        width: { xs: 'calc(100% - 64px)', sm: '65%', md: '65%' },
        backgroundColor: 'transparent',
      }}
    >
      <Box sx={{ fontSize: 12 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4} sm={3} md={2}>
            <Typography variant="body2">Progress KPPN</Typography>
          </Grid>
          <Grid item xs={1} sm={1}>
            <Typography variant="body2">:</Typography>
          </Grid>
          <Grid item xs={7} sm={8} md={9}>
            <ChecklistProgress
              completed={progress.completedKPPN}
              total={progress.total}
              value={progress.kppn}
              tooltip={`${progress.completedKPPN}/${progress.total} checklist telah diisi oleh KPPN`}
            />
          </Grid>

          <Grid item xs={4} sm={3} md={2}>
            <Typography variant="body2">Progress Kanwil</Typography>
          </Grid>
          <Grid item xs={1} sm={1}>
            <Typography variant="body2">:</Typography>
          </Grid>
          <Grid item xs={7} sm={8} md={9}>
            <ChecklistProgress
              completed={progress.completedKanwil}
              total={progress.total}
              value={progress.kanwil}
              tooltip={`${progress.completedKanwil}/${progress.total} checklist telah diisi oleh Kanwil`}
            />
          </Grid>

          <Grid item xs={4} sm={3} md={2}>
            <Typography variant="body2">Refresh Terakhir</Typography>
          </Grid>
          <Grid item xs={1} sm={1}>
            <Typography variant="body2">:</Typography>
          </Grid>
          <Grid item xs={7} sm={8} md={9}>
            <Typography variant="body2" color="text.secondary">
              {lastRefreshedAt ? format(lastRefreshedAt, 'dd/MM/yyyy HH:mm:ss') : '-'}
            </Typography>
          </Grid>

          <Grid item xs={4} sm={3} md={2}>
            <Typography variant="body2">Export</Typography>
          </Grid>
          <Grid item xs={1} sm={1}>
            <Typography variant="body2">:</Typography>
          </Grid>
          <Grid item xs={7} sm={8} md={9}>
            <Tooltip title="Export Excel">
              <IconButton
                aria-label="Export worksheet SPML ke Excel"
                onClick={handleExportExcel}
              >
                <Iconify icon="vscode-icons:file-type-excel" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
