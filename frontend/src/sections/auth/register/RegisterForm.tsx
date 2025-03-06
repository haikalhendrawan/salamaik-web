/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState} from 'react';
import { styled } from '@mui/material/styles';
import { Link, Box, MenuItem, FormControl, Stack, FormHelperText, 
  Button, Typography, IconButton, InputAdornment, SelectChangeEvent} from '@mui/material';
import StyledTextField from '../../../components/styledTextField/StyledTextField';
import { StyledSelect, StyledSelectLabel } from '../../../components/styledSelect';
import Iconify from '../../../components/iconify';
import useSnackbar from '../../../hooks/display/useSnackbar';
import useLoading from '../../../hooks/display/useLoading';
import { axiosPublic } from '../../../config/axios';
import { z } from 'zod';
import { passwordRegex } from '../../../utils/schema';
//-------------------------------------------------------------------------------------
const UserDataContainer = styled(Box)(({theme}) => ({
  height:'100%',
  display: 'flex', 
  flexDirection:'column', 
  alignItems:'start', 
  justifyContent:'start', 
  gap:theme.spacing(3)
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

interface RegisterFormPropTypes{
  value: ValueType,
  error: ErrorType,
  setError: React.Dispatch<React.SetStateAction<ErrorType>>,
  errorMessage: ErrorMessageType,
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessageType>>,
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<unknown>) => void,
  handleReset: () => void,
  setView: (set: 0 | 1 | 2) => void,
  setOtp: React.Dispatch<React.SetStateAction<string>>,
  setToken: React.Dispatch<React.SetStateAction<string>>
};

const AddUserSchema = z.object({
  username: z.string().min(18, 'Must be 18 characters long').max(18, 'Must be 18 characters long'),
  name: z.string().min(1, 'Invalid name'),
  email: z.string().email('Invalid email'),
  password: z.string().regex(passwordRegex, 'Minimum 8 characters, at least one letter and one number'),
  kppn: z.string().min(3, 'Invalid unit'),
  gender: z.number().min(0).max(1, 'Invalid gender specified')
});

const KPPN_REF = [
  {id:'03010', alias:"Kanwil DJPb Prov. Sumbar"},
  {id:'010', alias:"KPPN Padang"},
  {id:'011', alias:"KPPN Bukittinggi"},
  {id:'090', alias:"KPPN Solok"},
  {id:'091', alias:"KPPN Lubuk Sikaping"},
  {id:'077', alias:"KPPN Sijunjung"},
  {id:'142', alias:"KPPN Painan"},
];
//-------------------------------------------------------------------------------------

export default function RegisterForm({
  value,
  error,
  setError,
  errorMessage,
  setErrorMessage,
  handleChange,
  handleReset,
  setView,
  setOtp, 
  setToken
}: RegisterFormPropTypes) {
  const { openSnackbar } = useSnackbar();

  const { setIsLoading } = useLoading();

  const [showPassword, setShowPassword] = useState<boolean>(false); 

  const handleSubmit = async() => {
    try{
      setIsLoading(true);
      const result = AddUserSchema.safeParse(value);

      if(!result.success){
        const flattenedError = result.error.flatten().fieldErrors;
        for (const key in flattenedError) {
          if (Object.prototype.hasOwnProperty.call(flattenedError, key)) {
            const errorKey = key as keyof typeof flattenedError;
            setError(prev => ({ ...prev, [errorKey]: true }));
            setErrorMessage(prev => ({ ...prev, [errorKey]: flattenedError[errorKey]![0] }));
          }
        };
        return
      };

      const response = await axiosPublic.post("/getRegisterToken", {
        username: value.username,
        email: value.email
      });
      setOtp(response.data.otp);
      setToken(response.data.token);
      setIsLoading(false);
      setView(1);
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar('Network Error', "error");
      }
    }finally{
      setIsLoading(false);
    }
  }
  
  return(
    <>
      <Typography variant="h4" gutterBottom>
        Register New User
      </Typography>
      <Typography sx={{mb:5}}>
        Please fill all the required field below
      </Typography>

      <UserDataContainer>
        <Stack direction='row' spacing={2} sx={{width:'100%'}} justifyContent={'center'}>
          <Stack direction='column' spacing={3} sx={{width:'45%'}}>
            <FormControl>
              <StyledTextField 
                name="username" 
                label="NIP"
                value={value.username}
                onChange={handleChange}
                error={error.username}
                helperText={errorMessage.username}  
              />
            </FormControl>
            <FormControl>
              <StyledTextField 
                name="name" 
                label="Nama Pegawai"
                value={value.name}
                onChange={handleChange}
                error={error.name}
                helperText={errorMessage.name} 
              />
            </FormControl>
            <FormControl>
              <StyledSelectLabel id="gender-select-label">Gender</StyledSelectLabel>
              <StyledSelect 
                required 
                name="gender" 
                label="gender"
                labelId="gender-select-label"
                value={value.gender}
                onChange={handleChange}
              >
                <MenuItem key={0} sx={{ fontSize: 14 }} value={0}> Pria </MenuItem>
                <MenuItem key={1} sx={{ fontSize: 14 }} value={1}> Wanita </MenuItem>
              </StyledSelect>
            </FormControl>
          </Stack>
          <Stack direction='column' spacing={3} sx={{width:'45%'}}>
            <FormControl>
              <StyledTextField 
                name="email" 
                label="Email"
                value={value.email}
                onChange={handleChange}
                error={error.email}
                helperText={errorMessage.email}
              />  
            </FormControl>
            <FormControl error={error.kppn}>
              <StyledSelectLabel id="kppn-select-label">Unit</StyledSelectLabel>
              <StyledSelect 
                required 
                name="kppn" 
                label="kppn"
                labelId="kppn-select-label"
                value={value.kppn}
                onChange={handleChange}
              >
                {KPPN_REF.map((row: any, index: number) => (
                  <MenuItem 
                    key={index+1} 
                    sx={{ fontSize: 14 }} 
                    value={row.id}
                  >
                    {row.alias}
                  </MenuItem>
                ))}
              </StyledSelect>
              <FormHelperText sx={{display:error.kppn?'block':'none'}}>
                {errorMessage.kppn || null}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <StyledTextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                onChange={handleChange}
                value={value.password}
                error={error.password}
                helperText={errorMessage.password}
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
            </FormControl>
          </Stack>
        </Stack>

        <Stack sx={{width:'100%', pr:3, pl:3, mt:1}} direction='row' spacing={2} flex={'row'} justifyContent={'space-between'}>
          <Stack direction="row" alignItems="center" justifyContent="start">
            <Iconify icon="eva:arrow-ios-back-fill" sx={{ mr: 1 }} />
            <Link variant="subtitle2" underline="hover" href="/login" sx={{zIndex:1}}>
              Back to login
            </Link>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="start" spacing={1}>
            <Button 
              variant='contained' 
              sx={{borderRadius:'8px'}}
              onClick={handleSubmit}
            >
              Register
            </Button>
            <Button 
              variant='contained' 
              color="white"
              onClick={handleReset}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </UserDataContainer>
    </>
  )
}