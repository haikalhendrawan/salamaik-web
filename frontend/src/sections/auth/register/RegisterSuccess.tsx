import { MuiOtpInput } from 'mui-one-time-password-input'
import {useState, useEffect} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Typography, Skeleton, Button} from '@mui/material';
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
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState<number>(10);

  const [value, setValue] = useState<string>(''); 

  const handleChange = (newValue: string) => {
    setValue(newValue)
  };

  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(interval);
          navigate('/login');
          return 0;
        };
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);


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


        {!imageLoaded && <Skeleton variant="rounded" sx={{ width: '70%',height: '70%',}} />}
        <img
              src={'/image/Other 06.svg'}
              alt="background"
              style={{
                width: '70%',
                height: '70%',
                background:'cover',
                fill: '#FFFFFF',
              }}
              onLoad={handleImageLoad}
        />
        

        <Typography variant="body3" sx={{mb:1}}>
          {countdown===0?'Redirecting':'Redirecting in'} {formatTime(countdown)}
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