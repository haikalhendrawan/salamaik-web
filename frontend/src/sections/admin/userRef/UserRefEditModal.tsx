/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { useState, useEffect } from 'react';
// @mui
import { Paper, Modal, Box, MenuItem, FormControl, Stack, FormHelperText, 
  Button, Grid, Typography, SelectChangeEvent} from '@mui/material';
import {styled} from "@mui/material/styles";
import StyledTextField from '../../../components/styledTextField';
import { StyledSelect, StyledSelectLabel } from '../../../components/styledSelect';
import ProfilePicUpload from '../../../components/profilePicUpload';
import { z } from 'zod';
import Scrollbar from '../../../components/scrollbar';
import useDictionary from '../../../hooks/useDictionary';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
import useLoading from '../../../hooks/display/useLoading';
import useSnackbar from '../../../hooks/display/useSnackbar';
import useUser from './useUser';
import { useAuth } from '../../../hooks/useAuth';
import { sanitizeRole } from './utils';
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

interface UserType{
  id: string,
  username: string,
  name: string,
  email: string,
  picture: string,
  period: number,
  role: number,
  status: number,
  kppn: string,
  gender: number
};

interface ValueType{
  id: string,
  username: string, 
  name: string, 
  email: string, 
  picture: string,
  kppn: string, 
  gender: number,
  role: number
};

interface ErrorType{
  username: boolean, 
  name: boolean, 
  email: boolean, 
  kppn: boolean, 
  gender: boolean,
  role: boolean
};

interface ErrorMessageType{
  username: string, 
  name: string, 
  email: string, 
  kppn: string, 
  gender: string,
  role: string
};

const EditUserSchema = z.object({
  username: z.string().min(18, 'Must be 18 characters long').max(18, 'Must be 18 characters long'),
  name: z.string().min(1, 'Invalid name'),
  email: z.string().email('Invalid email'),
  kppn: z.string().min(3, 'Invalid unit'),
  gender: z.number().min(0).max(1, 'Invalid gender specified')
});


interface UserRefEditModalProps {
  editId: string;
  users: UserType[] | [];
  modalOpen: boolean;
  modalClose: () => void;  
};

//----------------------
export default function UserRefEditModal({editId, users, modalOpen, modalClose}: UserRefEditModalProps) {
  const { auth } = useAuth() as AuthType;

  const { roleRef, kppnRef} = useDictionary();

  const roleSelection = () => {
    if(auth && roleRef){
      if(auth.role===0 || auth.role===1 || auth.role===3){
        return null
      };
  
      if(auth.role===2){
        return roleRef.list.filter((row) => row.id<3 )
      };

      if(auth.role===4){
        return roleRef.list.filter((row) => row.id!==99 )
      };

      return roleRef.list
    }
  };

  const { openSnackbar } = useSnackbar();

  const axiosJWT = useAxiosJWT();

  const { setIsLoading } = useLoading();

  const { getUser } = useUser();

  const [value, setValue] = useState<ValueType>({
    id: "",
    username: "", 
    name: "", 
    email: "",
    picture:"", 
    kppn: "", 
    gender: 0,
    role: 0
  });

  const [error, setError] = useState<ErrorType>({
    username: false, 
    name: false, 
    email: false, 
    kppn: false, 
    gender: false,
    role: false
  });

  const [errorMessage, setErrorMessage] = useState<ErrorMessageType>({
    username: '', 
    name: '', 
    email: '', 
    kppn: '', 
    gender: '',
    role: ''
  });

  const handleReset = () => {
    const selectedUser = users?.find((user) => {
      return user.id === editId
    });

    if(selectedUser){
      setValue({
        id: selectedUser.id,
        username: selectedUser.username,
        name: selectedUser.name,
        email: selectedUser.email,
        picture: selectedUser.picture,
        kppn: selectedUser.kppn,
        gender: selectedUser.gender,
        role: selectedUser.role
      })
    }else{
      setValue({id: "", username: "", name: "", email: "", picture: "", kppn: "", gender: 0, role: 0});
    };

    setError({username: false, name: false, email: false,  kppn: false, gender: false, role: false});
    setErrorMessage({username: '', name: '', email: '', kppn: '', gender: '', role: ''});
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<unknown>) => {
    setValue((prev) => ({...prev, [event.target.name]: event.target.value}));
    setError((prev) => ({...prev, [event.target.name]: false}));
    setErrorMessage((prev) => ({...prev, [event.target.name]: ''}));
  };

  const handleEdit = async () => {
    try{
      setIsLoading(true);
      const result = EditUserSchema.safeParse(value);

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

      const validRoleAndUnit = await sanitizeRole(value.role, value.kppn);
      if(!validRoleAndUnit){
        setError(prev => ({ ...prev, kppn: true, role:true }));
        setErrorMessage(prev => ({ 
          ...prev, 
          kppn: 'cek kesesuaian role dan unit', 
          role: 'cek kesesuaian role dan unit' 
        }));
        return
      };
   
      const response = await axiosJWT.post("/editUser", value);
      await axiosJWT.post("/updateRole", {
        oldRole: users?.find((user) => user.id === editId)?.role,
        newRole: value.role,
        adminRole: auth?.role,
        targetId: editId
      });

      openSnackbar(`${response.data.message}`, "success");
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
        setIsLoading(false);
      }
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const selectedUser = users?.find((user) => {
      return user.id === editId
    });

    if(selectedUser){
      setValue({
        id: selectedUser.id,
        username: selectedUser.username,
        name: selectedUser.name,
        email: selectedUser.email,
        picture: selectedUser.picture,
        kppn: selectedUser.kppn,
        gender: selectedUser.gender,
        role: selectedUser.role
      })
    }
  }, [editId, users]);

  // ----------------------------------------------------------------------------------------
  return(
    <>
      <Modal keepMounted open={modalOpen} onClose={modalClose}>
        <Box sx={style}>
          <Scrollbar>
            <Paper sx={{height:'70vh', width:'auto', p:2}}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Edit User
              </Typography>

              <Grid container sx={{width:'100%', height:'70%'}} spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2} sx={{ width: 1, height: "100%" }}>
                        <ProfilePicUpload 
                          disabled 
                          imageUrl={`${import.meta.env.VITE_API_URL}/avatar/${value.picture}`} 
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
                          <FormControl error={error.role}>
                            <StyledSelectLabel id="role-select-label">Role</StyledSelectLabel>
                            <StyledSelect 
                              required 
                              name="role" 
                              label="role"
                              labelId="role-select-label"
                              value={value.role}
                              onChange={handleChange}
                            >
                              {roleSelection()?.map((row: any, index: number) => (
                                <MenuItem 
                                  key={index+1} 
                                  sx={{ fontSize: 14 }} 
                                  value={row.id}
                                >
                                  {row.title}
                                </MenuItem>
                              ))}
                            </StyledSelect>
                            <FormHelperText sx={{display:error.role?'block':'none'}}>
                              {errorMessage.role || null}
                            </FormHelperText>
                          </FormControl>
                        </Stack>
                      </Stack>
                      <Stack sx={{width:'100%', pr:3, mt:1}} direction='row' spacing={2} flex={'row'} justifyContent={'end'}>
                        <Button 
                          variant='contained'
                          color='warning' 
                          sx={{borderRadius:'8px'}}
                          onClick={handleEdit}
                        >
                          Save Changes
                        </Button>
                        <Button 
                          variant='contained'
                          color='white'
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

 