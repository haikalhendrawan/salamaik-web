import { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import Header from './header';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));
// ----------------------------------------------------------------------
interface RqAuthHorizontalLayoutProp{
  allowedRoles: any[]
}; 
// ----------------------------------------------------------------------
export default function RequireAuthHorizontalLayout({allowedRoles}: RqAuthHorizontalLayoutProp){
 // const {auth} = useAuth() as AuthType;  //  { username: xxx, role:xxx, accessToken, msg:xxx}
 const [open, setOpen] = useState(false);
 const location = useLocation();

 // if (!auth || !auth.accessToken){
 //   return <Navigate to="/login" state={{from:location}} replace />
 // }

 
 // return <Navigate to="/403" state={{from:location}} replace /> // if user sudah login, tapi allowed role tidak termasuk
  return (
    <StyledRoot>
      <Header />
      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  );
}