import { MuiOtpInput } from 'mui-one-time-password-input'
import { Helmet } from 'react-helmet-async';
import {useState, useEffect} from 'react';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Typography, Stack, InputAdornment, IconButton, Link} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Iconify from '../../../components/iconify/Iconify';
import useSnackbar from '../../../hooks/display/useSnackbar';
import useLoading from '../../../hooks/display/useLoading';
import { axiosPublic } from '../../../config/axios';
//-------------------------------------------------------------------------------------
const MuiOtpInputStyled = styled(MuiOtpInput)(({ theme }) => ({
  display: 'flex',
  gap: '30px',
  maxWidth: '650px',
  marginInline: 'auto',
}));

interface ValueType{
  username: string, 
  name: string, 
  email: string, 
  password: string, 
  kppn: string, 
  gender: number
};

interface RegisterOtpPropsType{
  otp: string,
  token: string,
  value: ValueType,
  setView: (set: 0 | 1 | 2) => void,
  setOtp: React.Dispatch<React.SetStateAction<string>>,
  setToken: React.Dispatch<React.SetStateAction<string>>
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
export default function RegisterOtp({otp, token, value, setView ,setOtp, setToken}: RegisterOtpPropsType) {
  const {openSnackbar} = useSnackbar();

  const {isLoading, setIsLoading} = useLoading();

  const [countdown, setCountdown] = useState<number>(120);

  const [otpInput, setOtpInput] = useState<string>('');

  const [round, setRound] = useState<number>(0);

  const handleChange = (newValue: string) => {
    setOtpInput(newValue)
  };

  const handleRegister= async() => {
    try{
      setIsLoading(true);

      if(otp !== otpInput){
        return openSnackbar('The OTP you entered is not correct', 'error');
      };

      const response = await axiosPublic.post("/verifyRegister", {
        nip: value.username,
        token: token,
        otp: otpInput
      });
      const response2 = await axiosPublic.post("/addUser", value);
      setIsLoading(false);
      setView(2);
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, "error");
        setIsLoading(false);
      }else if(err.response2){
        openSnackbar(err.response2.data.message, "error");
        setIsLoading(false);
      }else{
        openSnackbar('Network Error', "error");
      }
    }finally{
      setIsLoading(false);
    }
  };

  const handleResubmit = async() => {
    try{
      setCountdown(120);
      setRound((prev) => prev+1);
      openSnackbar("Resending OTP...", 'white');
      const response = await axiosPublic.post('/getRegisterToken', {
        username: value.username,
        email: value.email
      });
      setOtp(response.data.otp);
      setToken(response.data.token);
    }catch(err: any){
      openSnackbar(err.response.data.message, 'error');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(interval);
          return 0;
        };
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [round]);

  return(
    <>
      <StyledContent>
        <Typography variant="h4" gutterBottom>
          OTP
        </Typography>
        <Typography gutterBottom>
          Please input the 4 digit code we've send to your email
        </Typography>
          <Stack spacing={3}>
            <MuiOtpInputStyled 
              value={otpInput}
              onChange={handleChange}
              TextFieldsProps={{
                sx: {borderRadius:'8px'},
                placeholder:'-'
              }}
            />
          </Stack>
          
          {countdown ===0 
          ? <LoadingButton 
              fullWidth 
              size="large" 
              variant="contained" 
              sx={{mt: 3}} 
              endIcon={<Iconify icon="solar:plain-bold" />}
              onClick={handleResubmit}
              loading={isLoading}
            >
              Resend Otp
            </LoadingButton>
          : <LoadingButton 
                fullWidth 
                size="large" 
                type="submit" 
                variant="contained" 
                sx={{mt: 3}}
                onClick={handleRegister}
                loading={isLoading}
            >
              Submit
            </LoadingButton>
          }
          <Stack direction="row" alignItems="start" justifyContent="space-between" sx={{ my: 3 }}>
            <Stack direction="row">
              <Iconify icon="eva:arrow-ios-back-fill" sx={{ mr: 1 }} />
              <Link variant="subtitle2" underline="hover" href="/login" sx={{zIndex:1}}>
                Back to login
              </Link>
            </Stack>

            <Typography variant="body3" sx={{mb:5}}>
              {countdown===0?'expired OTP':'expires in'} {formatTime(countdown)}
            </Typography>
          </Stack>
      </StyledContent>
    </>
  )
}
//-------------------------------------------------------------------------------------
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