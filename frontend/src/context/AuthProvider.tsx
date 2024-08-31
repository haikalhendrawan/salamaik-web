import {createContext, useState, ReactNode} from "react";
// --------------------------------------------------------------------
interface Auth{
    id: string;
    username: string | number | null;
    name: string | null;
    email: string | null;
    picture: string | null;
    kppn: string;
    role: number | null;
    period: number | null;
    accessToken: string | null;
    status: number | null;
};

type AuthContextType = {
    auth: Auth | null;
    setAuth: (auth: Auth | null) => void
};

type AuthProviderProps = {
    children: ReactNode
};
// --------------------------------------------------------------------
const AuthContext = createContext<AuthContextType>({auth:null, setAuth: () => {}});


const AuthProvider = ({children}: AuthProviderProps) => {
    const[auth, setAuth] = useState<Auth | null>(null);

    return(
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
export {AuthProvider};
