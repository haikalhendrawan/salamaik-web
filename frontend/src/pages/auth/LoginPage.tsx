/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Box} from '@mui/material';
// sections
import { LoginForm } from '../../sections/auth/login';


// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: '720px', 
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.primary.main
}));


const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));


// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Salamaik | Login</title>
      </Helmet>

      <StyledRoot>
        <Box
          component="img"
          src="/logo/salamaik-long.png"
          sx={{ width: 120, height: 30, cursor: 'pointer', position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 }, }}
        />
          <StyledSection>
            {/* <img
              src={'/image/Other 14.png'}
              alt="background"
              style={{
                width: '80%',
                height: '80%',
                background:'cover',
                fill: '#FFFFFF',
              }}
            /> */}
          </ StyledSection>
          
        <Container maxWidth="sm" >
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Sign In to Salamaik
            </Typography>
            <Typography sx={{mb:5}}>
              Belum punya akun? <Link sx={{ml:0.5}} variant="subtitle1" underline="hover" href='/register'>Register</Link>
            </Typography>

            <LoginForm />   {/* logika dihandle di komponen ini */}
            
            <div style={{width: 480, textAlign:'center', position:'fixed', bottom: 0, margin: 'auto', marginBottom: 10}}>
              <Typography variant='body2' color="text.secondary">Copyright © 2024 Kanwil DJPb Prov Sumbar</Typography>
            </div>
          </StyledContent>
          {/* <Stack direction="column" justifyContent="center" alignItems="center" spacing={0} sx={{bottom:10, position:'fixed', width:'100%'}}> */}

              
          {/* </Stack> */}
        </Container>
      </StyledRoot>
    </>
  );
}
