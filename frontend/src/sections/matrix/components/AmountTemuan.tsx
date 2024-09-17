/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {Card, Typography, Grid, CardContent, Stack, Slide} from '@mui/material';
import {useTheme} from '@mui/material/styles';
// ----------------------------------------------
interface AmountTemuanProps {
  header: string,
  subheader: string,
  temuan: number
};

// ----------------------------------------------

export default function AmountTemuan({header, temuan}: AmountTemuanProps){
  const theme = useTheme();

  return(
    <Card sx={{height:'200px', borderRadius:'16px'}}>
      <CardContent sx={{height:'100%'}}>
        <Grid container sx={{height:'100%'}}>
          <Grid item xs={12} sm={6} md={6}>
            <Stack direction='column' spacing={1} sx={{height:'100%'}} justifyContent={'space-between'} >
              <Stack direction='column'>
                <Typography variant="subtitle2">{header}</Typography>

                <Slide direction="left" in>
                  <Typography variant="body2" color={theme.palette.text.secondary}>{`Periode semester 1 2024 (non-final)`}</Typography>
                </Slide>
                
              </Stack>

            </Stack>

          </Grid>
          <Grid item xs={12} sm={6} md={6} sx={{display:'flex', height:'100%', alignContent:'center', alignItems:'center', justifyContent:'center'}}>
            <Stack direction={'row'} alignItems="center"> 
              
              <Slide direction="left" in>
               <Typography variant="h2" color='primary'>{temuan}</Typography>
              </Slide>

            </Stack>

          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}