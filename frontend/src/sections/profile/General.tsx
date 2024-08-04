import { useState, useRef, useEffect, useMemo } from 'react';
import Iconify from '../../components/iconify/Iconify';
import Label from '../../components/label/Label';
import ProfilePicUpload from '../../components/profilePicUpload';
import StyledTextField from '../../components/styledTextField';
import { StyledSelect, StyledSelectLabel } from '../../components/styledSelect';
import useLoading from '../../hooks/display/useLoading';
import useSnackbar from '../../hooks/display/useSnackbar';
import { useAuth } from '../../hooks/useAuth';
import useAxiosJWT from '../../hooks/useAxiosJWT';
// @mui
import { Stack, Typography, Box, FormControl,  Grid, Card, Button, Slide,  MenuItem} from '@mui/material';
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

interface RoleType{
  id: number;
  title: string;
  description: string | null
};

interface UnitType{
  id: string;
  name: string;
  alias: string | null;
  kk_name: string | null;
  kk_nip: string | null;
  info: string | null
};

interface PeriodType{
  id: number;
  name: string; 
  start: string;
  end: string;
  semester: number;
  tahun: string
};

interface ValueType{
  id: string;
  username: string | number | null;
  name: string | null;
  email: string | null;
  picture: string | null;
  kppn: string;
  role: number | null;
  period: number | string;
  status: number | null;
};

interface refValueType{
  role: string;
  unit: string;
  period: PeriodType[] | [] ; 
};

//------------------------------------------------------------------------
export default function General(){
  const theme = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {auth, setAuth} = useAuth() as AuthType;

  const {isLoading, setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const axiosJWT = useAxiosJWT();

  const [value, setValue] = useState<ValueType>({
    id: auth?.id || '',
    username: auth?.username || '',
    name: auth?.name || '',
    email: auth?.email || '',
    picture: auth?.picture || '',
    kppn: auth?.kppn || '',
    role: auth?.role || 0,
    period: auth?.period || '0',
    status: auth?.status || 0
  });

  const [refValue, setRefValue] = useState<refValueType>({
    role: '',
    unit: '',
    period: [] 
  });

  const periodSelection = useMemo(() => {
    return refValue?.period?.map((item, index) => (
      <MenuItem key={index} sx={{fontSize:14}} value={item.id.toString()}>{item.name}</MenuItem>
    ) || <></>);
  }, [refValue]);

  const handleClick = () => {
    fileInputRef.current?fileInputRef.current.click():null
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValue({...value, [event.target.name]: event.target.value });
  };

  const getData = async () => {
    try{
      setIsLoading(true);
      const response1 = await axiosJWT.get('/getRoleById');
      const response2 = await axiosJWT.get('/getUnitById');
      const response3 = await axiosJWT.get('/getAllPeriod');
      setRefValue({
        role: response1.data.rows[0].title,
        unit: response2.data.rows[0].alias,
        period: response3.data.rows
      });
      setIsLoading(false);
    }catch(err: any){
      openSnackbar(`Failed to fetch user data ${err.response.status}`, 'error');
      setIsLoading(false);
    }finally{
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try{
      setIsLoading(true);
      const profileData = {
        name: value.name,
        username: value.username,
        email: value.email,
        period: value.period
      };
      const response = await axiosJWT.post(`/updateCommonProfile`, profileData);
      const response2 = await axiosJWT.get("/updateToken");
      openSnackbar(`${response.data.message}`, "success");
      setAuth({
        ...response2.data.authInfo,
        accessToken: response2.data.accessToken
      }); 
      setIsLoading(false);
    }catch(err: any){
      setIsLoading(false);
      openSnackbar(`Update profile failed, error: ${err.response.data.message}`, "error");
    }finally{
      setIsLoading(false);
    }
  };

  const reset = () => {
    setValue({
      id: auth?.id || '',
      username: auth?.username || '',
      name: auth?.name || '',
      email: auth?.email || '',
      picture: auth?.picture || '',
      kppn: auth?.kppn || '',
      role: auth?.role || 0,
      period: auth?.period || 0,
      status: auth?.status || 0
    })
  };

  const handleAvatarChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if(!e.target.files){return}

    const selectedFile = e.target.files[0];
    try{
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await axiosJWT.post(`/updateProfilePicture`, formData, {
        headers:{"Content-Type": "multipart/form-data"}
      });
      const response2 = await axiosJWT.get("/updateToken");
      openSnackbar(`${response.data.message}`, "success");
      setAuth({
        ...response2.data.authInfo,
        accessToken: response2.data.accessToken
      });  
      setIsLoading(false); 
    }catch(err: any){
      setIsLoading(false);
      openSnackbar(`Upload failed, ${err.response.data.message}`, "error");
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if(isLoading){
    return <></>
  }

  return (
  <>
    <Grid item xs={12} sm={6} md={4}>
      <Slide direction="right" in mountOnEnter unmountOnExit>
        <Card sx={{height:500}}>
          <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} sx={{ width: 1, height: "100%" }}>
            <input 
              accept='image/*' 
              type='file' 
              style={{display:'none'}} 
              ref={fileInputRef}
              onChange={handleAvatarChange} 
              tabIndex={-1} 
            />
            <ProfilePicUpload
              onClick={handleClick} 
              imageUrl={`${import.meta.env.VITE_API_URL}/avatar/${auth?.picture}?${new Date().getTime()}` || '/avatar/default-female.png'}
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
                  <StyledTextField name="name" value={value.name} label="Nama Pegawai" onChange={handleChange}/>
                </FormControl>
                <FormControl>
                  <StyledTextField name="email" value={value.email} label="Email"  onChange={handleChange}/>
                </FormControl>
                <FormControl>
                  <StyledTextField name="uid" value={value.id} label="UID" disabled/>
                </FormControl>
                <FormControl>
                  <StyledTextField name="role" disabled value={refValue.role} label="Role" />
                </FormControl>
              </Stack>
              <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                <FormControl>
                  <StyledTextField name="username" value={value.username} label="NIP"  onChange={handleChange}/>
                </FormControl>
                <FormControl>
                  <StyledSelectLabel id="period-select-label">Periode</StyledSelectLabel>
                  <StyledSelect 
                    required 
                    name="period" 
                    label="period"
                    labelId="period-select-label"
                    value={value.period}
                    onChange={(e: any) => handleChange(e)}
                  >
                    {periodSelection}
                  </StyledSelect>
                </FormControl>
                <FormControl>
                  <StyledTextField name="status" disabled value={value.status===1?'Active User':'Pending User'} label="Status" />
                </FormControl>
                <FormControl>
                  <StyledTextField name="unit" disabled value={refValue.unit} label="Unit" />
                </FormControl>
              </Stack>
            </Stack>

            <Stack sx={{width:'100%', pr:3, mt:1}} direction='row' spacing={2} flex={'row'} justifyContent={'end'}>
              <Button 
                variant='contained' 
                sx={{borderRadius:'8px'}} 
                onClick={handleUpdateProfile}
              >
                Save Changes
              </Button>
              <Button 
                variant='contained' 
                color='white'
                onClick={reset}
              >
                Reset
              </Button>
            </Stack>
          </UserDataContainer>
        </Card>
      </Slide>
    </Grid>
  </>
  )
}