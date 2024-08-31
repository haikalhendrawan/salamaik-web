import {useState, useEffect} from "react";
import {Outlet} from "react-router-dom";
import { useTheme } from '@mui/material/styles';
// import Footer from '../dashboard/footer';
import PuffLoader from "react-spinners/PuffLoader";
// hooks
import useRefreshToken from "../../hooks/useRefreshToken";
// ------------------------------------------------------------------

export default function PersistLogin() {
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(true);

  const refresh = useRefreshToken();

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      }catch(err){
        setIsLoading(false);
        console.log(err,isMounted);
      }finally {
        setIsLoading(false);
      }
    };
    
    verifyRefreshToken();

    return (() => {isMounted = false}) 
  }, []);

  return (
    <>
    {isLoading
    ? 
      <div style ={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <PuffLoader color={theme.palette.primary.main}  style={{ justifyContent: 'center', alignItems: 'center' }}/>
      </div>
    :
      <> 
        <Outlet />
      </>
    }
    </>
  )
}
