import { Helmet } from 'react-helmet-async';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/iconify/Iconify';
import Label from '../../components/label/Label';
// @mui
import { Container, Stack, Typography, Box, FormControl,  Grid, IconButton, Card, TextField, CardContent} from '@mui/material';
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
  backgroundImage: `url('/avatar/default-male.png')`, 
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
  fontSize:10,
  typography:'body2',
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
      <Card sx={{height:500}}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ width: 1, height: "100%" }}
        >
          <input accept='image/*' type='file' style={{display:'none'}} ref={fileInputRef} tabIndex={-1} />
          <ImageBox>
            <ImageButton onClick={handleClick}>
              <ImageBackdrop className="backdrop" />
              <BackdropTypography variant="body2">Upload</BackdropTypography>
              <BackdropIcon icon={"solar:camera-bold"} />
            </ImageButton>
          </ImageBox>

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
    </Grid>

    <Grid item xs={12} sm={6} md={8}>
      <Card sx={{height:550}}>
        <Box sx={{height:'100%'}}>
          <FormControl sx={{width:'100%'}}>
            <StyledInput name="name" label="Nama Pegawai"  required />
          </FormControl>
          <FormControl sx={{width:'100%'}}>
            <StyledInput name="name" label="Nama Pegawai"  required />
          </FormControl>
          <FormControl sx={{width:'100%'}}>
            <StyledInput name="name" label="Nama Pegawai"  required />
          </FormControl>
          <FormControl sx={{width:'100%'}}>
            <StyledInput name="name" label="Nama Pegawai"  required />
          </FormControl>
          <FormControl sx={{width:'100%'}}>
            <StyledInput name="name" label="Nama Pegawai"  required />
          </FormControl>
        </Box>

      </Card>
    </Grid>
  </>
  )
}