import {createContext, useState} from "react";
import {AuthProviderType} from "../types/hooks/authTypes";

const AuthContext = createContext({});


const AuthProvider = ({children}:AuthProviderType) => {
    const[auth, setAuth] = useState<null | AuthType>(null);

    return(
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
export {AuthProvider};
