/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import axios from "axios";
import {useAuth} from "./useAuth";
// -----------------------------------------------

const useRefreshToken = () => {
  const {setAuth} = useAuth() as AuthType; // { username: xxx, role:xxx, accessToken, kppn:xx, msg:xxx}

  const refresh = async() => {
    // if(!cookieExists('refreshToken')){
    //   return null
    // };

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/refresh`, {  
        withCredentials:true
    });
    const authInfo = response?.data?.authInfo;
    const accessToken = response?.data?.accessToken;
    setAuth({...authInfo, accessToken: accessToken});
    
    return accessToken
  };

  return refresh
}

export default useRefreshToken;
// -------------------------------------------------------------

// function cookieExists(cookieName: string) {
//   return document.cookie.split(';').some(cookie => {
//     const [name, value] = cookie.split('=').map(c => c.trim());
//     return name === cookieName;
//   });
// }