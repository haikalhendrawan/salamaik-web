import {useState} from "react";
import {Card, Typography, Grid, CardHeader, CardContent, Stack, Button, Box, Tooltip} from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import Iconify from "../../../components/iconify/Iconify";
import Scrollbar from "../../../components/scrollbar/Scrollbar";
import Label from "../../../components/label/Label";
// ----------------------------------------------
interface DocumentShortProps {
  header: string,
  subheader: string,
  image: string
};

// ----------------------------------------------

export default function DocumentShort({header, subheader, image }:DocumentShortProps){
  const theme = useTheme();

  return(
    <Card sx={{height:'200px', borderRadius:'16px'}}>
      <CardHeader 
        title={<Typography variant="subtitle2">{header}</Typography>} 
        subheader={subheader} 
      />
      <CardContent>
        <Grid container spacing={1} sx={{height: '100%'}}>
          <Grid item xs={4} key={0} sx={{height: '100%'}}>
            <Button variant='contained' size='small' endIcon={<Iconify icon="solar:printer-2-bold-duotone" />} sx={{mt: 6}}>
              Print
            </Button>
          </Grid>

          <Grid item xs={8} key={1} sx={{height: '100%'}}>
            <Box sx={{justifyContent:'center', maxWidth:'100%'}} dir="ltr" >
              <img src={image} style={{maxWidth:'100%', margin: 'auto', marginTop: -70, marginLeft: 30}} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
