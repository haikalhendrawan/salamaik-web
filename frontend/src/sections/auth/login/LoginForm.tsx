/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import React, { useState, useEffect,} from 'react';
import { useNavigate,} from 'react-router-dom';
import { axiosPublic } from '../../../config/axios';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import {useAuth} from "../../../hooks/useAuth";
import useSnackbar from '../../../hooks/display/useSnackbar';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const {auth, setAuth} = useAuth() as AuthType; // { username: xxx, role:xxx, accessToken,msg:xxx}

  const [showPassword, setShowPassword] = useState(false); 

  const { openSnackbar } = useSnackbar();

  const [value, setValue] = useState({    
    username:"",
    password:"",
  }); 

  const [loading, setLoading] = useState<boolean>(false);
 
  useEffect(()=>{  // effect setiap auth berubah
    if(auth){
      if(auth.accessToken){
        setLoading(true); 
      }else{
        setLoading(false);
      }
    }
  },[auth])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [event.target.name]:event.target.value,
    });
  };

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    try{
      setLoading(true);
      const response = await axiosPublic.post(`/login`, {username:value.username, password:value.password});
      setAuth({
        ...response.data.authInfo,
        accessToken: response.data.accessToken
      });
      setLoading(false); 
      navigate("/home");
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, "error");
        setLoading(false); 
      }else{
        openSnackbar('Network Error', "error");
        setLoading(false);
      };
    }finally{
      setLoading(false);
    }
  };
// ----------------------------------------------------------------------

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField name="username" label="Username (NIP)" onChange={handleChange} value={value.username}/>

          <TextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            onChange={handleChange}
            value={value.password}
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

        <Stack direction="row" alignItems="center" justifyContent="end" sx={{ my: 3 }}>
          {/* <FormControlLabel control={<Checkbox />} label="Remember me" />  */}
          <Link variant="subtitle2" underline="hover" href="/resetPassword" sx={{zIndex:1}}>
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading} >
          Login
        </LoadingButton>
      </form>
    </div>
    
  );
}
