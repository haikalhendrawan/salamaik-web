import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Stack, Typography, Box, Button } from '@mui/material';


// ----------------------------------------------------------------------

export default function Page404() {
  const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    paddingTop: theme.spacing(6),
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column', 
  }));

  return (
    <>
      <Helmet>
        <title> Salamaik | Not Found </title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center', mt:0}}>
          <Typography variant="h3" paragraph>
            Page Not Found
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            URL yang anda input mungkin salah
          </Typography>

          <Box
            component="img"
            src="illustration_404.svg"
            sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
          />

          <Button to="/" size="large" variant="contained" component={RouterLink}>
            Go to Home
          </Button>
        </StyledContent>

      </Container>
    </>
  );
}
