/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useMemo } from 'react';
import { Container, Stack, Typography, Grid} from '@mui/material';
import useDictionary from '../../hooks/useDictionary';
// sections
import SelectionTab from './components/SelectionTab';
import PageLoading from '../../components/pageLoading/PageLoading';
import StandardizationTable from './components/StandardizationTable';
import DocumentShort from './components/DocumentShort';
import DocumentZip from './components/DocumentZip';
import AmountShort from './components/AmountShort';
import PreviewFileModal from './components/PreviewFileModal';
import useStandardization from './useStandardization';
import usePreviewFileModal from './usePreviewFileModal';
import { useAuth } from '../../hooks/useAuth';
import { getAmountShort, getReportingMonth } from './utils';
// --------------------------------------------------------------

// --------------------------------------------------------------
export default function StandardizationKanwil() {
  const [loading, setLoading] = useState(true);

  const {kppnRef, periodRef} = useDictionary();

  const {getStandardization, standardization} = useStandardization();

  const {auth} = useAuth();

  const {open, modalOpen, modalClose, file} = usePreviewFileModal();

  const [tabValue, setTabValue] = useState('010'); // ganti menu komponen supervisi

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => { // setiap tab komponen berubah
    setTabValue(newValue);
  };

  const isEvenPeriod = periodRef?.list?.filter((item) => item.id === auth?.period)?.[0]?.even_period || 0;

  const reportingDate = 15;

  const amountShort = getAmountShort(standardization, isEvenPeriod, reportingDate);
  
  const unitName = useMemo(() => (
    kppnRef?.list?.filter((item) => item.id === tabValue)[0]?.alias || ''
  ),[kppnRef, tabValue]);

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
            <AmountShort 
              header='Jumlah Kekurangan Dokumen' 
              subheader={`Periode Pelaporan ${getReportingMonth(reportingDate)} ${new Date().getFullYear()}`}
              short={amountShort*-1} 
            />
          </Grid>

          <Grid item xs={4}>
            <DocumentShort 
              header='Monitoring Kekurangan Dokumen' 
              subheader={`${unitName}`} 
              image='/image/Other 09.png'
              tabValue={tabValue}
            />
          </Grid>

          <Grid item xs={4}>
            <DocumentZip  
              header='Unduh File Bulanan (zip)' 
              subheader={`${unitName}`} 
              image='/image/Other 12.png'
              tabValue={tabValue}
            />
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