import { useCallback, useEffect } from 'react';
import { Card, CardHeader, IconButton, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import Iconify from '../../components/iconify';
import { useAuth } from '../../hooks/useAuth';
import useWsCKJunction from './useWsCKJunction';
import useWsCKLiveSync from './useWsCKLiveSync';
import WorksheetCKTable from './components/WorksheetCKTable';
import WorksheetCKToolbar from './components/WorksheetCKToolbar';
import NavigationDrawerCK from './components/NavigationDrawerCK';
import PreviewFileCKModal from './components/PreviewFileCKModal';

const KPPN_NAMES: Record<string, string> = {
  '010': 'Padang', '011': 'Bukittinggi', '090': 'Solok', '091': 'Lubuk Sikaping',
  '077': 'Sijunjung', '142': 'Painan',
};

export default function WorksheetCKWorkspace() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const requestedId = params.get('id') || '';
  const selectedKppnId = requestedId || auth?.kppn || '';
  const selectedKppnName = KPPN_NAMES[selectedKppnId] || selectedKppnId;
  const {
    wsCKJunction,
    wsDetail,
    ckScore,
    isScoreLoading,
    lastRefreshedAt,
    setWsCKJunction,
    getWsCKJunction,
    getWorksheet,
    resetCKScore,
  } = useWsCKJunction();
  const activeWorksheetId = wsCKJunction[0]?.worksheet_id;
  const closeTime = wsDetail?.close_period ? new Date(wsDetail.close_period).getTime() : Number.POSITIVE_INFINITY;
  const isPastDue = Date.now() > closeTime;

  useWsCKLiveSync(activeWorksheetId, selectedKppnId);

  useEffect(() => {
    resetCKScore();
    setWsCKJunction([]);
    void getWorksheet(selectedKppnId);
    void getWsCKJunction(selectedKppnId);
    // Context functions are not memoized.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKppnId]);

  const scrollToChecklist = useCallback((junctionId: number) => {
    document.getElementById(`ck-checklist-${junctionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  return (
    <>
      <Helmet><title>Salamaik | Worksheet CK</title></Helmet>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 5 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ display: auth?.kppn?.length === 5 ? 'flex' : 'none' }}>
          <Iconify icon="eva:arrow-ios-back-outline" />
        </IconButton>
        <Typography variant="h4">{`KPPN ${selectedKppnName}`}</Typography>
      </Stack>
      <WorksheetCKToolbar rows={wsCKJunction} kppnName={selectedKppnName} lastRefreshedAt={lastRefreshedAt} />
      <Card sx={{ mx: 4 }}>
        <CardHeader title={<Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>Kertas Kerja Capaian Kinerja</Typography>} />
        <WorksheetCKTable
          rows={wsCKJunction}
          isPastDue={isPastDue}
          ckScore={ckScore}
          isScoreLoading={isScoreLoading}
        />
      </Card>
      <PreviewFileCKModal disabled={isPastDue} />
      <NavigationDrawerCK rows={wsCKJunction} onNavigate={scrollToChecklist} />
    </>
  );
}
