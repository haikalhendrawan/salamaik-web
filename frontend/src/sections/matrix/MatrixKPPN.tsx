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
  return (
    <>
      <Container maxWidth='xl'>
        <Stack direction="column" justifyContent="space-between" sx={{mb: 5}}>
            <Stack direction='row' spacing={1} alignItems="center">
              <IconButton  
                onClick={() => navigate(-1)}
              >
                <Iconify icon={"eva:arrow-ios-back-outline"} />
              </IconButton> 
              <Typography variant="h4" >
                {`KPPN ${id!==null ? SELECT_KPPN[id]:null}`}
              </Typography>
            </Stack>
        </Stack>
        
        <Stack direction='row'>
          <Grid container spacing={4}>
            {/* <Grid item xs={4}>
              <ProgressPembinaan 
                header={`Progress Kertas Kerja`}
                number={40.3}
                footer={`s.d. 20 Mei 2024`}
                icon={`mdi:cash-register`}
                color={theme.palette.primary.main}
              />
            </Grid> */}
            <Grid item xs={5}>
              <Stack direction='column' spacing={2}>
                <ScorePembinaan
                  header={`Nlai Kinerja KPPN`}
                  selfScore={9.77}
                  kanwilScore={9.45} 
                />
                <ProgressPembinaan 
                  header={`Progress Kertas Kerja`}
                  number={40.3}
                  footer={`20 Mei 2024`}
                  detail={`20/20`}
                  icon={`mdi:cash-register`}
                  color={theme.palette.primary.main}
                />
              </Stack>
            
            </Grid>
            <Grid item xs={7}>
              <MatrixGateway
                title='Detail Matriks'
                subheader='Lihat matriks Pembinaan dan Supervisi' 
              />
            </Grid>
            {/* <Grid item xs={4}>
              <AmountTemuan
                header={`Jumlah Permasalahan`}
                subheader={`(non-final)`}
                temuan={7}
              />
            </Grid> */}
            <Grid item xs={12}>
              <RekapitulasiNilaiTable />
            </Grid>
          </Grid>
          
          
        </Stack>
      </Container>
      
    </>
  )

}