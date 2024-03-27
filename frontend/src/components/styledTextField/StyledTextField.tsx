import {TextField} from '@mui/material';
import { styled } from '@mui/material/styles';


 const StyledTextField = styled(TextField)(({theme}) => ({
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

export default StyledTextField 