import { useState, useEffect } from 'react';
import { Paper, Modal, Box, MenuItem, FormControl, Stack, Button, Grid, Typography, IconButton, InputAdornment, SelectChangeEvent} from '@mui/material';
import {useTheme, styled} from "@mui/material/styles";
import StyledTextField from '../../../components/styledTextField';
import ProfilePicUpload from '../../../components/profilePicUpload';
import useDictionary from '../../../hooks/useDictionary';
// components
import { StyledSelect, StyledSelectLabel } from '../../../components/styledSelect';
import Scrollbar from '../../../components/scrollbar';
import Iconify from '../../../components/iconify/Iconify';
// -------------------------------------------------------------
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

interface UserRefEditModalProps {
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
}

//----------------------
export default function UserRefAddModal({modalOpen, modalClose}: UserRefEditModalProps) {
    const theme = useTheme();

    const { statusRef, roleRef, kppnRef, periodRef } = useDictionary();

    const [showPassword, setShowPassword] = useState<boolean>(false); 

    const [value, setValue] = useState<ValueType>({
      username: "", 
      name: "", 
      email: "", 
      password: "", 
      kppn: "", 
      gender: 0
    });

    const handleReset = () => {
      setValue({username: "", name: "", email: "", password: "", kppn: "", gender: 0});
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<unknown>) => {
      setValue({...value, [event.target.name]: event.target.value});
    };
 
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
                        <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} sx={{ width: 1, height: "100%" }}>
                          <ProfilePicUpload  
                            imageUrl={value.gender===0
                                      ? `${import.meta.env.VITE_API_URL}/avatar/default-male.png` 
                                      : `${import.meta.env.VITE_API_URL}/avatar/default-female.png`
                                      } 
                          />
                          <Stack direction="column"justifyContent="center"alignItems="center">
                            <Typography variant='body2' color={theme.palette.text.disabled}>
                              Allowed *.jpeg, *.jpg, *.png
                            </Typography>
                            <Typography variant='body2' color={theme.palette.text.disabled}>
                              max size 12mb
                            </Typography>
                          </Stack>

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
                            />
                          </FormControl>
                          <FormControl>
                            <StyledTextField 
                              name="name" 
                              label="Nama Pegawai" 
                              value={value.name}
                              onChange={handleChange}
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
                            />
                          </FormControl>
                          <FormControl>
                            <StyledSelectLabel id="kppn-select-label">Unit</StyledSelectLabel>
                            <StyledSelect 
                              required 
                              name="kppn" 
                              label="kppn"
                              labelId="kppn-select-label"
                              value={value.kppn}
                              onChange={handleChange}
                            >
                              {kppnRef?.map((row: any, index: number) => (
                                <MenuItem 
                                  key={index+1} 
                                  sx={{ fontSize: 14 }} 
                                  value={row.id}
                                >
                                  {row.alias}
                                </MenuItem>
                              ))}
                            </StyledSelect>
                          </FormControl>
                          <FormControl>
                            <StyledTextField
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
                          </FormControl>
                        </Stack>
                      </Stack>

                      <Stack sx={{width:'100%', pr:3, mt:1}} direction='row' spacing={2} flex={'row'} justifyContent={'end'}>
                        <Button 
                          variant='contained' 
                          sx={{borderRadius:'8px'}}
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

 