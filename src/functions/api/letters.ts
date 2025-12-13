import axios from "axios";

const axiosLetter = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL as string +"/api/v1/admin/kairos/letters",
    withCredentials:true
})

export default axiosLetter