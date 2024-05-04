import { Helmet } from 'react-helmet-async';
import {useState, useEffect} from 'react';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button, Card, Alert, Box, LinearProgress} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
// hooks
import useResponsive from '../../hooks/display/useResponsive';
// sections
import ForgotPassIdentifier from '../../sections/auth/resetPassword/ForgotPassIdentifier';
import ForgotPassOtp from '../../sections/auth/resetPassword/ForgotPassOtp';
import ForgotPassSubmit from '../../sections/auth/resetPassword/ForgotPassSubmit';
// ----------------------------------------------------------------------
const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: '720px', 
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.primary.main
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

interface ValueType{
  username: string;
  email: string;
};

interface SubmitValueType{
  password: string;
  confirmPassword: string;
};
// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  const [view, setView] = useState<0 | 1 | 2>(0);

  const [otp, setOtp] = useState<string>('');

  const [token, setToken] = useState<string>('');

  const [ identityValue, setIdentityValue] = useState<ValueType>({    
    username:"",
    email:"",
  }); 

  const [submitvalue, setSubmitValue] = useState<SubmitValueType>({
    password: "",
    confirmPassword:""
  });

  const handleChangeIdentifier = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIdentityValue({...identityValue, [event.target.name]: event.target.value});
  };

  const handleChangeOtp = (newValue: string) => {
    setOtp(newValue)
  };

  const handleChangeToken = (newValue: string) => {
    setToken(newValue)
  };

  const handleChangeView = (set: 0 | 1 |2 ) => {
    setView(set);
  };

  const SECTION = [
    <ForgotPassIdentifier 
      handleChange={handleChangeIdentifier} 
      identityValue={ identityValue} 
      handleChangeView={handleChangeView}
      handleChangeOtp={handleChangeOtp}
      handleChangeToken={handleChangeToken}
    />,
    <ForgotPassOtp 
      otp={otp}  
      handleChangeView={handleChangeView}
      identityValue={ identityValue} 
      handleChangeOtp={handleChangeOtp}
    />,
    <ForgotPassSubmit 
      identityValue={identityValue}
      otp={otp}
      token={token} 
    />
  ];

  return (
    <>
      <Helmet>
        <title> Salamaik | Forgot Password</title>
      </Helmet>

      <StyledRoot>
        <Box
          component="img"
          src="/logo/salamaik-long.png"
          sx={{ 
            width: 120, 
            height: 30, 
            cursor: 'pointer', 
            position: 'fixed', 
            backgroundColor: 'white',
            top: { xs: 16, md: 24 },
            left: { xs: 16, md: 24 }, 
          }}
        />

        <StyledSection />
          
        <Container maxWidth="sm" >
          <StyledContent>

            {SECTION[view]}

            <Stack direction="column" justifyContent="center" alignItems="center" spacing={0} sx={{bottom:10, position:'fixed', width:'38%'}}>
              <Typography variant='body2'>Copyright © 2024 Kanwil DJPb Prov Sumbar</Typography>
            </Stack>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
