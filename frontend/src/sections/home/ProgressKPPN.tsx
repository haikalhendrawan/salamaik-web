import {useState} from "react";
import {Card, Typography, Grid, Box, Tabs, Tab, CardContent, Stack} from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import Iconify from "../../components/iconify";
import RadialChart from "../../components/radialChart/RadialChart";
// ----------------------------------------------
interface ProgressKPPNProps {
  header: string,
  number: number,
  footer: string,
  icon: string,
  color: string
};

// ----------------------------------------------

export default function ProgressKPPN({header, number, footer, icon, color}: ProgressKPPNProps){
  const theme = useTheme();

  return(
    <Card sx={{height:'200px', borderRadius:'16px'}}>
      <CardContent>
        <Grid container>
          <Grid item xs={12} sm={6} md={6}>
            <Stack direction='column'>
              <Typography variant="subtitle2">{header}</Typography>

              <Typography variant="body2" color={theme.palette.text.secondary}>{ footer}</Typography>
            </Stack>

          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <RadialChart 
              chart={{
                labels:['20'],
                colors:theme.palette.primary.main,
                toColor:theme.palette.primary.dark,  
                series:[number]
                }} 
              />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}