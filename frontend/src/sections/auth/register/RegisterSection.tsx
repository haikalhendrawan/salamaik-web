import { Helmet } from 'react-helmet-async';
import {useState, useEffect} from 'react';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Box, SelectChangeEvent} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
// sections
import RegisterForm from './RegisterForm';
import RegisterOtp from './RegisterOtp';
import RegisterSuccess from './RegisterSuccess';
// ----------------------------------------------------------------------
const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: '480px', 
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.primary.main
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 720,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
  paddingBottom:theme.spacing(2)
}));

interface ValueType{
  username: string, 
  name: string, 
  email: string, 
  password: string, 
  kppn: string, 
  gender: number
};

interface ErrorType{
  username: boolean, 
  name: boolean, 
  email: boolean, 
  password: boolean, 
  kppn: boolean, 
  gender: boolean
};

interface ErrorMessageType{
  username: string, 
  name: string, 
  email: string, 
  password: string, 
  kppn: string, 
  gender: string
};

// ----------------------------------------------------------------------
export default function RegisterSection() {
  const [view, setView] = useState<0 | 1 | 2>(0);

  const [token, setToken] = useState<string>('');

  const [otp, setOtp] = useState<string>('');

  const [value, setValue] = useState<ValueType>({
    username: "", 
    name: "", 
    email: "", 
    password: "", 
    kppn: "", 
    gender: 0
  });

  const [error, setError] = useState<ErrorType>({
    username: false, 
    name: false, 
    email: false, 
    password: false, 
    kppn: false, 
    gender: false
  });

  const [errorMessage, setErrorMessage] = useState<ErrorMessageType>({
    username: '', 
    name: '', 
    email: '', 
    password: '', 
    kppn: '', 
    gender: ''
  });

  const handleReset = () => {
    setValue({username: "", name: "", email: "", password: "", kppn: "", gender: 0});
    setError({username: false, name: false, email: false, password: false, kppn: false, gender: false});
    setErrorMessage({username: '', name: '', email: '', password: '', kppn: '', gender: ''});
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<unknown>) => {
    setValue((prev) => ({...prev, [event.target.name]: event.target.value}));
    setError((prev) => ({...prev, [event.target.name]: false}));
    setErrorMessage((prev) => ({...prev, [event.target.name]: ''}));
  };

  const SECTION = [
    <RegisterForm  
      value={value} 
      error={error}
      setError={setError}
      setErrorMessage={setErrorMessage} 
      errorMessage={errorMessage} 
      handleChange={handleChange} 
      handleReset={handleReset} 
      setView={setView}
      setOtp = {setOtp}
      setToken = {setToken}
    />,
    <RegisterOtp
      otp={otp}
      token={token}
      value={value}
      setView={setView}
      setOtp = {setOtp}
      setToken = {setToken}
    />,
    <RegisterSuccess />,
  ];


  return (
    <>
      <Helmet>
        <title> Salamaik | Register</title>
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
          
        <Container  >
          <StyledContent>
            {SECTION[view]}
            <Stack 
              direction="column" 
              justifyContent="center" 
              alignItems="center" 
              sx={{width: '100%', mt: 'auto' }}
            >
              <Typography variant='body2'>Copyright © 2024 Kanwil DJPb Prov Sumbar</Typography>
            </Stack>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
