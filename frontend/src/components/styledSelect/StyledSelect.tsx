/**
 * styling MUI select
 * ganti ukuran label, dan input
 * ganti border size
 */
import { ReactNode } from 'react';
import {InputLabel, Select} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSelect = styled(Select)(({theme}) => ({
  typography:'body2',
  '& .MuiInputBase-input': {
    fontSize: 14,
    height:'1.4375em',
    borderRadius:'12px',
  },
  "& .MuiInputLabel-root": {
    fontSize: "13px"
  },
  "& .MuiInputLabel-shrink": {
    fontSize: '1rem',
    fontWeight: 600,
  }
}));

export default StyledSelect