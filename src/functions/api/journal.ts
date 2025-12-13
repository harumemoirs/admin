import axios from "axios";

const axiosJournals = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL as string +"/api/v1/admin/kairos/journals",
    withCredentials:true
})

export default axiosJournals