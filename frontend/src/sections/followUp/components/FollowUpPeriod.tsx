import {useState} from "react";
import {Card, Typography, Grid, FormControl, CardContent, Stack, LinearProgress, Box, Tooltip} from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import Scrollbar from "../../../components/scrollbar/Scrollbar";
import Label from "../../../components/label/Label";
// ----------------------------------------------
interface FollowUpPeriodProps {
  header: string,
  open: string | Date,
  close: string | Date
};

// ----------------------------------------------

export default function FollowUpPeriod({header, open, close}:FollowUpPeriodProps){
  const theme = useTheme();

  return(
    <Card sx={{height:'200px', borderRadius:'16px'}}>
      <CardContent>
        <Stack direction='column'>
          <Typography variant="subtitle2" sx={{mb:1}}>{header}</Typography>

            <Grid container spacing={1}>
              <Grid item xs={4} key={0}>
                <Stack direction='column' spacing={1}>
                  <Label color="success" sx={{fontSize:12}}> Open Period </Label>
                  <Typography variant='body2' fontSize='12' sx={{pl: 1}}>
                    {new Date(open).toLocaleDateString('en-GB')}
                  </Typography>
                  <Label color="error" sx={{fontSize:12}}> Close Period </Label>
                  <Typography variant='body2' fontSize='12' sx={{pl: 1}}>
                    {new Date(close).toLocaleDateString('en-GB')}
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={8} key={1}>
                <Box sx={{justifyContent:'center'}} dir="ltr" >
                  <img src='/image/Other 03.png' style={{height:'150px', margin: 'auto', marginTop: -25}} />
                </Box>
              </Grid>


            </Grid>

        </Stack>
      </CardContent>
    </Card>
  )
}
