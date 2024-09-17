/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useContext} from "react";
import AuthContext from "../context/AuthProvider";

export interface AuthType{
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
    auth: AuthType | null;
    setAuth: (auth: AuthType | null) => void
};

const useAuth = () :  AuthContextType => {
    return useContext(AuthContext);
}

export {useAuth};