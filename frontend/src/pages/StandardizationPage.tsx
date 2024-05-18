import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { Container, Stack, Typography, Tabs, Tab, Grid, Paper, IconButton, Box, LinearProgress} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
//sections
import StandardizationLanding from '../sections/standardization/StandardizationLanding';
import { StandardizationProvider } from '../sections/standardization/useStandardization';

// -----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function StandardizationPage() {
  const theme = useTheme();

  return (
    <>
      <StandardizationProvider>
        <StandardizationLanding/>
      </StandardizationProvider>
    </>
  );
};
