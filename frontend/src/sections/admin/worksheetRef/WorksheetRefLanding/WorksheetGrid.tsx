import { Button, Box, Typography, Grid} from '@mui/material';
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

interface WorksheetGridProps {
  changeSection: (section: number) => void;
};
//------------------------------------------------------------
export default function WorksheetGrid({changeSection}: WorksheetGridProps) {
  
  return(
    <div>
    <Grid container spacing={2} direction='row' alignItems='start' justifyContent='center' sx={{height:'40%', p:3, pb:0}}>
      <Grid item xs={6} sm={4} md={4}>
        <Typography variant='h6'>Kertas Kerja</Typography>
        <Typography variant='body3'>Atur referensi Kertas Kerja seperti jenis pertanyaan, dokumen, kriteria nilai, dll.</Typography>
      </Grid>
      <Grid item xs={6} sm={8} md={8} >
        <StatsContainer>
          <Grid container>
            <Grid item md={6}>
              <Typography variant='body2'>Checklist kertas kerja</Typography>
            </Grid>
            <Grid item md={6}>
              <Button 
                variant="contained" 
                size="small" 
                endIcon={<Iconify icon="solar:round-alt-arrow-right-bold" />}
                onClick={() => changeSection(1)}
                >
                Edit
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item md={6}>
              <Typography variant='body2'>Komponen</Typography>
            </Grid>
            <Grid item md={6}>
              <Button 
                variant="contained" 
                size="small" 
                endIcon={<Iconify icon="solar:round-alt-arrow-right-bold" />}
                onClick={() => changeSection(2)}
              >
                Edit
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item md={6}>
              <Typography variant='body2'>Sub komponen</Typography>
            </Grid>
            <Grid item md={6}>
              <Button 
                variant="contained" 
                size="small" 
                endIcon={<Iconify icon="solar:round-alt-arrow-right-bold" />}
                onClick={() => changeSection(3)}
              >
                Edit
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item md={6}>
              <Typography variant='body2'>Sub Sub Komponen</Typography>
            </Grid>
            <Grid item md={6}>
             <Button 
                variant="contained" 
                size="small" 
                endIcon={<Iconify icon="solar:round-alt-arrow-right-bold" />}
                onClick={() => changeSection(4)}
              >
                Edit
              </Button>
            </Grid>
          </Grid>

        </StatsContainer>
      </Grid>
    </Grid>
  </div>
  )
}