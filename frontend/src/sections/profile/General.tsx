import { useState, useRef } from 'react';
import Iconify from '../../components/iconify/Iconify';
import Label from '../../components/label/Label';
import ProfilePicUpload from '../../components/profilePicUpload';
import StyledTextField from '../../components/styledTextField';
// @mui
import { Stack, Typography, Box, FormControl,  Grid, IconButton, Card, TextField, Button, Slide, Grow} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

// -----------------------------------------------------------------------
const UserDataContainer = styled(Box)(({theme}) => ({
  height:'100%',
  display: 'flex', 
  flexDirection:'column', 
  alignItems:'start', 
  justifyContent:'start', 
  marginTop:theme.spacing(5),
  gap:theme.spacing(3)
}));


//------------------------------------------------------------------------
export default function General(){
  const theme = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?fileInputRef.current.click():null
  }

  return (
  <>
    <Grid item xs={12} sm={6} md={4}>
      <Slide direction="right" in mountOnEnter unmountOnExit>
        <Card sx={{height:500}}>
          <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} sx={{ width: 1, height: "100%" }}>
            <input accept='image/*' type='file' style={{display:'none'}} ref={fileInputRef} tabIndex={-1} />
            <ProfilePicUpload onClick={handleClick} imageUrl='/avatar/default-male.png' />

            <Stack direction="column"justifyContent="center"alignItems="center">
              <Typography variant='body2' color={theme.palette.text.disabled}>
                Muhammad Haikal Putra Hendrawan
              </Typography>
              <Typography variant='body2' color={theme.palette.text.disabled} sx={{mt:0}}>
                199904082021011001
              </Typography>
            </Stack>

            <Label color='success'>Active User</Label>
            <Typography variant='body2' color={theme.palette.text.disabled} sx={{mt:0}}>
                Role: Admin Kanwil
            </Typography>

          </Stack>
        </Card>
      </Slide>
    </Grid>

    <Grid item xs={12} sm={6} md={8}>
      <Slide direction="right" in mountOnEnter unmountOnExit>
        <Card sx={{height:425}}>
          <UserDataContainer>
            <Stack direction='row' spacing={2} sx={{width:'100%'}} justifyContent={'center'}>
              <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                <FormControl>
                  <StyledTextField name="name" label="Nama Pegawai" />
                </FormControl>
                <FormControl>
                  <StyledTextField name="email" label="Email"  />
                </FormControl>
                <FormControl>
                  <StyledTextField name="uid" label="UID" disabled/>
                </FormControl>
                <FormControl>
                  <StyledTextField name="role" label="Role"  />
                </FormControl>
              </Stack>
              <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                <FormControl>
                  <StyledTextField name="nip" label="NIP"  />
                </FormControl>
                <FormControl>
                  <StyledTextField name="unit" label="Unit" />
                </FormControl>
                <FormControl>
                  <StyledTextField name="name" label="Nama Pegawai" />
                </FormControl>
                <FormControl>
                  <StyledTextField name="periode" label="Periode" />
                </FormControl>
              </Stack>
            </Stack>

            <Stack sx={{width:'100%', pr:3, mt:1}} direction='row' spacing={2} flex={'row'} justifyContent={'end'}>
              <Button variant='contained' sx={{borderRadius:'8px'}}>Save Changes</Button>
              <Button variant='contained' sx={{borderRadius:'8px', backgroundColor:theme.palette.common.white, color:theme.palette.common.black}}>Reset</Button>
            </Stack>
          </UserDataContainer>
        </Card>
      </Slide>
    </Grid>
  </>
  )
}