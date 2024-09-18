/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { Helmet } from 'react-helmet-async';
import { Container, Grid, Stack, Typography } from '@mui/material';
import DataSelection from './DataSelection';
import FilterControl from './FilterControl';

export default function HistorySection() {
  return (
    <>
      <Helmet>
        <title> Salamaik | Riwayat Pembinaan </title>
      </Helmet>

      <Container maxWidth='xl'>
        <Stack direction='row' spacing={1} sx={{mb: 5}} maxWidth={'100%'}>
          <Typography variant="h4">
            {`Riwayat Pembinaan`}
          </Typography>
        </Stack>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <DataSelection />
          </Grid>

          <Grid item xs={12} md={8}>
            <FilterControl />
          </Grid>
        </Grid>

      </Container>

    </>
  )
}
