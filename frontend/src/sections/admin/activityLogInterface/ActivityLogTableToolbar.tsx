import {useState, useEffect} from 'react';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Toolbar, FormControl, InputLabel, MenuItem, Stack,} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// component
import Iconify from '../../../components/iconify/Iconify';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
import useSnackbar from '../../../hooks/display/useSnackbar';
import { UserType } from '../userRef/types';
// ----------------------------------------------------------------------
const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width:240,
    },
  },
};

// ----------------------------------------------------------------------
interface ActivityLogTableToolbarProps {
  filterUser: (event: SelectChangeEvent) => void;
  filterCluster: (event: SelectChangeEvent) => void;
};

const ACTIVITY_CLUSTER = [
  {cluster: 1, title: 'Auth/Login/Register'},
  {cluster: 2, title:'Kertas Kerja'},
  {cluster: 3, title:'Profil'},
  {cluster: 4, title:'Admin'},
  {cluster: 6, title:'Matriks'},
];

// -------------------------------------------------------------------

export default function ActivityLogTableToolbar({filterCluster, filterUser}: ActivityLogTableToolbarProps) {
  const theme = useTheme();

  const [users, setUsers] = useState<UserType[] | []>([]);

  const axiosJWT = useAxiosJWT();

  const {openSnackbar} = useSnackbar();

  const getUser = async() => {
    try{
      const time = new Date().getTime();
      const response = await axiosJWT.get(`/getUser?time=${time}`);
      setUsers(response.data.rows);
    }catch(err: any){
      openSnackbar(err.response.data.message, "error");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <StyledRoot
      >
        <Stack direction="row" spacing={2}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="jenis-select-label" sx={{typography:'body2', alignItems:'center', display:'flex', justifyContent:'center', alignContent:'center', gap: 1}}>
              Jenis 
              <Iconify icon="solar:layers-bold-duotone"/>
            </InputLabel>
            <Select 
              labelId="jenis-select-label" 
              id="unit-select" 
              sx={{width:'200px', typography:'body2'}} 
              label="status" 
              onClick={(event)=>{event.stopPropagation()}}
              onChange={filterCluster}
              MenuProps={MenuProps}
              defaultValue={''}
              >
                <MenuItem 
                  sx={{typography:'body2', color:theme.palette.primary.main}} 
                  onClick={(event)=>{event.stopPropagation()}} 
                  value={''}
                >
                  Seluruh Aktivitas
                </MenuItem>
                {ACTIVITY_CLUSTER.map((item, index) => {
                  return(<MenuItem 
                            key={index} 
                            onClick={(event)=>{event.stopPropagation()}} 
                            sx={{typography:'body2'}} 
                            value={item.cluster}
                          >
                            {item.title}
                          </MenuItem>
                        )
                })}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="user-select-label" sx={{typography:'body2', alignItems:'center', display:'flex', justifyContent:'center', alignContent:'center', gap: 1}}>
              Pegawai 
              <Iconify icon="solar:user-id-bold-duotone"/>
            </InputLabel>
            <Select 
              labelId="user-select-label" 
              id="unit-select" 
              sx={{width:'200px', typography:'body2'}} 
              label="status" 
              onClick={(event)=>{event.stopPropagation()}}
              onChange={filterUser}
              MenuProps={MenuProps}
              defaultValue={''}
              >
                <MenuItem 
                  sx={{typography:'body2', color:theme.palette.primary.main}} 
                  onClick={(event)=>{event.stopPropagation()}} 
                  value={''}
                >
                  Seluruh User
                </MenuItem>
                {users.map((item, index) => {
                  return(<MenuItem 
                            key={index} 
                            onClick={(event)=>{event.stopPropagation()}} 
                            sx={{typography:'body2'}} 
                            value={item.username}
                          >
                            {item.name}
                          </MenuItem>
                        )
                })}
            </Select>
          </FormControl>

        </Stack>
        
      </StyledRoot>
    </>
  );
}

