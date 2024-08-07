import {useEffect, useRef, useState} from "react";
import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme} from '@mui/material/styles';
import { Grid, Container, Snackbar, Alert, Button } from '@mui/material';
import useSocket from "../hooks/useSocket";
import useLoading from "../hooks/display/useLoading";
import useSnackbar from "../hooks/display/useSnackbar";
import { useAuth } from "../hooks/useAuth";
// sections
import WelcomeCard from "../sections/home/components/WelcomeCard";
import PhotoGallery from "../sections/home/components/PhotoGallery";
import KanwilView from "../sections/home/KanwilView";
// ----------------------------------------------------------------------

export default function HomePage() {
  const theme = useTheme();

  const {openSnackbar} = useSnackbar();

  const {setIsLoading} = useLoading();

  const {auth} = useAuth() as AuthType;

  const {socket} = useSocket();

  useEffect(() => {
    socket?.emit("getData", {
      kppn: "010",
      period: auth?.period
    }, (response: any) => {
      console.log(response);
    })

    setIsLoading(true);
    const id = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(id);
    };
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

          {/* <Button onClick={submitEvent}>Button</Button>
          <Button onClick={() => socketRef.current.disconnect()}>disconnect</Button> */}

          <KanwilView />

        </Grid>
      </Container>
    </>
  );
}


