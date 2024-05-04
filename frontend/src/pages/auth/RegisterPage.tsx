import { Helmet } from 'react-helmet-async';
import {useState, useEffect} from 'react';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Box} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
// sections
import RegisterForm from '../../sections/auth/register/RegisterForm';
import RegisterOtp from '../../sections/auth/register/RegisterOtp';
import RegisterSuccess from '../../sections/auth/register/RegisterSuccess';
// ----------------------------------------------------------------------
const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: '480px', 
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.primary.main
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 720,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
  paddingBottom:theme.spacing(2)
}));


// ----------------------------------------------------------------------

export default function RegisterPage() {
  const [view, setView] = useState<0 | 1 | 2>(0);

  const SECTION = [
    <RegisterSuccess />,
    <RegisterOtp />,
    <RegisterForm />,


  ];

  return (
    <>
      <Helmet>
        <title> Salamaik | Register</title>
      </Helmet>

      <StyledRoot>
        <Box
          component="img"
          src="/logo/salamaik-long.png"
          sx={{ 
            width: 120, 
            height: 30, 
            cursor: 'pointer', 
            position: 'fixed', 
            backgroundColor: 'white',
            top: { xs: 16, md: 24 },
            left: { xs: 16, md: 24 }, 
          }}
        />

        <StyledSection />
          
        <Container  >
          <StyledContent>

            {SECTION[view]}
            <Stack 
              direction="column" 
              justifyContent="center" 
              alignItems="center" 
              sx={{width: '100%', mt: 'auto' }}>
              <Typography variant='body2'>Copyright © 2024 Kanwil DJPb Prov Sumbar</Typography>
            </Stack>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
