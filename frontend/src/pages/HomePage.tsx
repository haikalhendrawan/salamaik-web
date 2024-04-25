import {useEffect, useRef} from "react";
import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import { Grid, Container, Typography, Backdrop } from '@mui/material';
import PuffLoader from 'react-spinners/PuffLoader';
import useLoading from "../hooks/useLoading";
// sections
import WelcomeCard from "../sections/home/components/WelcomeCard";
import PhotoGallery from "../sections/home/components/PhotoGallery";
import KanwilView from "../sections/home/KanwilView";
// ----------------------------------------------------------------------

export default function HomePage() {
  const theme = useTheme();

  const {isLoading, setIsLoading} = useLoading();

  useEffect(() => {
    setIsLoading(true);

    const id = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(id)
  }, []);

  return (
    <>
      <Helmet>
        <title> Salamaik | Home  </title>
      </Helmet>

      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
           <WelcomeCard title="Welcome, Person 1" total={10} icon="eva:home-outline" />
          </Grid>

          <Grid item xs={12} md={4}>
            <PhotoGallery 
              title='Galeri Salamaik' 
              images={['01.jpg', '02.jpg', '03.jpg', '04.jpeg', '05.jpeg']}
              height={'300px'} 
            /> 
          </Grid>

          <KanwilView />

        </Grid>
      </Container>
    </>
  );
}


