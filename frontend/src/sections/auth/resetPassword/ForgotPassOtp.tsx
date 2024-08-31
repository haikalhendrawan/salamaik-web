import { MuiOtpInput } from 'mui-one-time-password-input'
import {useState, useEffect} from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack, Link} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Iconify from '../../../components/iconify/Iconify';
import useSnackbar from '../../../hooks/display/useSnackbar';
import axiosPublic from "../../../config/axios";
//-------------------------------------------------------------------------------------
const MuiOtpInputStyled = styled(MuiOtpInput)(({ }) => ({
  display: 'flex',
  gap: '30px',
  maxWidth: '650px',
  marginInline: 'auto',
}));

interface ValueType{
  username: string;
  email: string;
};

interface ForgotPassOtpPropsType{
  otp: string,
  handleChangeView: (set: 0 | 1 | 2) => void,
  identityValue: ValueType,
  handleChangeOtp: (otp: string) => void,
  handleChangeToken: (token: string) => void
};
//-------------------------------------------------------------------------------------
export default function ForgotPassOtp({
  otp, 
  handleChangeView, 
  identityValue,
   handleChangeOtp,
   handleChangeToken}: ForgotPassOtpPropsType) {
  const {openSnackbar} = useSnackbar();

  const [countdown, setCountdown] = useState<number>(120);

  const [round, setRound] = useState<number>(0);

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(otp !== otpInput){
      return openSnackbar('The OTP you entered is not correct', 'error');
    };

    return handleChangeView(2);
  };

  const [otpInput, setotpInput] = useState<string>(''); // value dari input otp oleh user

  const handleChange = (newotpInput: string) => {
    setotpInput(newotpInput)
  };

  const handleResendOtp = async(event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); 
    try{
      setCountdown(120);
      setRound((prev) => prev+1);
      openSnackbar("Resending OTP...", 'white');
      const response = await axiosPublic.post('/getForgotPassToken', identityValue);
      handleChangeOtp(response.data.otp);
      handleChangeToken(response.data.token);
    }catch(err: any){
      console.log(err);
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
      <Typography variant="h4" gutterBottom>
        OTP
      </Typography>
      <Typography gutterBottom>
        Please input the 4 digit code we've send to your email
      </Typography>
      <Typography variant="body3" sx={{mb:5}}>
        (It may takes around 20s for email to arrive)
      </Typography>

      <div>
        <form onSubmit={handleSubmit}>
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
              onClick={handleResendOtp}
              >
              Resend Otp
            </LoadingButton>
          : <LoadingButton 
                fullWidth 
                size="large" 
                type="submit" 
                variant="contained" 
                sx={{mt: 3}}>
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

        </form>
      </div>
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