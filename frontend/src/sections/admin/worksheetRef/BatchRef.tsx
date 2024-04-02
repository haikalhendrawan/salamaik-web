import {useState, useRef} from'react';
import {Container, Stack, Button, Box, Typography, Grid, Slide, Card, 
          FormControl, Tooltip, IconButton, Grow} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../components/iconify';
import StyledTextField from '../../../components/styledTextField/StyledTextField';
//----------------------------------------------------
interface BatchRefProps {
  section: number,
  addState: boolean,
  resetAddState: () => void,
}
export default function BatchRef({section, addState, resetAddState}: BatchRefProps) {
  const theme = useTheme();

  return (
    <>
      <Grow in>
        <Card sx={{minHeight:480, display:'flex', flexDirection:'column', gap:theme.spacing(1)}}>
          <iframe src={`https://jdih.kemenkeu.go.id/download/a321969c-4ce0-4073-81ce-df35023750b1/PER_1_PB_2023-Perubahan%20Atas%20PERDIRJEN%20No.PER-24_PB_2019%20tentang%20Pedoman%20Pembinaan%20&%20Supervisi%20Pelaksanaan%20Tugas%20KPPN.pdf`} width="100%" height="1000px" />
        </Card>
      </Grow>
    </>
  )
}