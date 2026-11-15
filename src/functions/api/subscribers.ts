import axios from "axios"
import { API_URL } from "../../config/api";

const axiosSubscribers = axios.create({
    baseURL: API_URL + "/api/v1/subscribers",
    headers:{"Content-Type":"applications/json"},
    withCredentials:true
})

export default axiosSubscribers