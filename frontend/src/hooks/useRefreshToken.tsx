import axios from "axios";
import {useAuth} from "./useAuth";


const useRefreshToken = () => {
    const {auth, setAuth} = useAuth() as AuthType; // { username: xxx, role:xxx, accessToken, kppn:xx, msg:xxx}
    const refresh = async() => {
        const response = await axios.get("/refresh", {  
            withCredentials:true
        });
        console.log(response.data);
        const {id, username, name, email, image, role, kppn, accessToken, namaPIC, nipPIC, emailPIC, msg} = response.data;
        setAuth({...auth, id, username, name, email, image, role, kppn, accessToken, namaPIC, nipPIC, emailPIC, msg});
        return accessToken;
    }

    return refresh;
}

export default useRefreshToken;