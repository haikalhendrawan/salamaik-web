import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
//sections
import MatrixLanding from '../sections/matrix/MatrixLanding';
// @mui
import { Container, Stack, Typography, Tabs, Tab, Grid, Paper, IconButton, Box, LinearProgress} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
// -----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function MatrixPage() {
  const theme = useTheme();

  return (
    <>
      <Container>
        <Typography variant="h4" gutterBottom sx={{ mb: 5 }}>
          Matriks
        </Typography>

        <MatrixLanding />

      </Container>
    </>
  );
};
