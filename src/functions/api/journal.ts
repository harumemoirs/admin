import axios from "axios";
import { API_URL } from "../../config/api";

const axiosJournals = axios.create({
    baseURL: API_URL + "/api/v1/admin/kairos/journals",
    withCredentials:true
})

export default axiosJournals