import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/iconify/Iconify';
import Label from '../../components/label/Label';
import StyledTextField from '../../components/styledTextField';
// @mui
import { Stack,Box, FormControl,  Grid, IconButton, Card, TextField, InputAdornment, Button, Slide, Grow} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
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


// ---------------------------------------------------------

export default function Security(){
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false); 


  return(
    <>
      
      <Grid item xs={12} sm={12} md={12}>
        <Slide direction="right" in mountOnEnter unmountOnExit>
          <Card sx={{height:350}}>
            <ResetPassContainer>
              <Stack direction='column' spacing={2} sx={{width:'100%', px:5}} justifyContent={'center'}>
                <FormControl>
                  <StyledTextField
                    name="oldpassword" 
                    label="Old Password" 
                    type={showPassword ? 'text' : 'password'} 
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
                    name="newpassword" 
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
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
                    name="confirmpassword" 
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
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
                <Button variant='contained' sx={{borderRadius:'8px'}}>Save Changes</Button>
                <Button variant='contained' sx={{borderRadius:'8px', backgroundColor:theme.palette.common.white, color:theme.palette.common.black}}>Reset</Button>
              </Stack>
            </ResetPassContainer>
          </Card>
        </Slide>
      </Grid>

    </>
  )
}