import {useState, useRef} from'react';
import {Container, Stack, Button, Box, Typography, Grid, Slide, Card, 
  FormControl, Tooltip, IconButton, Grow} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../components/iconify';
import StyledTextField from '../../../components/styledTextField/StyledTextField';
//----------------------------------------------------
interface PeriodRefProps {
  changeSection: (section: number) => void;
}
export default function PeriodRef({changeSection}: PeriodRefProps) {
  const theme = useTheme();

  return (
    <>
      <Grow in>
        <Card sx={{minHeight:480, display:'flex', flexDirection:'column', gap:theme.spacing(1)}}>
        Period Ref
        </Card>
      </Grow>
    </>
  )
}