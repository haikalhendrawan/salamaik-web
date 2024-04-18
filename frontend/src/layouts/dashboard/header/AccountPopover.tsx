import { useState, useEffect } from 'react';
import axios from "axios";
import {NavLink, NavLinkProps} from "react-router-dom"
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar,
        IconButton, Popover} from '@mui/material';
import Iconify from '../../../components/iconify';
// hooks and other stuff
import {useAuth} from "../../../hooks/useAuth";
// ----------------------------------------------------------------------
interface MenuOptionType{
  label:string,
  icon:string,
  link:string,
  component: React.ForwardRefExoticComponent<NavLinkProps & React.RefAttributes<HTMLAnchorElement>>
}

const MENU_OPTIONS: Array<MenuOptionType> = [
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    link : '/profile',
    component:NavLink
  },
  // {
  //   label: 'Settings',
  //   icon: 'eva:settings-2-fill',
  // },
  {
    label: 'Smt 1 2024',
    icon: 'mdi:calendar',
    link: '',
    component:NavLink
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState<null | EventTarget & HTMLButtonElement>(null);
  const {auth, setAuth } = useAuth() as AuthType;
  const [anchorEl, setAnchorEl] = useState(null); 
  const openPeriod = Boolean(anchorEl); 
  const [avatarKey, setAvatarKey] = useState(0);

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

  const logout = async () => {
    setAuth({});
    try {
      const response = await axios.delete("/logout", { withCredentials: true });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setAvatarKey(avatarKey+1)
  },[auth]);


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
        <Avatar key={avatarKey} src={'/avatar/default-male.png'} alt="photoURL" />
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
            {auth?.name || 'User'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {auth?.email || 'user@kemenkeu.go.id'}
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
