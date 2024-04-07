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
import ProgressKPPN from "../sections/home/ProgressKPPN";
import KPPNScore from "../sections/home/KPPNScore";
import ProgressKomponen from "../sections/home/ProgressKomponen";
// ----------------------------------------------------------------------

export default function HomePage() {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Dashboard | Salamaik  </title>
      </Helmet>

      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
           <WelcomeCard title="Welcome, Person 1" total={10} icon="eva:home-outline" />
          </Grid>

          <Grid item xs={12} md={4}>
           <ImageSlider /> 
          </Grid>

          <Grid item xs={12} md={4}>
            <ProgressKPPN 
              header={`Progress Kertas Kerja`}
              number={40.3}
              footer={`s.d. 20 Mei 2024`}
              icon={`mdi:cash-register`}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ProgressKomponen
              header={`Progress Per Komponen`}
              number={90.3}
              footer={`16/20 Dokumen diupload`}
              icon={`mdi:cash-register`}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <KPPNScore 
              header={`Nilai Pembinaan KPPN`}
              number={9.45}
              footer={`Berdasarkan Self Assessment`}
              icon={`mdi:cash-register`}
              color={theme.palette.primary.main}
            />
          </Grid>

        </Grid>
      </Container>
    </>
  );
}


