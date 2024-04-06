import {useEffect, useRef} from "react";
import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, LinearProgress, Button, Box } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import WelcomeCard from "../sections/home/WelcomeCard";
import ImageSlider from "../components/ImageSlider";
// ----------------------------------------------------------------------

export default function HomePage() {

  return (
    <>
      <Helmet>
        <title> Dashboard | Salamaik  </title>
      </Helmet>

      <Container maxWidth="xl">
        <Grid container spacing={3} padding={1}>
          <Grid item xs={12} sm={12} md={8} sx={{pt:0, pl:3}}>
           <WelcomeCard title="Welcome, Person 1" total={10} icon="eva:home-outline" />
          </Grid>

          <Grid item xs={12} sm={12} md={4} sx={{pt:0, pl:3 }}>
           <ImageSlider /> 
          </Grid>

          <Grid item xs={12} md={12} lg={5} >
          C 
          </Grid>
          <Grid item xs={12} md={12} lg={7}>
           D
          </Grid>
        </Grid>
      </Container>
    </>
  );
}


