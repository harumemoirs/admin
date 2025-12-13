import axios from "axios"

const axiosSubscribers = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL as string + "/api/v1/subscribers",
    headers:{"Content-Type":"applications/json"},
    withCredentials:true
})

export default axiosSubscribers