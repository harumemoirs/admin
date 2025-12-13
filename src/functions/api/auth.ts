import axios from "axios"

const axiosLoginAuth = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL as string + "/api/kairos/v1/admin/auth/login-admin",
    headers:{
        "Content-Type":"application/json"
    },
     withCredentials:true
})

const me = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL+"/api/kairos/v1/admin/auth/me",
    headers:{"Content-type":"application/json"},
    withCredentials:true
})

export { me, axiosLoginAuth}