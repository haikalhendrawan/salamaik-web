import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// @mui
import { Container, Stack, Typography, Grid, IconButton, Breadcrumbs, Link} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
import Iconify from '../../components/iconify/Iconify';
// sections
import FollowUpProgress from './components/FollowUpProgress';
import AmountTemuan from './components/AmountTemuan';
import FollowUpPeriod from './components/FollowUpPeriod';
import FollowUpTable from './components/FollowUpTable';
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
export default function FollowUpKPPN() {
  const theme = useTheme();

  const navigate = useNavigate();
  
  const params = new URLSearchParams(useLocation().search);

  const id= params.get('id');

  return (
    <>
      <Container maxWidth='xl'>
        <Stack direction='row' spacing={1} alignItems="center" sx={{mb: 5}}>
          <IconButton  
            onClick={() => navigate(-1)}
          >
            <Iconify icon={"eva:arrow-ios-back-outline"} />
          </IconButton> 
          <Typography variant="h4" >
            {`KPPN ${id!==null ? SELECT_KPPN[id]:null}`}
          </Typography>
        </Stack>
        
        <Stack direction='row'>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <AmountTemuan
                header={`Jumlah Permasalahan`}
                subheader={`Periode Semester 1 Tahun 2024 (Non-final)`}
                temuan={7}
              />
            </Grid>
            <Grid item xs={4}>
              <FollowUpProgress
                header={`Progress Tindak Lanjut`}
                number={40.3}
                footer={`3/7 diselesaikan`}
                detail={'3/7'}
                icon={`mdi:cash-register`}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={4}>
              <FollowUpPeriod
                header={'Periode Tindak Lanjut'}
                open={'01-01-2024'}
                close={'05-01-2024'}
              />
            </Grid>

            <Grid item xs={12}>
              <FollowUpTable />
            </Grid>

          </Grid>
          
          
        </Stack>
      </Container>
    </>
  )

}