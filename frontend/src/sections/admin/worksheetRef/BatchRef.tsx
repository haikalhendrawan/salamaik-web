import {useState, useRef} from'react';
import {Container, Stack, Button, Box, Typography, Grid, Slide, Card, 
          FormControl, Tooltip, IconButton, Grow} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../components/iconify';
import StyledTextField from '../../../components/styledTextField/StyledTextField';
//----------------------------------------------------
interface BatchRefProps {
  changeSection: (section: number) => void;
}
export default function BatchRef({changeSection}: BatchRefProps) {
  const theme = useTheme();

  return (
    <>
      <Grow in>
        <Card sx={{minHeight:480, display:'flex', flexDirection:'column', gap:theme.spacing(1)}}>
        Batch Ref
        </Card>
      </Grow>
    </>
  )
}