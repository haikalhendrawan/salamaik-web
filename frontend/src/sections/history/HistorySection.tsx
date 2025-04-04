/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Grid, Stack, Typography, SelectChangeEvent } from '@mui/material';
import DataSelection from './DataSelection';
import FilterControl from './FilterControl';
import Findings from './Findings';
import Checklist from './Checklist';
import Standardization from './Standardization';
import Info from './Info';
import { PreviewFileModalProvider } from './Checklist/usePreviewFileModal';
import {PreviewFileModalProvider as PreviewFileModalProvider2} from './Standardization/usePreviewFileModal';
import { StandardizationProvider } from './Standardization/useStandardization';

export default function HistorySection() {
  const [selectedData, setSelectedData] = useState<number>(0);

  const [selectedUnit, setSelectedUnit] = useState<string>("0");

  const [selectedPeriod, setSelectedPeriod] = useState<number>(0);

  const isNoData = selectedData === 0;

  const isNoUnit = selectedUnit === '0';

  const isNoPeriod = selectedPeriod === 0;

  const SECTION = [
    <></>,
    <Findings selectedUnit={selectedUnit} selectedPeriod={selectedPeriod} selectedData={selectedData} />,
    <PreviewFileModalProvider>
      <Checklist selectedUnit={selectedUnit} selectedPeriod={selectedPeriod} selectedData={selectedData}/>
    </PreviewFileModalProvider>,
    <StandardizationProvider>
      <PreviewFileModalProvider2>
        <Standardization selectedUnit={selectedUnit} selectedPeriod={selectedPeriod} selectedData={selectedData} />
      </PreviewFileModalProvider2>
    </StandardizationProvider>,
    <Info selectedUnit={selectedUnit} selectedPeriod={selectedPeriod} selectedData={selectedData} />,
    <></>
  ];

  const handleChange = (event: SelectChangeEvent<unknown>, type: string) => {
    switch (type) {
      case 'data':
        setSelectedData(parseInt(event.target.value as string));
        break;
      case 'unit':
        setSelectedUnit(event.target.value as string);
        break;
      case 'period':
        setSelectedPeriod(parseInt(event.target.value as string));
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Helmet>
        <title> Salamaik | Riwayat Pembinaan </title>
      </Helmet>

      <Container maxWidth='xl'>
        <Stack direction='row' spacing={1} sx={{mb: 5}} maxWidth={'100%'}>
          <Typography variant="h4">
            {`Data Pembinaan`}
          </Typography>
        </Stack>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <DataSelection 
              selectedData={selectedData} 
              handleChange={handleChange} 
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <FilterControl
              selectedData={selectedData}
              selectedUnit={selectedUnit}
              selectedPeriod={selectedPeriod}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            {(!isNoData && !isNoUnit && !isNoPeriod) && SECTION[selectedData]}
          </Grid>
        </Grid>

      </Container>

    </>
  )
}
