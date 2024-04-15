// @mui
import { Container, Stack, Typography, Tabs, Tab, Grid, Paper, IconButton, Box, LinearProgress} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
// sections
import ScorePembinaan from '../home/components/ScorePembinaan';
import ProgressPembinaan from '../home/components/ProgressPembinaan';
import RekapitulasiNilaiTable from './components/RekapitulasiNilaiTable';
import MatrixGateway from './components/MatrixGateway';

export default function MatrixLanding() {
  const theme = useTheme();

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ mb: 5 }}>
        Matriks
      </Typography>
      
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
                header={`Nlai Kinerja KPPN (avg)`}
                selfScore={9.77}
                kanwilScore={9.45} 
              />
              <ProgressPembinaan 
                header={`Progress Kertas Kerja`}
                number={40.3}
                footer={`s.d. 20 Mei 2024`}
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

    </>
  )

}