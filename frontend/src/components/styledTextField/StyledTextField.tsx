/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

/**
 * styling MUI text field
 * ganti ukuran label, dan input
 * ganti border size
 * always spellcheck false, krn gatau knp localization MUI not working (TODO)
 */

import {TextField} from '@mui/material';
import { styled } from '@mui/material/styles';


const StyledText = styled(TextField)(({}) => ({
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


export default function StyledTextField({...props}) {
  return (
    <StyledText inputProps={{spellCheck:'false'}} {...props} />
  )
}