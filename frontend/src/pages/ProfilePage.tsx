/**
 * @Section param
 * 0: general tab
 * 1: security tab
 * 2: stats tab
 */

import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from '../components/iconify/Iconify';
// @mui
import { Container, Stack, Typography, Grid, IconButton} from '@mui/material';
import { useTheme } from '@mui/material/styles';
//sections
import ProfileTab from '../sections/profile/ProfileTab';
import General from '../sections/profile/General';
import Security from '../sections/profile/Security';
// import Stats from '../sections/profile/Stats';
// ----------------------------------------------------
export default function ProfilePage(){
  const theme = useTheme();

  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState< 0 | 1| 2 >(0);

  const handleBack = () => {
    navigate(-1)
  };

  const SELECT_SECTION: JSX.Element[] = [
    <General />,
    <Security />,
    // <Stats />
  ];

  return (
    <>
      <Helmet>
        <title> Salamaik | Profile</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
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
          <ProfileTab tabValue={tabValue} setTabValue={setTabValue}/>
        </Stack>

        <Grid container spacing={2} >
          {SELECT_SECTION[tabValue]}
        </Grid>

      </Container>

    </>
  )
}


