import axios from "axios";
import useAxiosJWT from "./useAxiosJWT";
import {useAuth} from "./useAuth";
// -----------------------------------------------

const useRefreshToken = () => {
    const {auth, setAuth} = useAuth() as AuthType; // { username: xxx, role:xxx, accessToken, kppn:xx, msg:xxx}

    const refresh = async() => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/refresh`, {  
            withCredentials:true
        });
        const authInfo = response?.data?.authInfo;
        const accessToken = response.data.accessToken;
        setAuth({...authInfo, accessToken: accessToken});
        
        return accessToken
    }

    return refresh
}

export default useRefreshToken;