import {createContext, useState} from "react";

interface AuthProvider{
    children: JSX.Element | JSX.Element[]
}

const AuthContext = createContext({});


const AuthProvider = ({children}:AuthProvider) => {
    const[auth, setAuth] = useState();

    return(
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
export {AuthProvider};
