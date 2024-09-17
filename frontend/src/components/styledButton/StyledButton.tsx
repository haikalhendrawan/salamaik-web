/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

/**
 * component button kecil utk action pada table
 */


import { styled } from '@mui/material/styles';
import {Button} from '@mui/material';

const StyledButton = styled(Button, {
  shouldForwardProp: () => true
})<{component?: string;}>(({  }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingRight: 0,
  paddingLeft: 0,
  minHeight: '30px',
  minWidth: '30px',
  borderRadius: '12px',
}));


export default StyledButton