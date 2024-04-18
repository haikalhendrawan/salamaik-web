import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { Container, Stack, Typography, Tabs, Tab, Grid, Paper, IconButton, Box, LinearProgress} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
//sections
import MatrixLanding from '../sections/matrix/MatrixLanding';
import MatrixDetail from '../sections/matrix/MatrixDetail';

// -----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function MatrixPage() {
  const theme = useTheme();

  return (
    <>
      <Container>
        <MatrixLanding />
      </Container>
    </>
  );
};
