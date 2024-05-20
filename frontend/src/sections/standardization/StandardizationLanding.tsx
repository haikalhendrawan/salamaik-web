import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// @mui
import { Container, Stack, Typography, Grid, IconButton, Breadcrumbs, Link} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
// sections
import SelectionTab from './components/SelectionTab';
import PageLoading from '../../components/pageLoading/PageLoading';
import StandardizationTable from './components/StandardizationTable';
import DocumentShort from './components/DocumentShort';
import AmountShort from './components/AmountShort';
import PreviewFileModal from './components/PreviewFileModal';
import useStandardization from './useStandardization';
import usePreviewFileModal from './usePreviewFileModal';
// --------------------------------------------------------------
const SELECT_KPPN: {[key: string]: string} = {
  '010': 'Padang',
  '011': 'Bukittinggi',
  '090': 'Solok',
  '091': 'Lubuk Sikaping',
  '077': 'Sijunjung',
  '142': 'Painan',
};

// --------------------------------------------------------------
export default function StandardizationLanding() {
  const theme = useTheme();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(useLocation().search);

  const {getStandardization} = useStandardization();

  const id= params.get('id');

  const {open, modalOpen, modalClose, changeFile, file} = usePreviewFileModal();

  const [tabValue, setTabValue] = useState('010'); // ganti menu komponen supervisi

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => { // setiap tab komponen berubah
    setTabValue(newValue);
  };

  useEffect(() => {
    async function getData(){
      try{
        await getStandardization(tabValue);
        setLoading(false);
      }catch(err){
        setLoading(false);
      }
    }
    setLoading(true);
    getData();

  }, [tabValue]);

  return (
    <>
      <Helmet>
        <title> Salamaik | Standardisasi KPPN </title>
      </Helmet>

      <Container maxWidth='xl'>
        <Stack direction='row' spacing={1} sx={{mb: 5}} maxWidth={'100%'}>
          <Typography variant="h4">
            {`Standardisasi KPPN`}
          </Typography>
        </Stack>

        <SelectionTab tab={tabValue} changeTab={handleTabChange} />

        <Grid container spacing={4} sx={{mb: 4}}>
          <Grid item xs={4}>
            <AmountShort header='Jumlah Kekurangan Dokumen' subheader='Per 20 Mei 2024' short={4} />
          </Grid>

          <Grid item xs={4}>
            <DocumentShort header='Monitoring Kekurangan Per KPPN' subheader='KPPN Padang' image='/image/Other 12.png'/>
          </Grid>

          <Grid item xs={4}>
            <DocumentShort header='Monitoring Kekurangan' subheader='Seluruh KPPN' image='/image/Other 09.png'/>
          </Grid>

        </Grid>

        <Stack direction='column' spacing={4}>
          {loading
            ?<PageLoading duration={2}/>
            : <>
                <StandardizationTable 
                  header={'Manajemen Eksternal'} 
                  modalOpen={modalOpen} 
                  kppnTab={tabValue}
                  cluster={1} 
                />
                <StandardizationTable 
                  header={'Penguatan Kapasitas Perbendaharaan'} 
                  modalOpen={modalOpen} 
                  kppnTab={tabValue} 
                  cluster={2} 
                />
                <StandardizationTable 
                  header={'Penguatan Manajemen Internal'} 
                  modalOpen={modalOpen} 
                  kppnTab={tabValue}
                  cluster={3}  
                />
              </>
          }
          
        </Stack>
      </Container>

      <PreviewFileModal open={open} modalClose={modalClose} file={file} kppnId={tabValue} />
    </>
  )

}