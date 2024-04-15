// @mui
import { Container, Stack, Typography, Grid,} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
// sections
import ScorePembinaan from '../home/components/ScorePembinaan';
import FollowUpProgress from './components/FollowUpProgress';
import AmountTemuan from './components/AmountTemuan';
import FollowUpPeriod from './components/FollowUpPeriod';

export default function FollowUpLanding() {
  const theme = useTheme();

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ mb: 5 }}>
        Tindak Lanjut
      </Typography>
      
      <Stack direction='row'>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <AmountTemuan
              header={`Jumlah Permasalahan`}
              subheader={`Pembinaan Semester 1 Tahun 2024 (Non-final)`}
              temuan={7}
            />
          </Grid>
          <Grid item xs={4}>
            <FollowUpProgress
              header={`Progress Tindak Lanjut`}
              number={40.3}
              footer={`s.d. 20 Mei 2024`}
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
            
          </Grid>
        </Grid>
        
        
      </Stack>

    </>
  )

}