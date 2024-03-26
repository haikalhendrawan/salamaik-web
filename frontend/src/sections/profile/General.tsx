import { useState, useRef } from 'react';
import Iconify from '../../components/iconify/Iconify';
import Label from '../../components/label/Label';
import ProfilePicUpload from '../../components/profilePicUpload';
// @mui
import { Stack, Typography, Box, FormControl,  Grid, IconButton, Card, TextField, Button, Slide, Grow} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

// -----------------------------------------------------------------------
const ImageBox = styled(Box)(({ theme }) => ({
  borderRadius:'50%', 
  height:'144px', 
  width:'144px', 
  p:'8px', 
  border:'1px dashed rgba(145, 158, 171, 0.2)',
  position: 'relative', 
  '&:hover .MuiTypography-root': { 
    color: 'white' 
  },
  '&:hover .MuiBox-root': { 
    color: 'white' 
  },
  '&:hover .backdrop': { 
    opacity: 0.5
  }
}));

const ImageButton = styled(IconButton)(({theme}) => ({
  width:'100%', 
  height:'100%', 
  mx:'auto',
  cursor: 'pointer', 
  p:0, 
  backgroundSize: 'cover', 
}));

const ImageBackdrop = styled(Box)(({theme}) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'black',
  opacity: 0, 
  borderRadius: '50%', 
  zIndex: 0, 
  transition: 'opacity 0.3s ease'
}));

const BackdropTypography = styled(Typography)(({theme}) => ({
  color: 'transparent', 
  position: 'absolute', 
  top: '60%', 
  left: '50%', 
  transform: 'translate(-50%, -50%)', 
  transition: 'color 0.3s ease', 
  pointerEvents: 'none',
  zIndex: 1
}));

const BackdropIcon = styled(Iconify)(({theme}) => ({
  color: 'transparent', 
  position: 'absolute', 
  top: '45%', 
  left: '50%', 
  transform: 'translate(-50%, -50%)', 
  transition: 'color 0.3s ease', 
  pointerEvents: 'none',
  zIndex: 1
}));

const StyledInput = styled(TextField)(({theme}) => ({
  typography:'body2',
  '& .MuiInputBase-input': {
    fontSize: 14,
    height:'1.4375em',
    borderRadius:'12px',
  },
  "& .MuiInputLabel-root": {
    fontSize: "13px"
  },
  "& .MuiInputLabel-shrink": {
    fontSize: '1rem',
    fontWeight: 600,
  }
}));

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
                  <StyledInput name="name" label="Nama Pegawai" />
                </FormControl>
                <FormControl>
                  <StyledInput name="email" label="Email"  />
                </FormControl>
                <FormControl>
                  <StyledInput name="uid" label="UID" disabled/>
                </FormControl>
                <FormControl>
                  <StyledInput name="role" label="Role"  />
                </FormControl>
              </Stack>
              <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                <FormControl>
                  <StyledInput name="nip" label="NIP"  />
                </FormControl>
                <FormControl>
                  <StyledInput name="unit" label="Unit" />
                </FormControl>
                <FormControl>
                  <StyledInput name="name" label="Nama Pegawai" />
                </FormControl>
                <FormControl>
                  <StyledInput name="periode" label="Periode" />
                </FormControl>
              </Stack>
            </Stack>

            <Stack sx={{width:'100%', pr:3}} direction='row' spacing={2} flex={'row'} justifyContent={'end'}>
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