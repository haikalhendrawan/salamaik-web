import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/iconify/Iconify';
import Label from '../../components/label/Label';
import StyledTextField from '../../components/styledTextField';
// @mui
import { Stack, Box, FormControl,  Grid, IconButton, Card, Typography, Slide} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
// ---------------------------------------------------------
const ResetPassContainer = styled(Box)(({theme}) => ({
  height:'100%',
  display: 'flex', 
  flexDirection:'column', 
  alignItems:'start', 
  justifyContent:'start', 
  marginTop:theme.spacing(5),
  gap:theme.spacing(3)
}));


// ---------------------------------------------------------

export default function Stats(){
  const theme = useTheme();


  return(
    <>
      
      <Grid item xs={12} sm={12} md={12}>
        <Slide direction="right" in mountOnEnter unmountOnExit>
          <Card sx={{height:350}}>
            <Grid container xs={12} sm={12} md={12} spacing={3} alignItems='center' justifyContent='center' sx={{height:'100%', p:2}}>
              <Grid item xs={6} sm={4} md={4}>
                <Typography variant='h6'>Activity</Typography>
              </Grid>
              <Grid item xs={6} sm={8} md={8} sx={{backgroundColor:theme.palette.grey[200], borderRadius:'12px' }}>
                B
              </Grid>
              <Grid item xs={6} sm={4} md={4}>
                Contribution
              </Grid>
              <Grid item xs={6} sm={8} md={8} sx={{backgroundColor:theme.palette.grey[200], borderRadius:'12px'}}>
                D
              </Grid>
            </Grid>
          </Card>
        </Slide>
      </Grid>

    </>
  )
}