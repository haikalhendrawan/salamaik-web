import axios from "axios";

const axiosJWT = axios.create({
    headers: {'Content-Type': 'application/json'},
    withCredentials :true
});

export default axiosJWT;