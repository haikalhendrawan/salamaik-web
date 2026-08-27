/**
 * Salamaik Client
 * © Kanwil DJPb Sumbar 2024
 */

import { useCallback, useEffect } from 'react';
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
    getWsSPMLJunctionKanwil,
    getWorksheet,
    resetSPMLScore,
  } = useWsSPMLJunction();

  const activeWorksheetId = wsSPMLJunction[0]?.worksheet_id;

  useWsSPMLLiveSync(activeWorksheetId, selectedKppnId);

  const isPastDue = new Date().getTime() > new Date(wsDetail?.close_period || '').getTime();

  const scrollToChecklist = useCallback((junctionId: number) => {
    document
      .getElementById(`spml-checklist-${junctionId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  useEffect(() => {
    resetSPMLScore();
    getWorksheet(selectedKppnId);
    getWsSPMLJunctionKanwil(selectedKppnId);

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
        />

      </Card>
      <PreviewFileModal isDisabled={isPastDue} kppn={id} />
      <NavigationDrawerSPML
        wsSPMLJunction={wsSPMLJunction}
        scrollToChecklist={scrollToChecklist}
      />
    </>
  )
}
