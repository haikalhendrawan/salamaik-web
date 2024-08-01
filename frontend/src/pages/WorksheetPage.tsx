import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PreviewFileModalProvider } from '../sections/worksheet/usePreviewFileModal';
//sections
import WorksheetKPPN from '../sections/worksheet/WorksheetKPPN';
import WorksheetLanding from '../sections/worksheet/WorksheetLanding';
import {WsJunctionProvider} from '../sections/worksheet/useWsJunction';
// @mui
import { Container, Stack, Typography, Tabs, Tab, Grid, Paper, IconButton, Box, LinearProgress} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
// -----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function WorksheetPage() {
  const theme = useTheme();

  return (
    <>
      <WsJunctionProvider>
        <PreviewFileModalProvider>
          <Outlet />
        </PreviewFileModalProvider>
      </WsJunctionProvider>
    </>
  );
};
