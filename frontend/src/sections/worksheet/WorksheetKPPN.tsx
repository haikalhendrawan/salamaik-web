import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Iconify from '../../components/iconify';
import PreviewFileModal from './component/PreviewFileModal';
import useWsJunction from './useWsJunction';
//sections
import WorksheetCard from './component/WorksheetCard/WorksheetCard';
import InstructionPopover from './component/InstructionPopover';
import NavigationDrawer from "./component/NavigationDrawer";
import PageLoading from '../../components/pageLoading/PageLoading';
// @mui
import { Container, Stack, Typography, Tabs, Tab, Grid, Paper, 
        IconButton, Box, LinearProgress} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
import useDictionary from '../../hooks/useDictionary';
import { filterKomponen, filterSubkomponen } from './utils';
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

export default function WorksheetKPPN() {
  const theme = useTheme();

  const { wsJunction, getWsJunctionKanwil } = useWsJunction();

  const { subKomponenRef } = useDictionary();

  const navigate = useNavigate();

  const params = new URLSearchParams(useLocation().search);
  
  const id= params.get('id') || "";

  const [tabValue, setTabValue] = useState(1); // ganti menu komponen supervisi

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => { // setiap tab komponen berubah
    setTabValue(newValue);
  };

  const [open, setOpen] = useState<boolean>(false); // for preview file modal

  const [file, setFile] = useState<string | undefined>('https://jdih.kemenkeu.go.id/download/a321969c-4ce0-4073-81ce-df35023750b1/PER_1_PB_2023-Perubahan%20Atas%20PERDIRJEN%20No.PER-24_PB_2019%20tentang%20Pedoman%20Pembinaan%20&%20Supervisi%20Pelaksanaan%20Tugas%20KPPN.pdf'); // for preview file modal

  const handleOpenFile = () => {
    setOpen(true);
  };

  const handleCloseFile = () => {
    setOpen(false)
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getWsJunctionKanwil(id);
    setIsLoading(false);
  }, []);

  function scrollToElement(id: string){
    const element = document.getElementById(id);
    if(element) {
      window.scrollTo({ 
        top: element.offsetTop - 200,
        behavior: 'smooth' });
    }
  };

  const content = useCallback(() =>
    subKomponenRef?.filter(item => item?.komponen_id === tabValue)?.map((i) => (
      <>
        <Grid item xs={12} sm={12} md={12} key={i.id} id={"divider"+i.id.toString()}>
            <Stack direction='row'>
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
            const isStandardisasi = item.standardisasi === 1;
            const header = item.header ? `${item.header}` : "";
            return (
              <WorksheetCard 
                key={index}
                wsJunction={item}
                modalOpen={handleOpenFile}
                modalClose={handleCloseFile}
                id={"card"+ item.checklist_id.toString()}
              />
            );
          })}
      </>
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
                  <Tab icon={<Iconify icon="solar:safe-2-bold-duotone" />} label="Treasurer" value={1} />
                  <Tab icon={<Iconify icon="solar:buildings-2-bold-duotone" />} label="Pengelola Fiskal, Representasi Kemenkeu di Daerah, dan Special Mission" value={2} />
                  <Tab icon={<Iconify icon="solar:wallet-money-bold" />} label="Financial Advisor" value={3} />
                  <Tab icon={<Iconify icon="solar:incognito-bold-duotone" />} label="Tata Kelola Internal" value={4} />
                </Tabs>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Grid container spacing={2}>
                
                  {content()}

                </Grid>
              </Grid>

            </Grid>

          </Container>

          <PreviewFileModal open={open} modalClose={handleCloseFile} file={file} />

          {/* <InstructionPopover open={openInstruction} anchorEl={anchorEl} handleClose={handleCloseInstruction} /> */}

          <NavigationDrawer tabValue={tabValue} scrollToElement={scrollToElement}/> 
          
        </>
      }
    </>
  );
  
};

