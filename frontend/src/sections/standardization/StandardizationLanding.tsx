import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// @mui
import { Container, Stack, Typography, Grid, IconButton, Breadcrumbs, Link} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
import Iconify from '../../components/iconify/Iconify';
// sections
import SelectionTab from './components/SelectionTab';
import StandardizationTable from './components/StandardizationTable';
import DocumentShort from './components/DocumentShort';
import AmountShort from './components/AmountShort';
import useStandardization from './useStandardization';
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
  
  const params = new URLSearchParams(useLocation().search);

  const id= params.get('id');

  const [tabValue, setTabValue] = useState(0); // ganti menu komponen supervisi

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => { // setiap tab komponen berubah
    setTabValue(newValue);
  };


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
          <StandardizationTable />

          <StandardizationTable />

          <StandardizationTable />
        </Stack>

        
      </Container>
    </>
  )

}