import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from '../components/iconify/Iconify';
import Label from '../components/label/Label';
// @mui
import { Container, Stack, Typography, Box, Avatar,  Grid, IconButton, Card} from '@mui/material';
import { useTheme } from '@mui/material/styles';
//sections
import ProfileTab from '../sections/profile/ProfileTab';


export default function ProfilePage(){
  const theme = useTheme();

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1)
  };

  return (
    <>
      <Helmet>
        <title> Salamaik | Profile</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Stack direction='row' spacing={1} alignItems="center">
            <IconButton onClick={handleBack}>
              <Iconify icon={"eva:arrow-ios-back-outline"} />
            </IconButton> 
            <Typography variant="h4" gutterBottom>
              Profile
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="start" mb={5}>
          <ProfileTab />
        </Stack>

        <Grid container spacing={2} >
         
        </Grid>

      </Container>

    </>
  )
}


