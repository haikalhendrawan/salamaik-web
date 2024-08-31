/**
 * styling MUI select
 * ganti ukuran label, dan input
 * ganti border size
 */
import {InputLabel} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSelectLabel = styled(InputLabel)(({  }) => ({
  fontSize: '14px',
  '&.MuiInputLabel-shrink': {
    fontSize: '1rem', // Example font size when shrunk
    fontWeight: 600,
  },
}));

export default StyledSelectLabel