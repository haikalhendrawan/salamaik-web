/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Iconify from '../../components/iconify';
import PreviewFileModal from './component/PreviewFileModal';
import useWsJunction from './useWsJunction';
import usePreviewFileModal from './usePreviewFileModal';
import { useAuth } from '../../hooks/useAuth';
import useAxiosJWT from '../../hooks/useAxiosJWT';
//sections
import WorksheetCard from './component/WorksheetCard/WorksheetCard';
import NavigationDrawer from "./component/NavigationDrawer";
import PageLoading from '../../components/pageLoading/PageLoading';
import useExcelWorksheet from '../excel/useExcelWorksheet';
import useExcelWorksheet2 from '../excel/useExcelWorksheet2';
// @mui
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import styled from '@mui/material/styles/styled';
import useDictionary from '../../hooks/useDictionary';
import useSnackbar from '../../hooks/display/useSnackbar';
// import useLoading from '../../hooks/display/useLoading';
// -----------------------------------------------------------------------
const SubkomponenDivider = styled(Paper)(({theme}) => ({
  padding: theme.spacing(1),
  paddingRight: theme.spacing(2),
  backgroundColor: theme.palette.grey[200],
  maxWidth: 'fit-content',
  color: theme.palette.primary.dark,
  borderRadius: '16px',
  fontWeight: '600',
  fontSize: '0.875rem',
}));

const SELECT_KPPN: {[key: string]: string} = {
  '010': 'Padang',
 '011': 'Bukittinggi',
 '090': 'Solok',
 '091': 'Lubuk Sikaping',
 '077': 'Sijunjung',
 '142': 'Painan',
};

const KOMPONEN_ICON = ["solar:safe-2-bold-duotone", "solar:buildings-2-bold-duotone", "solar:wallet-money-bold", "solar:incognito-bold-duotone"];
// ----------------------------------------------------------------------

export default function WorksheetKanwil() {
  const { wsJunction, getWsJunctionKanwil, wsDetail, getWorksheet } = useWsJunction();

  const {
    komponenRef,
    subKomponenRef,
    subSubKomponenRef,
    loadWorksheetReferenceSnapshot,
    resetWorksheetReferenceSnapshot,
  } = useDictionary();

  const { modalOpen, modalClose } = usePreviewFileModal();
  const { openSnackbar } = useSnackbar();

  const {auth} = useAuth();

  const axiosJWT = useAxiosJWT();

  const navigate = useNavigate();

  const params = new URLSearchParams(useLocation().search);
  
  const id= params.get('id') || "";

  const [tabValue, setTabValue] = useState(komponenRef?.[0].id || 0);  // ganti menu komponen supervisi

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => { // setiap tab komponen berubah
    setTabValue(newValue);
  };

  const [isLoading, setIsLoading] = useState(true);

  const isPastDue = useMemo(() => auth?.peraturan === 2
    ? false
    : new Date().getTime() > new Date(wsDetail?.close_period || "").getTime(), [auth?.peraturan, wsDetail]);

  const handleExportExcel = async () => {
    try {
      const worksheetId = wsDetail?.id || wsJunction[0]?.worksheet_id;
      const peraturan = auth?.peraturan;
      if (!worksheetId) throw new Error('Worksheet PB tidak ditemukan');
      if (peraturan !== 1 && peraturan !== 2) throw new Error('Referensi peraturan tidak valid');

      const scoreResponse = await axiosJWT.get(
        `/scoringEngine/pb/${encodeURIComponent(worksheetId)}?peraturan=${peraturan}`
      );
      const pbScore = scoreResponse.data.rows;
      const kppnName = `KPPN ${SELECT_KPPN[id] || wsDetail?.alias || id}`;

      if (peraturan === 1) {
        await useExcelWorksheet(wsJunction, pbScore, komponenRef, subKomponenRef).generate();
      } else {
        await useExcelWorksheet2(
          wsJunction,
          kppnName,
          pbScore,
          komponenRef,
          subKomponenRef,
          subSubKomponenRef
        ).generate();
      }
    } catch (error: any) {
      console.error('Error generating PB worksheet Excel:', error);
    }
  };

  // const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    void (async () => {
      const detail = await getWorksheet(id);
      if (!detail?.id) {
        if (active) setIsLoading(false);
        return;
      }
      try {
        await loadWorksheetReferenceSnapshot(detail.id);
      } catch (error) {
        console.error('Unable to load worksheet reference snapshot:', error);
        openSnackbar('Referensi snapshot worksheet tidak tersedia. Data tidak dapat ditampilkan dengan aman.', 'error');
        if (active) setIsLoading(false);
        return;
      }
      await getWsJunctionKanwil(id);
      if (active) setIsLoading(false);
    })();
    return () => {
      active = false;
      void resetWorksheetReferenceSnapshot();
    };
  }, [id]);

  const scrollToElement = useCallback((id: string) => {
    const element = document.getElementById(id);
    if(element) {
      window.scrollTo({ 
        top: element.offsetTop - 200,
        behavior: 'smooth' });
    }
  }, []);

  const content = useMemo(() =>
    subKomponenRef?.filter(item => item?.komponen_id === tabValue)?.map((i) => (
      <React.Fragment key={i.id}>
        <Grid item xs={12} sm={12} md={12} key={i.id} id={"divider"+i.id.toString()}>
            <Stack direction='row' key={i.id}>
              <SubkomponenDivider>
                Subkomponen : {i.title}
              </SubkomponenDivider>
    
              <IconButton aria-label="edit" size='small' color='primary' onClick={() => scrollToElement("divider"+(i.id-1).toString())}>
                <Iconify icon="solar:round-arrow-up-bold"/>
              </IconButton>
    
              <IconButton aria-label="edit" size='small' color='primary' onClick={() => scrollToElement("divider"+(i.id+1).toString())}>
                <Iconify icon="solar:round-arrow-down-bold"/>
              </IconButton>
            </Stack>
        </Grid>
       
  
        {wsJunction
          ?.filter(item => item?.komponen_id === tabValue && item?.subkomponen_id === i?.id)
          .map((item, index) => {
            return (
              <WorksheetCard 
                key={index}
                wsJunction={item}
                wsDetail={wsDetail}
                modalOpen={modalOpen}
                modalClose={modalClose}
                id={"card"+ item.checklist_id.toString()}
              />
            );
          })}
      </React.Fragment>
    ))
  , [wsJunction, tabValue]);

  return (
    <>
      {isLoading 
        ?
          <PageLoading duration={1}/>
        : 
        <>
          <Helmet>
            <title> Salamaik | Worksheet</title>
          </Helmet>

          <Container maxWidth='xl'>
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
                  <IconButton onClick={handleExportExcel}>
                    <Iconify icon="vscode-icons:file-type-excel"/>
                  </IconButton>
              </Stack>

            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="center" mb={5}>
                <Tabs value={tabValue} onChange={handleTabChange}> 
                  {
                    komponenRef?.map((item, index) => (
                      <Tab icon={<Iconify icon={KOMPONEN_ICON[index]} />} label={item.title} value={item.id} key={item.id} />
                    ))
                  }
                </Tabs>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Grid container spacing={2}>
                
                  {content}

                </Grid>
              </Grid>

            </Grid>

          </Container>

          <PreviewFileModal isDisabled={isPastDue} kppn={id}/>

          <NavigationDrawer tabValue={tabValue} scrollToElement={scrollToElement}/> 
          
        </>
      }
    </>
  );
  
};

