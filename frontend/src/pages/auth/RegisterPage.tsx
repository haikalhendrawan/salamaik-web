import { Helmet } from 'react-helmet-async';
import {useState, useEffect} from 'react';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Box} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
// sections
import RegisterSection from '../../sections/auth/register/RegisterSection';
// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <RegisterSection />
    </>
  );
}
