/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

/**
 * styling MUI select
 * ganti ukuran label, dan input
 * ganti border size
 */
import {InputLabel} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSelectLabel = styled(InputLabel)(({  }) => ({
  fontSize: '0.875rem',
  '&.MuiInputLabel-shrink': {
    fontSize: '1rem', // Example font size when shrunk
    fontWeight: 600,
  },
}));

export default StyledSelectLabel