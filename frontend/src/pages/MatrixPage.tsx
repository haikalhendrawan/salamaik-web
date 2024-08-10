import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import {useTheme, styled} from '@mui/material/styles';
//sections
import MatrixKPPN from '../sections/matrix/MatrixKPPN';

// -----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function MatrixPage() {
  const theme = useTheme();

  return (
    <>
      <MatrixKPPN/>
    </>
  );
};
