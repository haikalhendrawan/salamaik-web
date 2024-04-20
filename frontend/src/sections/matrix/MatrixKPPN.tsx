import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// @mui
import { Container, Stack, Typography, Tabs, Tab, Grid, Paper, IconButton, Box, LinearProgress} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
import Iconify from '../../components/iconify/Iconify';
// sections
import ScorePembinaan from '../home/components/ScorePembinaan';
import ProgressPembinaan from '../home/components/ProgressPembinaan';
import RekapitulasiNilaiTable from './components/RekapitulasiNilaiTable';
import MatrixGateway from './components/MatrixGateway';
import SelectionTab from './components/SelectionTab';
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
export default function MatrixKPPN() {
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
        <title> Salamaik | Matrix </title>
      </Helmet>
      
      <Container maxWidth='xl'>
        <Stack direction='row' spacing={1} sx={{mb: 5}} maxWidth={'100%'}>
          <Typography variant="h4">
            {`Matriks`}
          </Typography>
        </Stack>

        <SelectionTab tab={tabValue} changeTab={handleTabChange} />
        
        <Stack direction='row'>
          <Grid container spacing={4}>
            <Grid item xs={5}>
              <Stack direction='column' spacing={2}>
                <ScorePembinaan
                  header={`Nlai Kinerja KPPN Padang`}
                  selfScore={9.77}
                  kanwilScore={9.45} 
                />
                <ProgressPembinaan 
                  header={`Progress Kertas Kerja`}
                  number={40.3}
                  footer={`KPPN Padang`}
                  detail={`20/20`}
                  icon={`mdi:cash-register`}
                  color={theme.palette.primary.main}
                />
              </Stack>
            
            </Grid>
            <Grid item xs={7}>
              <MatrixGateway
                title='Detail Matriks KPPN Padang'
                subheader='Lihat matriks Pembinaan dan Supervisi' 
              />
            </Grid>

            <Grid item xs={12}>
              <RekapitulasiNilaiTable />
            </Grid>
          </Grid>
          
          
        </Stack>
      </Container>
      
    </>
  )

}