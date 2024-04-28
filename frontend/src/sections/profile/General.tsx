import { useState, useRef, useEffect } from 'react';
import Iconify from '../../components/iconify/Iconify';
import Label from '../../components/label/Label';
import ProfilePicUpload from '../../components/profilePicUpload';
import StyledTextField from '../../components/styledTextField';
import useLoading from '../../hooks/display/useLoading';
import useSnackbar from '../../hooks/display/useSnackbar';
import { useAuth } from '../../hooks/useAuth';
import useAxiosJWT from '../../hooks/useAxiosJWT';
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

  const { auth } = useAuth() as AuthType;

  const {setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const axiosJWT = useAxiosJWT();

  const [refValue, setRefValue] = useState({
    role: '',
    unit: '',
    period: ''  
  });

  const handleClick = () => {
    fileInputRef.current?fileInputRef.current.click():null
  };

  useEffect(() => {
    const getData = async () => {
      try{
        setIsLoading(true);
        const response1 = await axiosJWT.get('/getRoleById');
        const response2 = await axiosJWT.get('/getUnitById');
        const response3 = await axiosJWT.get('/getPeriodById');
        setRefValue({
          role: response1.data.rows[0].title,
          unit: response2.data.rows[0].name,
          period: response3.data.rows[0].name
        });

        setIsLoading(false);
      }catch(err){
        openSnackbar('Failed to fetch user data', 'error');
        setIsLoading(false);
      }finally{
        setIsLoading(false);
      }
    }

    getData();
  }, [])

  return (
  <>
    <Grid item xs={12} sm={6} md={4}>
      <Slide direction="right" in mountOnEnter unmountOnExit>
        <Card sx={{height:500}}>
          <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} sx={{ width: 1, height: "100%" }}>
            <input accept='image/*' type='file' style={{display:'none'}} ref={fileInputRef} tabIndex={-1} />
            <ProfilePicUpload 
              onClick={handleClick} 
              imageUrl={auth?.picture || '/avatar/default-female.png'}
            />

            <Stack direction="column"justifyContent="center"alignItems="center">
              <Typography variant='body2' color={theme.palette.text.disabled}>
                {auth?.name}
              </Typography>
              <Typography variant='body2' color={theme.palette.text.disabled} sx={{mt:0}}>
                {auth?.username}
              </Typography>
            </Stack>

            {auth?.status === 1 
              ?<Label color='success'>Active User</Label>
              :<Label color='warning'>Pending User</Label>
            }
            
            <Typography variant='body2' color={theme.palette.text.disabled} sx={{mt:0}}>
              { refValue?.role }
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
                  <StyledTextField name="name" defaultValue='User' label="Nama Pegawai" />
                </FormControl>
                <FormControl>
                  <StyledTextField name="email" defaultValue='User@kemenkeu.go.id' label="Email"  />
                </FormControl>
                <FormControl>
                  <StyledTextField name="uid" defaultValue='12AB-QWEN-03PE-003M' label="UID" disabled/>
                </FormControl>
                <FormControl>
                  <StyledTextField name="role" defaultValue='Admin Kanwil' label="Role"  />
                </FormControl>
              </Stack>
              <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                <FormControl>
                  <StyledTextField name="nip" defaultValue='199904082021011001' label="NIP"  />
                </FormControl>
                <FormControl>
                  <StyledTextField name="unit" defaultValue='Kanwil DJPb Sumbar' label="Unit" />
                </FormControl>
                <FormControl>
                  <StyledTextField name="name" defaultValue='User' label="Nama Pegawai" />
                </FormControl>
                <FormControl>
                  <StyledTextField name="periode" defaultValue='Smt 1 2024' label="Periode" />
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