import { Helmet } from 'react-helmet-async';
import { useEffect, useMemo } from 'react';
import type { SyntheticEvent } from 'react';
import { Alert, Button, Container, Skeleton, Stack, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useDictionary from '../../hooks/useDictionary';
import useSnackbar from '../../hooks/display/useSnackbar';
import SelectionTab from '../matrix/components/SelectionTab';
import TabelPenilaian from './components/TabelPenilaian';
import ScorePembinaan from '../home/components/ScorePembinaan';
import useNilaiAKK from './useNilaiAKK';
import useNilaiAKKLiveSync from './useNilaiAKKLiveSync';
//-----------------------------------------------------------------------------------------------------------------

export default function NilaiSection() {
  const { auth } = useAuth();
  const { kppnRef } = useDictionary();
  const { openSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();

  const isKanwil = [3, 4, 99].includes(auth?.role ?? -1);
  const queryKppnId = new URLSearchParams(location.search).get('id');
  const kppnUnits = useMemo(
    () => kppnRef?.list.filter((item) => item.level === 0) || [],
    [kppnRef]
  );
  const defaultKppnId = kppnUnits[0]?.id || '010';
  const selectedKppnId = isKanwil ? queryKppnId || defaultKppnId : auth?.kppn || '';
  const {
    data,
    error,
    refreshError,
    isLoading,
    isRefreshing,
    refresh,
    clearRefreshError,
  } = useNilaiAKK(selectedKppnId, auth?.period, auth?.peraturan);

  useNilaiAKKLiveSync(data?.worksheetId, refresh);

  useEffect(() => {
    if (!isKanwil || kppnUnits.length === 0) return;
    const isValidKppn = kppnUnits.some((item) => item.id === selectedKppnId);
    if (!isValidKppn) navigate(`?id=${defaultKppnId}`, { replace: true });
  }, [defaultKppnId, isKanwil, kppnUnits, navigate, selectedKppnId]);

  useEffect(() => {
    if (!refreshError) return;
    openSnackbar(refreshError, 'error');
    clearRefreshError();
  }, [clearRefreshError, openSnackbar, refreshError]);

  const handleTabChange = (_: SyntheticEvent, newValue: string) => {
    navigate(`?id=${newValue}`);
  };

  const scoreUnitName = data?.kppnAlias || data?.kppnName || 'KPPN';
  const scoreTitleKppnName = scoreUnitName.toLowerCase().startsWith('kppn')
    ? scoreUnitName
    : `KPPN ${scoreUnitName}`;

  return (
    <>
      <Helmet>
        <title> Salamaik | Nilai  </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" spacing={1} sx={{ mb: 5 }} maxWidth="100%">
          <Typography variant="h4">
            {data?.periodName ? `Nilai Periode ${data.periodName}` : 'Nilai'}
          </Typography>
        </Stack>

        {isKanwil && <SelectionTab tab={selectedKppnId} changeTab={handleTabChange} />}

        {isLoading && !data && <NilaiSkeleton />}

        {!isLoading && error && (
          <Alert
            severity={error.status === 404 ? 'warning' : 'error'}
            action={
              <Button color="inherit" size="small" onClick={() => void refresh()}>
                Coba Lagi
              </Button>
            }
          >
            {error.message}
          </Alert>
        )}

        {data && (
          <>
            <Stack direction="column" width={{ xs: '100%', md: '50%' }}>
              <ScorePembinaan
                header={`Nilai Aspek Kinerja ${scoreTitleKppnName}`}
                selfScore={data.nilaiKPPN}
                kanwilScore={data.nilaiKanwil}
              />
            </Stack>

            <Stack>
              <TabelPenilaian data={data} isRefreshing={isRefreshing} />
            </Stack>
          </>
        )}
      </Container>
    </>
  );
}

function NilaiSkeleton() {
  return (
    <Stack spacing={3} aria-busy="true" aria-label="Memuat nilai aspek kinerja KPPN">
      <Skeleton variant="rounded" width="50%" height={200} />
      <Skeleton variant="rounded" width="100%" height={360} />
    </Stack>
  );
}
