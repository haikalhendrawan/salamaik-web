import {useState, useRef} from'react';
import {Container, Stack, Button, Box, Typography, Grid, Slide, Card, 
          FormControl, Tooltip, IconButton} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import DasarHukumGrid from './DasarHukumGrid';
import WorksheetGrid from './WorksheetGrid';
import PeriodGrid from './PeriodGrid';
//---------------------------------------------------- 
interface WorksheetRefLandingProps {
  changeSection: (section: number) => void;
};

//-------------------------------------------------------
export default function WorksheetRefLanding({changeSection}: WorksheetRefLandingProps) {
  const theme = useTheme();

  return (
    <>
      <Slide direction="right" in mountOnEnter unmountOnExit>
        <Card sx={{minHeight:480, display:'flex', flexDirection:'column', gap:theme.spacing(1)}}>

          <DasarHukumGrid />

          <WorksheetGrid changeSection={changeSection}/>
         
          <PeriodGrid changeSection={changeSection}/>
        
        </Card>
      </Slide>
    </>
  );
};