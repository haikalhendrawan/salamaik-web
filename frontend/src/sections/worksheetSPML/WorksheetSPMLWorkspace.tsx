/**
 * Salamaik Client
 * © Kanwil DJPb Sumbar 2024
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Typography, Card, CardHeader, Stack, IconButton} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Iconify from '../../components/iconify';
import { useAuth} from '../../hooks/useAuth';
import { useNavigate, useLocation  } from 'react-router-dom';
import WorksheetSPMLTable from './components/WorksheetSPMLTable';
import useWsSPMLJunction from './useWsSPMLJunction';
import PreviewFileModal from './components/PreviewFileModal';
import WorksheetSPMLToolbar from './components/WorksheetSPMLToolbar';
import NavigationDrawerSPML from './components/NavigationDrawerSPML';
import useWsSPMLLiveSync from './useWsSPMLLiveSync';
//-----------------------------------------------------------------------------------------------------------------
const SELECT_KPPN: {[key: string]: string} = {
  '010': 'Padang',
  '011': 'Bukittinggi',
  '090': 'Solok',
  '091': 'Lubuk Sikaping',
  '077': 'Sijunjung',
  '142': 'Painan',
};

//-----------------------------------------------------------------------------------------------------------------
export default function WorksheetSPMLWorkspace() {
  const [isInitialTableLoading, setIsInitialTableLoading] = useState(true);
  const [isWorksheetDetailLoading, setIsWorksheetDetailLoading] = useState(true);

  const {auth} = useAuth();

  const navigate = useNavigate();

  const params = new URLSearchParams(useLocation().search);
  
  const id = params.get('id') || "";

  const selectedKppnId = id || auth?.kppn || '';
  const selectedKppnName = SELECT_KPPN[selectedKppnId] || selectedKppnId;

  const {
    wsSPMLJunction,
    wsDetail,
    spmlScore,
    isScoreLoading,
    lastRefreshedAt,
    setWsSPMLJunction,
    getWsSPMLJunctionKanwil,
    getWorksheet,
    resetSPMLScore,
  } = useWsSPMLJunction();

  const activeWorksheetId = isInitialTableLoading
    ? undefined
    : wsSPMLJunction[0]?.worksheet_id;

  const initialLoadActionsRef = useRef({
    getWorksheet,
    getWsSPMLJunctionKanwil,
    resetSPMLScore,
    setWsSPMLJunction,
  });

  useEffect(() => {
    initialLoadActionsRef.current = {
      getWorksheet,
      getWsSPMLJunctionKanwil,
      resetSPMLScore,
      setWsSPMLJunction,
    };
  }, [getWorksheet, getWsSPMLJunctionKanwil, resetSPMLScore, setWsSPMLJunction]);

  useWsSPMLLiveSync(activeWorksheetId, selectedKppnId);

  const isPastDue = new Date().getTime() > new Date(wsDetail?.close_period || '').getTime();
  const areActionsDisabled = isWorksheetDetailLoading || !wsDetail || isPastDue;

  const scrollToChecklist = useCallback((junctionId: number) => {
    document
      .getElementById(`spml-checklist-${junctionId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  useEffect(() => {
    let isActive = true;
    const actions = initialLoadActionsRef.current;
    setIsInitialTableLoading(true);
    setIsWorksheetDetailLoading(true);
    actions.setWsSPMLJunction([]);
    actions.resetSPMLScore();

    actions.getWorksheet(selectedKppnId, { showOverlay: false }).finally(() => {
      if (isActive) setIsWorksheetDetailLoading(false);
    });
    actions.getWsSPMLJunctionKanwil(selectedKppnId, { showOverlay: false }).finally(() => {
      if (isActive) setIsInitialTableLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, [selectedKppnId]);

  return (
    <>
      <Helmet>
        <title> Salamaik | Worksheet SPML  </title>
      </Helmet>

      <Stack direction="column" justifyContent="space-between" sx={{mb: 5}}>
        <Stack direction='row' spacing={1} alignItems="center">
          <IconButton  
            onClick={() => navigate(-1)}
            sx={{display:auth?.kppn?.length===5?'flex':'none'}}
          >
            <Iconify icon={"eva:arrow-ios-back-outline"} />
          </IconButton> 
          <Typography variant="h4">
            {`KPPN ${id!==null ? SELECT_KPPN[id]:null}`}
          </Typography>
        </Stack>

      </Stack>

      <WorksheetSPMLToolbar
        wsSPMLJunction={wsSPMLJunction}
        kppnName={selectedKppnName}
        lastRefreshedAt={lastRefreshedAt}
        onSync={() => getWsSPMLJunctionKanwil(selectedKppnId, {
          showOverlay: false,
          refreshScore: true,
        })}
      />

      <Card
        sx={{ mx: 4}}
      >
        <CardHeader
          title={
            <Typography variant='h6' sx={{ mb: 2 }} textAlign={'center'}>
              Kertas Kerja SPML
            </Typography>
          }
        />
        
        <WorksheetSPMLTable
          wsSPMLJunction={wsSPMLJunction}
          spmlScore={spmlScore}
          isScoreLoading={isScoreLoading}
          isInitialLoading={isInitialTableLoading}
          isPastDue={areActionsDisabled}
        />

      </Card>
      <PreviewFileModal isDisabled={areActionsDisabled} kppn={id} />
      <NavigationDrawerSPML
        wsSPMLJunction={wsSPMLJunction}
        scrollToChecklist={scrollToChecklist}
      />
    </>
  )
}
