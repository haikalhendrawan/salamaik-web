import {Card, Typography, Grid, CardContent, Stack, Box} from '@mui/material';
import Label from "../../../components/label/Label";
// ----------------------------------------------
interface PembinaanPeriodProps {
  header: string,
  open: string | Date,
  close: string | Date
};

// ----------------------------------------------

export default function PembinaanPeriod({header, open, close}: PembinaanPeriodProps){

  return(
    <Card sx={{height:'200px', borderRadius:'16px'}}>
      <CardContent>
        <Stack direction='column'>
          <Typography variant="subtitle2" sx={{mb:1}}>{header}</Typography>

            <Grid container spacing={1}>
              <Grid item xs={4} key={0}>
                <Stack direction='column' spacing={1} textAlign={'center'}>
                  <Label color='success' sx={{fontSize:12}}> Open Period </Label>
                  <Typography variant='body2' fontSize='12' >
                    {new Date(open).toLocaleDateString('en-GB')}
                  </Typography>
                  <Label color='error' sx={{fontSize:12}}> Close Period </Label>
                  <Typography variant='body2' fontSize='12'>
                    {new Date(close).toLocaleDateString('en-GB')}
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={8} key={1}>
                <Box sx={{justifyContent:'center'}} dir="ltr" >
                  <img src='/image/calendar_front.png' style={{height:'200px', margin: 'auto', marginTop: -50, marginLeft: 30}} />
                </Box>
              </Grid>
            </Grid>

        </Stack>
      </CardContent>
    </Card>
  )
}
