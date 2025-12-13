import axios from "axios";

const axiosPoem = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL as string +"/api/v1/admin/kairos/poems",
    withCredentials:true
})

export default axiosPoem 