/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useMemo } from 'react';
import { Container, Stack, Typography, Grid, FormControl} from '@mui/material';
import useDictionary from '../../hooks/useDictionary';
// sections
import PageLoading from '../../components/pageLoading/PageLoading';
import StandardizationTable from './components/StandardizationTable';
import DocumentShort from './components/DocumentShort';
import AmountShort from './components/AmountShort';
import PreviewFileModal from './components/PreviewFileModal';
import DocumentZip from './components/DocumentZip';
import useStandardization from './useStandardization';
import usePreviewFileModal from './usePreviewFileModal';
import { useAuth } from '../../hooks/useAuth';
import { getAmountShort, getReportingMonth } from './utils';
import { StyledSelect, StyledSelectLabel, StyledMenuItem } from '../../components/styledSelect';
import { clusterize } from './utils';
// --------------------------------------------------------------

// --------------------------------------------------------------
export default function StandardizationKPPN() {
  const [loading, setLoading] = useState(true);

  const {kppnRef, periodRef} = useDictionary();

  const {getStandardization, standardization, dasar, selectedDasar, setSelectedDasar} = useStandardization();

  const clusteredStandardization = clusterize(standardization);

  const {auth} = useAuth();

  const tabValue = auth?.kppn || '';

  const {open, modalOpen, modalClose, file} = usePreviewFileModal();

  const isEvenPeriod = periodRef?.list?.filter((item) => item.id === auth?.period)?.[0]?.even_period || 0;

  const reportingDate = 15;

  const amountShort = getAmountShort(standardization, isEvenPeriod, reportingDate);
  
  const unitName = useMemo(() => (
    kppnRef?.list?.filter((item) => item.id === tabValue)[0]?.alias || ''
  ),[kppnRef, tabValue]);

  const handleChangeDasar = (e: any) => {
    setSelectedDasar(e.target.value as string);
    getStandardization(tabValue, e.target.value);
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

        <Grid container spacing={4} sx={{mb: 4}}>
          <Grid item xs={4}>
            <AmountShort 
              header='Jumlah Kekurangan Dokumen' 
              subheader={`Periode Pelaporan ${getReportingMonth(reportingDate)}`}
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
                <FormControl style={{width:'30%'}}>
                  <StyledSelectLabel id="dasar-select-label">Dasar</StyledSelectLabel>
                  <StyledSelect
                    name="dasar"
                    label="Dasar"
                    labelId="dasar-select-label"
                    size="small"
                    value={selectedDasar}
                    onChange={handleChangeDasar}
                    defaultValue={selectedDasar}
                  >
                    {dasar?.map(item => <StyledMenuItem value={item.id}>{item.dasar}</StyledMenuItem>)}
                  </StyledSelect>
                </FormControl>

                {
                  clusteredStandardization?.map((item, index) => (
                    <StandardizationTable 
                      header={item.cluster_name} 
                      modalOpen={modalOpen} 
                      kppnTab={tabValue} 
                      cluster={item.cluster} 
                      key={index}
                    />
                  ))
                }
              </>
          }
          
        </Stack>
      </Container>

      <PreviewFileModal open={open} modalClose={modalClose} file={file} kppnId={tabValue} />
    </>
  )

}