/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {Card, Typography, Grid, CardContent, Stack} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import RadialChart from "../../../components/radialChart/RadialChart";
// ----------------------------------------------
interface ProgressPembinaanProps {
  header: string,
  number: number,
  footer: string,
  detail: string,
  icon: string,
  color: string
};

// ----------------------------------------------

export default function ProgressPembinaan({header, number, footer, detail}: ProgressPembinaanProps){
  const theme = useTheme();

  return(
    <Card sx={{height:'200px', borderRadius:'16px'}}>
      <CardContent>
        <Grid container>
          <Grid item xs={12} sm={6} md={5}>
            <Stack direction='column'>
              <Typography variant="subtitle2">{header}</Typography>

              <Typography variant="body2" color={theme.palette.text.secondary}>{ footer}</Typography>
            </Stack>

          </Grid>
          <Grid item xs={12} sm={6} md={7}>
            <Stack direction={'row'} alignItems="center"> 
              <RadialChart 
                chart={{
                  labels:[detail],
                  colors:theme.palette.primary.main,
                  toColor:theme.palette.primary.dark,  
                  series:[Number(number.toFixed(2))],
                }} 
              />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}