import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { Container, Stack, Typography, Tabs, Tab, Grid, Paper, IconButton, Box, LinearProgress} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
//sections
import FollowUpKPPN from '../sections/followUp/FollowUpKPPN';

// -----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function FollowUpPage() {
  const theme = useTheme();

  return (
    <>
      <FollowUpKPPN />
    </>
  );
};
