import { Stack, Button, Box, Typography, Grid} from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
//-------------------------------------------------------------
const StatsContainer = styled(Box)(({theme}) => ({
  backgroundColor:theme.palette.background.neutral,
  borderRadius:'12px',
  padding:theme.spacing(2),
  height:'100%',
  display: 'flex', 
  flexDirection:'column',
  gap:theme.spacing(2), 
  alignItems:'start', 
  justifyContent:'start', 
}));

interface PeriodGridProps {
  changeSection: (section: number) => void;
};
//------------------------------------------------------------
export default function PeriodGrid({changeSection}: PeriodGridProps) {

  return(
    <div>
    <Grid container spacing={2} direction='row' alignItems='start' justifyContent='center' sx={{height:'40%', p:3,mb:3}}>
      <Grid item xs={6} sm={4} md={4}>
        <Typography variant='h6'>Periode</Typography>
        <Typography variant='body3'>Atur periodisasi kertas kerja, time period pembinaan, dll.</Typography>
      </Grid>
      <Grid item xs={6} sm={8} md={8} >
        <StatsContainer>
          <Grid container>
            <Grid item md={6}>
              <Typography variant='body2'>Periode Kertas Kerja</Typography>
            </Grid>
            <Grid item md={6}>
              <Stack direction='column' flex={'column'} alignItems='start'>
                <Button 
                  variant="contained" 
                  size="small" 
                  endIcon={<Iconify icon="solar:round-alt-arrow-right-bold" />}
                  onClick={() => changeSection(5)}
                >
                  Edit
                </Button>
                <Typography variant='body3'>assign kertas kerja, atur batas waktu pembinaan, dan lihat meta data </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item md={6}>
              <Typography variant='body2'>Periode Pembinaan</Typography>
            </Grid>
            <Grid item md={6}>
              <Stack direction='column' flex={'column'} alignItems='start'>
                <Button 
                  variant="contained" 
                  size="small" 
                  endIcon={<Iconify icon="solar:round-alt-arrow-right-bold" />}
                  onClick={() => changeSection(6)}
                >
                  Edit
                </Button>
                <Typography variant='body3'>gunakan menu ini apabila akan memulai periode pembinaan baru</Typography>
              </Stack>
            
            </Grid>
          </Grid>
        </StatsContainer>
      </Grid>
    </Grid>
  </div>
  )
}