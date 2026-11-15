import axios from "axios"
import { API_URL } from "../../config/api"

const axiosLoginAuth = axios.create({
    baseURL: API_URL + "/api/kairos/v1/admin/auth/login-admin",
    headers:{
        "Content-Type":"application/json"
    },
     withCredentials:true
})

const me = axios.create({
    baseURL: API_URL + "/api/kairos/v1/admin/auth/me",
    headers:{"Content-type":"application/json"},
    withCredentials:true
})

export { me, axiosLoginAuth}