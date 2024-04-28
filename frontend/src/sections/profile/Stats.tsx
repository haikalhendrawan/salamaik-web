import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/iconify/Iconify';
import Label from '../../components/label/Label';
import StyledTextField from '../../components/styledTextField';
// @mui
import { Stack, Box, FormControl,  Grid, IconButton, Card, Typography, Slide} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
// ---------------------------------------------------------
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


// ---------------------------------------------------------

export default function Stats(){
  const theme = useTheme();

  return(
    <>
      <Grid item xs={12} sm={12} md={12}>
        <Slide direction="right" in mountOnEnter unmountOnExit>
          <Card sx={{height:480}}>
            <Grid container spacing={2} direction='row' alignItems='start' justifyContent='center' sx={{height:'40%', p:3, pr:5, mb:3}}>
              <Grid item xs={6} sm={4} md={4}>
                <Typography variant='h6'>Activity</Typography>
                <Typography variant='body3'>information of your general activity on this site</Typography>
              </Grid>
              <Grid item xs={6} sm={8} md={8} >
                <StatsContainer>
                  <Grid container>
                    <Grid item md={6}>
                      <Typography variant='body2'>Time spent on this site</Typography>
                    </Grid>
                    <Grid item md={6}>
                      <Typography variant='body3'>8 minute</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item md={6}>
                      <Typography variant='body2'>Time spent reading juknis/peraturan</Typography>
                    </Grid>
                    <Grid item md={6}>
                      <Typography variant='body3'>8 minute</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item md={6}>
                      <Typography variant='body2'>Last activity</Typography>
                    </Grid>
                    <Grid item md={6}>
                      <Typography variant='body3'>24 mar 2024 15:30:12</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item md={6}>
                      <Typography variant='body2'>Last login Address</Typography>
                    </Grid>
                    <Grid item md={6}>
                      <Typography variant='body3'>10.20.12.40 near Bukittinggi, West Sumatra</Typography>
                    </Grid>
                  </Grid>

                </StatsContainer>
              </Grid>
            </Grid>
            <Grid container spacing={2} direction='row' alignItems='start' justifyContent='center' sx={{height:'40%', p:3, pr:5, mb:3}}>
              <Grid item xs={6} sm={4} md={4}>
                <Typography variant='h6'>Contribution</Typography>
                <Typography variant='body3'>shows how much you contribute to the team</Typography>
              </Grid>
              <Grid item xs={6} sm={8} md={8} >
                <StatsContainer>
                  <Grid container>
                    <Grid item md={6}>
                      <Typography variant='body2'>Number of worksheet filled</Typography>
                    </Grid>
                    <Grid item md={6}>
                      <Typography variant='body3'>12</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item md={6}>
                      <Typography variant='body2'>Percentage of worksheet filled</Typography>
                    </Grid>
                    <Grid item md={6}>
                      <Typography variant='body3'>50%</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item md={6}>
                      <Typography variant='body2'>Number of files uploaded</Typography>
                    </Grid>
                    <Grid item md={6}>
                      <Typography variant='body3'>4</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item md={6}>
                      <Typography variant='body2'>Top component filled by frequency</Typography>
                    </Grid>
                    <Grid item md={6}>
                      <Typography variant='body3'>Komponen Treasurer, sub komponen Pengelolaan APBD</Typography>
                    </Grid>
                  </Grid>
                </StatsContainer>
              </Grid>
            </Grid>
          </Card>
        </Slide>
      </Grid>

    </>
  )
}