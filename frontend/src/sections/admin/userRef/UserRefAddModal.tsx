import { useState, useEffect } from 'react';
import { Paper, Modal, Box, MenuItem, FormControl, Stack, FormHelperText, 
          Button, Grid, Typography, IconButton, InputAdornment, SelectChangeEvent} from '@mui/material';
import {useTheme, styled} from "@mui/material/styles";
import StyledTextField from '../../../components/styledTextField';
import { StyledSelect, StyledSelectLabel } from '../../../components/styledSelect';
import Scrollbar from '../../../components/scrollbar';
import Iconify from '../../../components/iconify/Iconify';
import ProfilePicUpload from '../../../components/profilePicUpload';
import useDictionary from '../../../hooks/useDictionary';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
import useLoading from '../../../hooks/display/useLoading';
import useSnackbar from '../../../hooks/display/useSnackbar';
import useUser from './useUser';
import { z } from 'zod';
// --------------------------------------------------------------------------------------------
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height:'80vh',
    width: '1000px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius:'12px',
};

const UserDataContainer = styled(Box)(({theme}) => ({
  height:'100%',
  display: 'flex', 
  flexDirection:'column', 
  alignItems:'start', 
  justifyContent:'start', 
  marginTop:theme.spacing(5),
  gap:theme.spacing(3)
}));

interface UserRefAddModalProps {
    modalOpen: boolean;
    modalClose: () => void;  
};

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

// --------------------------------------------------------------------------------------------
export default function UserRefAddModal({modalOpen, modalClose}: UserRefAddModalProps) {
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
        modalClose();
      }catch(err: any){
        if(err.response){
          openSnackbar(err.response.data.message, "error");
          setIsLoading(false);
        }else{
          openSnackbar("Network Error", "error");
        }

      }finally{
        setIsLoading(false);
      }
    }
 
    // ----------------------------------------------------------------------------------------
    return(
        <>
        <Modal open={modalOpen} onClose={modalClose}>
          <Box sx={style}>
            <Scrollbar>
              <Paper sx={{height:'70vh', width:'auto', p:2}}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Add User
                </Typography>

                <Grid container sx={{width:'100%', height:'70%'}} spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} sx={{ width: 1, height: "100%", pb: 3}}>
                      <ProfilePicUpload 
                        disabled 
                        imageUrl={value.gender===0
                                  ? `${import.meta.env.VITE_API_URL}/avatar/default-male.png` 
                                  : `${import.meta.env.VITE_API_URL}/avatar/default-female.png`
                                  } 
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={6} md={8}>
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

                      <Stack sx={{width:'100%', pr:3, mt:1}} direction='row' spacing={2} flex={'row'} justifyContent={'end'}>
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
                    </UserDataContainer>
                  </Grid>
                </Grid>  
                
              </Paper>
            </Scrollbar>
          </Box>
        </Modal>
        
        </>
    )
}

 