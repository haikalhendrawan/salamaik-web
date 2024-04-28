import axios from "axios";

const axiosJWT = axios.create({
    headers: {'Content-Type': 'application/json'},
    withCredentials :true,
    baseURL: import.meta.env.VITE_API_URL
});

export default axiosJWT;