/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useEffect} from "react";
import axiosJWT from "../config/axios";
import {useAuth} from "./useAuth";
import useRefreshToken from "./useRefreshToken";


const useAxiosJWT = () => {
    const {auth} = useAuth() as AuthType;
    const refresh = useRefreshToken();

    useEffect(() => {
    const requestIntercept = axiosJWT.interceptors.request.use((config) => {
        if(!config.headers.Authorization){
            config.headers.Authorization = `Bearer ${auth?.accessToken}` // setiap request kita auth di header yg valuenya mrpk accessToken
        }

        if (config.method === 'get') {
            const timeStamp = new Date().getTime(); 
            config.params = {...config.params, _: timeStamp}; // Add time to the params, utk cache busting
        }
        return config;
    }, (error) => {
        return Promise.reject(error)
    });

    const responseIntercept = axiosJWT.interceptors.response.use((resp) => {
        return resp
    }, async (error) => {
        const prevRequest = error?.config;
        if(error?.resp?.status ==="403" && !prevRequest?.sent){
            prevRequest.sent = true;
            const newAccessToken = await refresh();
            prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosJWT(prevRequest);
        }
        return Promise.reject(error);
    });

    return () => {
        axiosJWT.interceptors.request.eject(requestIntercept);
        axiosJWT.interceptors.response.eject(responseIntercept);
    }

}, [auth, refresh])
    return axiosJWT;
}

export default useAxiosJWT;

