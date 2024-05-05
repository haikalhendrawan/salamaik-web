import axios from "axios";

const axiosJWT = axios.create({
    headers: {'Content-Type': 'application/json'},
    withCredentials :true,
    baseURL: import.meta.env.VITE_API_URL
});

const axiosPublic= axios.create({
    headers: {'Content-Type': 'application/json'},
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials :true,
});


export default axiosJWT;
export {axiosPublic}