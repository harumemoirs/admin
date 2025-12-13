import axios from "axios";

const axiosNewsLetter = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL as string + "/api/v1/admin/kairos/newsletter",
    withCredentials:true
})

export default axiosNewsLetter
