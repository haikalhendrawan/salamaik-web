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


export default function FollowUpKPPN() {
  const theme = useTheme();

  const navigate = useNavigate();

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
                Tindak Lanjut
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction='row' spacing={2} sx={{ml:6}}>
                <Breadcrumbs aria-label="breadcrumb">
                  <Link 
                    underline="hover" 
                    color="inherit" 
                    sx={{cursor:'pointer'}}
                    href="/worksheet" 
                  >
                    Tindak Lanjut
                  </Link>
                  <Typography color="text.primary">
                    {`KPPN Padang`}
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Stack>

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