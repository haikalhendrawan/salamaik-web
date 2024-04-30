/**
 * styling MUI select
 * ganti ukuran label, dan input
 * ganti border size
 */
import {InputLabel, Select} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSelectLabel = styled(InputLabel)(({ theme }) => ({
  fontSize: '14px',
  '&.MuiInputLabel-shrink': {
    fontSize: '1rem', // Example font size when shrunk
    fontWeight: 600,
  },
}));

export default StyledSelectLabel