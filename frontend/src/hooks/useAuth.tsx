import {useContext} from "react";
import AuthContext from "../context/AuthProvider";

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
}

type AuthContextType = {
    auth: Auth | null;
    setAuth: (auth: Auth | null) => void
};

const useAuth = () :  AuthContextType => {
    return useContext(AuthContext);
}

export {useAuth};