import { Outlet, Navigate, useLocation } from 'react-router-dom';
import {useAuth} from "../../hooks/useAuth"; 

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
export default function ReverseAuthLayout() {
  const {auth} = useAuth();  //  { username: xxx, role:xxx, accessToken, msg:xxx}

  const location = useLocation();

  if (auth && auth?.accessToken){
    return <Navigate to="/home" state={{from:location}} replace />
  };
  
  return <Outlet />
}
