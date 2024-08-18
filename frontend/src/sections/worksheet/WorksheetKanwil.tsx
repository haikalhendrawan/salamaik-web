import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Iconify from '../../components/iconify';
import PreviewFileModal from './component/PreviewFileModal';
import useWsJunction from './useWsJunction';
import usePreviewFileModal from './usePreviewFileModal';
import { useAuth } from '../../hooks/useAuth';
//sections
import WorksheetCard from './component/WorksheetCard/WorksheetCard';
import NavigationDrawer from "./component/NavigationDrawer";
import PageLoading from '../../components/pageLoading/PageLoading';
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

// ----------------------------------------------------------------------

export default function WorksheetKanwil() {
  const { wsJunction, getWsJunctionKanwil, wsDetail, getWorksheet } = useWsJunction();

  const { subKomponenRef } = useDictionary();

  const { modalOpen, modalClose } = usePreviewFileModal();

  const {auth} = useAuth();

  const navigate = useNavigate();

  const params = new URLSearchParams(useLocation().search);
  
  const id= params.get('id') || "";

  const [tabValue, setTabValue] = useState(1); // ganti menu komponen supervisi

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => { // setiap tab komponen berubah
    setTabValue(newValue);
  };

  const [isLoading, setIsLoading] = useState(true);

  // const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    getWsJunctionKanwil(id);
    getWorksheet(id);
    setIsLoading(false);
  }, []);

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
              </Stack>

            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="center" mb={5}>
                <Tabs value={tabValue} onChange={handleTabChange}> 
                  <Tab icon={<Iconify icon="solar:safe-2-bold-duotone" />} label="Treasurer" value={1} key={1} />
                  <Tab icon={<Iconify icon="solar:buildings-2-bold-duotone" />} label="Pengelola Fiskal, Representasi Kemenkeu di Daerah, dan Special Mission" value={2} key={2}/>
                  <Tab icon={<Iconify icon="solar:wallet-money-bold" />} label="Financial Advisor" value={3} key={3}/>
                  <Tab icon={<Iconify icon="solar:incognito-bold-duotone" />} label="Tata Kelola Internal" value={4} key={4}/>
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

          <PreviewFileModal />

          <NavigationDrawer tabValue={tabValue} scrollToElement={scrollToElement}/> 
          
        </>
      }
    </>
  );
  
};

