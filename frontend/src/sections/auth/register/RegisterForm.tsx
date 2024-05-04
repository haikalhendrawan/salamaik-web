import { Helmet } from 'react-helmet-async';
import {useState, useEffect} from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Link, Box, MenuItem, FormControl, Stack, FormHelperText, 
  Button, Grid, Typography, IconButton, InputAdornment, SelectChangeEvent} from '@mui/material';
import StyledTextField from '../../../components/styledTextField/StyledTextField';
import { StyledSelect, StyledSelectLabel } from '../../../components/styledSelect';
import Iconify from '../../../components/iconify';
import useSnackbar from '../../../hooks/display/useSnackbar';
import useLoading from '../../../hooks/display/useLoading';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
import useDictionary from '../../../hooks/useDictionary';
import useUser from '../../admin/userRef/useUser';
import axios from "axios";
import { z } from 'zod';
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

const AddUserSchema = z.object({
  username: z.string().min(18, 'Must be 18 characters long').max(18, 'Must be 18 characters long'),
  name: z.string().min(1, 'Invalid name'),
  email: z.string().email('Invalid email'),
  password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Minimum 8 characters, at least one letter and one number'),
  kppn: z.string().min(3, 'Invalid unit'),
  gender: z.number().min(0).max(1, 'Invalid gender specified')
});


//-------------------------------------------------------------------------------------

export default function RegisterForm() {
  const theme = useTheme();

  const { statusRef, roleRef, kppnRef, periodRef } = useDictionary();

  const { getUser } = useUser();

  const { openSnackbar } = useSnackbar();

  const axiosJWT = useAxiosJWT();

  const { setIsLoading } = useLoading();

  const [showPassword, setShowPassword] = useState<boolean>(false); 

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

  const handleAddUser = async() => {
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

      const response = await axiosJWT.post("/addUser", value);
      openSnackbar(response.data.message, "success");
      getUser();
      setIsLoading(false);
      handleReset();
    }catch(err: any){
      openSnackbar(err.response.data.message, "error");
      setIsLoading(false);
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
              />
            </FormControl>
            <FormControl>
              <StyledTextField 
                name="name" 
                label="Nama Pegawai" 
              />
            </FormControl>
            <FormControl>
              <StyledSelectLabel id="gender-select-label">Gender</StyledSelectLabel>
              <StyledSelect 
                required 
                name="gender" 
                label="gender"
                labelId="gender-select-label"
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
              />  
            </FormControl>
            <FormControl error={error.kppn}>
              <StyledSelectLabel id="kppn-select-label">Unit</StyledSelectLabel>
              <StyledSelect 
                required 
                name="kppn" 
                label="kppn"
                labelId="kppn-select-label"
              >
                {kppnRef?.list?.map((row: any, index: number) => (
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
              onClick={handleAddUser}
            >
              Save Changes
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