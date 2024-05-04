import { MuiOtpInput } from 'mui-one-time-password-input'
import {useState, useEffect} from 'react';
import {Link as RouterLink} from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Typography, Stack, Link, Button} from '@mui/material';
import StyledButton from '../../../components/styledButton/StyledButton';
import useSnackbar from '../../../hooks/display/useSnackbar';
//-------------------------------------------------------------------------------------
const MuiOtpInputStyled = styled(MuiOtpInput)(({ theme }) => ({
  display: 'flex',
  gap: '30px',
  maxWidth: '650px',
  marginInline: 'auto',
}));

interface ValueType{
  username: string;
  email: string;
};

interface RegisterSuccessPropsType{
};

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '80vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
  paddingTop:0,
  marginTop:0
}));
//-------------------------------------------------------------------------------------
export default function RegisterSuccess({}: RegisterSuccessPropsType) {
  const {openSnackbar} = useSnackbar();

  const [countdown, setCountdown] = useState<number>(120);

  const [round, setRound] = useState<number>(0);

  const [value, setValue] = useState<string>(''); 

  const handleChange = (newValue: string) => {
    setValue(newValue)
  };


  return(
    <>
      <StyledContent>
        <Typography variant="h4" gutterBottom>
          Success
        </Typography>
        <Typography>
          Your account have been registered
        </Typography>
        <Typography gutterBottom>
          Please contact admin kppn to activate the account.
        </Typography>

        <img
          src={'/image/Other 06.png'}
          alt="background"
          style={{
            width: '70%',
            height: '70%',
            background:'cover',
            fill: '#FFFFFF',
          }}
        />

        <Typography variant="body3" sx={{mb:1}}>
          (Redirecting in 3s)
        </Typography>
        <Button 
          variant='contained' 
          sx={{width: '15%', borderRadius:'8px'}}
          component={RouterLink}
          to='/login'
        >
          Login
        </Button>
      </StyledContent>
    </>
  )
}

function formatTime(countdown: number): string {
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formattedMinutes = minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : '';
  const formattedSeconds = seconds > 0 ? `${seconds} second${seconds > 1 ? 's' : ''}` : '';

  if (formattedMinutes && formattedSeconds) {
    return `${formattedMinutes} ${formattedSeconds}`;
  } else if (formattedMinutes) {
    return formattedMinutes;
  } else {
    return formattedSeconds;
  }
};