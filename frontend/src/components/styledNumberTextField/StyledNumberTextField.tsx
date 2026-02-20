import styled  from '@mui/material/styles/styled';
import { TextField } from '@mui/material';

const StyledNumberTextField = styled(TextField)(({}) => ({
  typography:'body2',
  '& .MuiInputBase-input': {
    fontSize: 12,
    height:'1.4375em',
    borderRadius:'12px',
  },
  "& .MuiInputLabel-root": {
    fontSize: "13px"
  },
  "& .MuiInputLabel-shrink": {
    fontSize: '1rem',
    fontWeight: 600,
  },
  width:'50%',
}));

export default StyledNumberTextField;