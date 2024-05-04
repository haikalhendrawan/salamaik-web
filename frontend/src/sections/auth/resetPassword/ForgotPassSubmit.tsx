import { Helmet } from 'react-helmet-async';
import {useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Typography, Stack, InputAdornment, IconButton, Link} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Iconify from '../../../components/iconify/Iconify';
import StyledTextField from '../../../components/styledTextField/StyledTextField';
import useSnackbar from '../../../hooks/display/useSnackbar';
import useLoading from '../../../hooks/display/useLoading';
import axios from "axios";
import { z } from 'zod';
//-------------------------------------------------------------------------------------
interface ValueType{
  username: string;
  email: string;
};

interface ForgotPassSubmitPropsType{
  identityValue: ValueType;
  otp: string;
  token: string;
};

const passwordSchema =  z
                      .string()
                      .regex(
                        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        'Minimum 8 characters, at least one letter and one number'
                      );
//-------------------------------------------------------------------------------------
export default function ForgotPassSubmit({identityValue, otp, token}: ForgotPassSubmitPropsType) {
  const navigate = useNavigate();

  const {openSnackbar} = useSnackbar();

  const {isLoading, setIsLoading} = useLoading();

  const [value, setValue] = useState({
    password: "",
    confirmPassword:""
  });

  const [error, setError] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false); 

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setError(false);
    setErrorMessage('');
    setValue({...value, [event.target.name]: event.target.value});
  };

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validOldPassword = passwordSchema.safeParse(value.password);
    const validNewPassword = passwordSchema.safeParse(value.confirmPassword);

    if(value.password !== value.confirmPassword){
      setError(true)
      setErrorMessage('Password not match')
      return 
    };

    if(!validOldPassword.success || !validNewPassword.success){
      setError(true)
      setErrorMessage('Minimum 8 characters, at least one letter and one number')
      return 
    };

    try{
      const response = await axios.post('http://localhost:8080/forgotPassword', {
        nip: identityValue.username,
        password: value.password,
        confirmPassword: value.confirmPassword,
        otp: otp,
        token: token
      });
      openSnackbar(response.data.message, 'success');
      return navigate('/login');
    }catch(err: any){
      openSnackbar(err.response.data.message, 'error');
      console.log(err.detail)
    }
  };


  return(
    <>
      <Typography variant="h4" gutterBottom>
        Change Password
      </Typography>
      <Typography sx={{mb:5}}>
        Please fill your new password
      </Typography>

      <div>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
           <StyledTextField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              onChange={handleChange}
              value={value.password}
              error={error}
              helperText={errorMessage}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              onChange={handleChange}
              error={error}
              helperText={errorMessage}
              value={value.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <LoadingButton 
            fullWidth 
            size="large" 
            type="submit" 
            variant="contained" 
            loading={isLoading} 
            sx={{mt: 3}}
          >
            Submit
          </LoadingButton>
          <Stack direction="row" alignItems="center" justifyContent="start" sx={{ my: 3 }}>
            <Iconify icon="eva:arrow-ios-back-fill" sx={{ mr: 1 }} />
            <Link variant="subtitle2" underline="hover" href="/login" sx={{zIndex:1}}>
              Back to login
            </Link>
          </Stack>

        </form>
      </div>
    </>
  )
}