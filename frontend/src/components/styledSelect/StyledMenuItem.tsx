/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

/**
 * styling MUI select
 * ganti ukuran label, dan input
 * ganti border size
 */
import { MenuItem} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledMenuItem = styled(MenuItem)(({}) => ({
  fontSize: "0.875rem"
}));

export default StyledMenuItem