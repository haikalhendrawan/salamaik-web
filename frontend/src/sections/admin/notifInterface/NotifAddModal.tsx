import { useState, useEffect, useRef } from 'react';
// @mui
import { Paper, Modal, Box, Select, MenuItem, InputLabel, FormControl, Stack, Button, Grid, Typography} from '@mui/material';
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

interface NotifAddModalProps {
    modalOpen: boolean;
    modalClose: () => void;  
};

interface ValueInput{
  judul: string,
  message: string,
  categories: string
}

//----------------------
export default function NotifAddModal({modalOpen, modalClose}: NotifAddModalProps) {
    const theme = useTheme();

    const [value, setValue] = useState<ValueInput>({
      judul: '',
      message: '',
      categories: '0'
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValue({...value, [event.target.name]: event.target.value });
      console.log(value)
    };

    // ----------------------------------------------------------------------------------------
    return(
        <>
        <Modal open={modalOpen} onClose={modalClose}>
          <Box sx={style}>
            <Scrollbar>
              <Paper sx={{height:'70vh', width:'auto', p:2}}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Add Notification
                </Typography>

                <Grid container sx={{width:'100%', height:'70%'}} spacing={2}>

                  <Grid item xs={12}>
                    <UserDataContainer>
                      <Stack direction='row' spacing={2} sx={{width:'100%'}} justifyContent={'center'}>
                        <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                          <FormControl>
                            <StyledTextField 
                              name="judul" 
                              label="Judul"
                              value={value.judul} 
                              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => handleChange(e)}/>
                          </FormControl>
                          <FormControl>
                            <StyledTextField 
                              name="message" 
                              label="Detail"
                              multiline 
                              minRows={3} 
                              value={value.message} 
                              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => handleChange(e)}/>
                          </FormControl>
                          <FormControl>
                            <InputLabel id="categories-select-label" sx={{typography:'body2'}}>Categories</InputLabel>
                            <Select 
                              required 
                              name="categories" 
                              label='categories'
                              labelId="categories-select-label"
                              value={value.categories}
                              sx={{typography:'body2', fontSize:14, height:'100%'}}
                              onChange={(e: any) => handleChange(e)}
                            >
                              <MenuItem key={0} sx={{fontSize:14}} value={0}>General</MenuItem>
                              <MenuItem key={1} sx={{fontSize:14}} value={1}>App Changes</MenuItem>
                            </Select>
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

 