import { useState, useEffect, useRef } from 'react';
// @mui
import { Paper, Modal, Box, Slide, Card, FormControl, Stack, Button, Grid, Typography} from '@mui/material';
import {useTheme, styled} from "@mui/material/styles";
import StyledTextField from '../../../components/styledTextField';
import ProfilePicUpload from '../../../components/profilePicUpload';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
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
}

//----------------------
export default function UserRefEditModal({modalOpen, modalClose}: UserRefEditModalProps) {
    const theme = useTheme();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
      fileInputRef.current?fileInputRef.current.click():null
    }

    // ----------------------------------------------------------------------------------------
    return(
        <>
        <Modal open={modalOpen} onClose={modalClose}>
          <Box sx={style}>
            <Scrollbar>
              <Paper sx={{height:'70vh', width:'auto', p:2}}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Edit User
                </Typography>

                <Grid container sx={{width:'100%', height:'70%'}} spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                        <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} sx={{ width: 1, height: "100%" }}>
                          <input accept='image/*' type='file' style={{display:'none'}} ref={fileInputRef} tabIndex={-1} />
                          <ProfilePicUpload onClick={handleClick} imageUrl='/avatar/default-male.png' />

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
                              <StyledTextField name="name" label="Nama Pegawai" />
                            </FormControl>
                            <FormControl>
                              <StyledTextField name="email" label="Email"  />
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
                              <StyledTextField name="gender" label="Gender" />
                            </FormControl>
                          </Stack>
                        </Stack>

                        <Stack sx={{width:'100%', pr:3, mt:1}} direction='row' spacing={2} flex={'row'} justifyContent={'end'}>
                          <Button variant='contained' sx={{borderRadius:'8px'}}>Save Changes</Button>
                          <Button variant='contained' sx={{borderRadius:'8px', backgroundColor:theme.palette.common.white, color:theme.palette.common.black}}>Reset</Button>
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

 