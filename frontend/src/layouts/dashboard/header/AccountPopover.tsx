import { useState, useEffect, useMemo } from 'react';
import {NavLink, NavLinkProps} from "react-router-dom"
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar,
        IconButton, Popover} from '@mui/material';
import Iconify from '../../../components/iconify';
import useSnackbar from '../../../hooks/display/useSnackbar';
// hooks and other stuff
import {useAuth} from "../../../hooks/useAuth";
import useAxiosJWT from '../../../hooks/useAxiosJWT';
// ----------------------------------------------------------------------
interface MenuOptionType{
  label:string,
  icon:string,
  link:string,
  component: React.ForwardRefExoticComponent<NavLinkProps & React.RefAttributes<HTMLAnchorElement>>
}


// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState<null | EventTarget & HTMLButtonElement>(null);

  const [periodText, setPeriodText] = useState<string>("");

  const {auth, setAuth} = useAuth() as AuthType;

  const [anchorEl, setAnchorEl] = useState(null); 

  const openPeriod = Boolean(anchorEl); 

  const {openSnackbar} = useSnackbar();

  const axiosJWT = useAxiosJWT();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  // const handleOpenPeriod = (event) => {
  //   setAnchorEl(event.currentTarget);
  //   console.log(openPeriod)
  // }

  const getPeriod = async() => {
    try{
      const response = await axiosJWT.get("/getPeriodById");
      const semester = response?.data?.rows[0]?.semester;
      const tahun = response?.data?.rows[0]?.tahun;
      const periodText = `Smt ${semester} ${tahun}`;
      setPeriodText(periodText);
    }catch(err: any){
      openSnackbar(err?.response?.data?.message, "error");
    }
  }

  const logout = async () => {
    setAuth(null);
    try {
      const response = await axiosJWT.get("/logout");
      openSnackbar(response.data.message, "success");
    } catch (err: any) {
      openSnackbar(err?.response?.data?.message, "error");
    }
  };

  useEffect(() => {
    getPeriod();
  }, [auth?.period]);

  
  const MENU_OPTIONS: Array<MenuOptionType> =  [
    {
      label: 'Profile',
      icon: 'eva:person-fill',
      link : '/profile',
      component:NavLink
    },
    {
      label: periodText,
      icon: 'mdi:calendar',
      link: '/profile',
      component:NavLink
    },
  ];


// -----------------------------------------------------------------------------------------------
  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={`${import.meta.env.VITE_API_URL}/avatar/${auth?.picture}?${new Date().getTime()}` || '/avatar/default-female.png'} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper:{
            sx:{
              p: 0,
              mt: 1.5,
              ml: 0.75,
              width: 180,
              '& .MuiMenuItem-root': {
                typography: 'body2',
                borderRadius: 0.75,
              },
              borderRadius:'12px'
            }
          }
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {auth?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {auth?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} component={option.component} to={option.link} onClick={handleClose}>
              <Iconify icon={option.icon} sx={{mr:1}} />
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>{option.label}</Typography>
            </MenuItem>
          ))}

            {/* <Menu anchorEl={anchorEl} open={openPeriod} onClose={()=>{setAnchorEl(null)}}>
              <MenuItem key={1}>
                <Typography variant='body2' >Smt 1 2023</Typography>
              </MenuItem>
              <MenuItem key={2}>
                <Typography variant='body2' >Smt 2 2023</Typography>
              </MenuItem>
            </Menu> */}
            
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={logout} sx={{ m: 1 }}>
          <Iconify icon={'material-symbols:logout'} sx={{mr:1, color:'red'}}/> 
          Logout
        </MenuItem>
      </Popover>

    </>
  );
}
