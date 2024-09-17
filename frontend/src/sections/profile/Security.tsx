/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { useState} from 'react';
import Iconify from '../../components/iconify/Iconify';
import StyledTextField from '../../components/styledTextField';
// @mui
import { Stack,Box, FormControl,  Grid, IconButton, Card, InputAdornment, Button, Slide} from '@mui/material';
import { styled } from '@mui/material/styles';
import useSnackbar from '../../hooks/display/useSnackbar';
import useAxiosJWT from '../../hooks/useAxiosJWT';
import z from 'zod';
// ---------------------------------------------------------
const ResetPassContainer = styled(Box)(({theme}) => ({
  height:'100%',
  display: 'flex', 
  flexDirection:'column', 
  alignItems:'start', 
  justifyContent:'start', 
  marginTop:theme.spacing(5),
  gap:theme.spacing(3)
}));

interface ValueType{
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const passwordSchema =  z
                      .string()
                      .regex(
                        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        'Minimum 8 characters, at least one letter and one number'
                      );

// ---------------------------------------------------------

export default function Security(){
  const { openSnackbar } = useSnackbar();

  const axiosJWT = useAxiosJWT();

  const [showPassword, setShowPassword] = useState(false); 

  const [value, setValue] = useState<ValueType>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<any>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [errorMessage, setErrorMessage] = useState<ValueType>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue({...value, [event.target.name]: event.target.value});
    setError(false);
  };

  const handleReset = () => {
    setValue({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  };

  const handleUpdatePassword = async() => {
    try{
      const validOldPassword = passwordSchema.safeParse(value.oldPassword);
      const validNewPassword = passwordSchema.safeParse(value.newPassword);
      const validConfirmPassword = passwordSchema.safeParse(value.confirmPassword);

      if(value.newPassword !== value.confirmPassword){
        setError((prev: any) => ({
          ...prev,
          newPassword: true,
          confirmPassword: true
        })); 
        setErrorMessage((prev: any) => ({
          ...prev,
          newPassword: 'Password does not match',
          confirmPassword: 'Password does not match'
        }));
      }else if(value.newPassword === value.confirmPassword){
        if(!validOldPassword.success){
          setError((prev: any) => ({...prev, oldPassword: true}));
          setErrorMessage((prev) => 
            ({...prev, oldPassword: 'Minimum 8 characters, at least one letter and one number'}));
        };

        if(!validNewPassword.success){
          setError((prev: any) => ({...prev, newPassword: true}));
          setErrorMessage((prev) => 
            ({...prev, newPassword: 'Minimum 8 characters, at least one letter and one number'}));
        };

        if(!validConfirmPassword.success){
          setError((prev: any) => ({...prev, confirmPassword: true}));
          setErrorMessage((prev) => 
            ({...prev, confirmPassword: 'Minimum 8 characters, at least one letter and one number'}));
        };
      }

      if(validOldPassword.success && validNewPassword.success && validConfirmPassword.success){
        const body = { oldPassword: value.oldPassword, newPassword: value.newPassword};
        const response = await axiosJWT.post("/updatePassword", body);
        openSnackbar(`${response.data.message}`, "success");
        handleReset();
        return
      };

    }catch(err: any){
      openSnackbar(`${err.response.data.message}`, "error");
    }
  };

  return(
    <>
      
      <Grid item xs={12} sm={12} md={12}>
        <Slide direction="right" in mountOnEnter unmountOnExit>
          <Card sx={{height:350}}>
            <ResetPassContainer>
              <Stack direction='column' spacing={2} sx={{width:'100%', px:5}} justifyContent={'center'}>
                <FormControl>
                  <StyledTextField
                    name="oldPassword" 
                    label="Old Password" 
                    type={showPassword ? 'text' : 'password'} 
                    value={value.oldPassword}
                    error={error.oldPassword}
                    helperText={errorMessage.oldPassword}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}/>
                </FormControl>
                <FormControl>
                  <StyledTextField
                    name="newPassword" 
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={value.newPassword}
                    error={error.newPassword}
                    helperText={error.newPassword?errorMessage.newPassword:null}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }} />
                </FormControl>
                <FormControl>
                  <StyledTextField 
                    name="confirmPassword" 
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    value={value.confirmPassword}
                    error={error.confirmPassword}
                    helperText={error.confirmPassword?errorMessage.confirmPassword:null}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }} />
                </FormControl>
              </Stack>

              <Stack sx={{width:'100%', pr:5, mt:2}} direction='row' spacing={2} flex={'row'} justifyContent={'end'}>
                <Button 
                  variant='contained' 
                  sx={{borderRadius:'8px'}}
                  onClick={handleUpdatePassword}
                >
                  Save Changes
                </Button>
                <Button 
                  variant='contained' 
                  color='white'
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </Stack>
            </ResetPassContainer>
          </Card>
        </Slide>
      </Grid>

    </>
  )
}