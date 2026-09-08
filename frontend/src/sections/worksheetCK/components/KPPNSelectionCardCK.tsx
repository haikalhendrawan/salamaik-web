import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Box, Button, Card, CardHeader, CircularProgress, Grid, Grow, IconButton, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import Iconify from '../../../components/iconify';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
import useSnackbar from '../../../hooks/display/useSnackbar';
import { generateExcelWorksheetCK } from '../../excel/useExcelWorksheetCK';

export default function KPPNSelectionCardCK({
  header,
  image,
  link,
  completedKPPN,
  completedKanwil,
  total,
  kppnId,
  worksheetCKId,
}: {
  header: string;
  image: string;
  link: string;
  completedKPPN: number;
  completedKanwil: number;
  total: number;
  kppnId: string;
  worksheetCKId: string;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const axiosJWT = useAxiosJWT();
  const { openSnackbar } = useSnackbar();
  const kanwilPercent = total ? (completedKanwil / total) * 100 : 0;
  const kppnPercent = total ? (completedKPPN / total) * 100 : 0;

  const exportExcel = async () => {
    try {
      setIsExporting(true);
      const [junctionResponse, scoreResponse] = await Promise.all([
        axiosJWT.get(
          `/wsCKJunction/getWsCKJunctionByWorksheetForKanwil?kppn=${encodeURIComponent(kppnId)}&time=${Date.now()}`
        ),
        axiosJWT.get(`/scoringEngine/ck/${encodeURIComponent(worksheetCKId)}`),
      ]);
      const rows = junctionResponse.data.rows;
      if (!rows?.length) {
        openSnackbar('Data worksheet CK belum tersedia', 'error');
        return;
      }

      await generateExcelWorksheetCK({
        rows,
        kppnName: header,
        ckScore: scoreResponse.data.rows,
      });
      openSnackbar('Worksheet CK berhasil diexport', 'success');
    } catch (error: unknown) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error ? error.message : 'Gagal membuat file Excel CK';
      openSnackbar(message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Grow in>
      <Card>
        <Grid container>
          <Grid item xs={6}>
            <CardHeader
              title={header}
              subheader={(
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2">{`${kanwilPercent.toFixed(0)}% complete`}</Typography>
                  <Tooltip title={`Progress KPPN: ${completedKPPN}/${total} (${kppnPercent.toFixed(0)}%)`}>
                    <span><Iconify icon="solar:info-circle-bold-duotone" /></span>
                  </Tooltip>
                </Stack>
              )}
              titleTypographyProps={{ variant: 'subtitle1' }}
            />
            <Box sx={{ p: 3, pt: 12 }}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Button
                  variant="contained"
                  component={Link}
                  to={link}
                  endIcon={<Iconify icon="solar:book-2-bold-duotone" />}
                >
                  Open
                </Button>
                <Tooltip title="Export Excel CK">
                  <span>
                    <IconButton
                      aria-label="Export worksheet CK ke Excel"
                      onClick={exportExcel}
                      disabled={isExporting}
                      sx={{ cursor: isExporting ? 'default' : 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      {isExporting
                        ? <CircularProgress size={22} />
                        : <Iconify icon="vscode-icons:file-type-excel" />}
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
              {!imageLoaded && <Skeleton variant="rounded" sx={{ width: '100%', height: 220 }} />}
              <img
                src={`/image/${image}`}
                alt={header}
                onLoad={() => setImageLoaded(true)}
                style={{ display: imageLoaded ? 'block' : 'none', height: 220, width: '100%', borderRadius: 12, objectFit: 'cover' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Grow>
  );
}
