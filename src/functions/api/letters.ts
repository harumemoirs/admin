import axios from "axios";
import { API_URL } from "../../config/api";

const axiosLetter = axios.create({
    baseURL: API_URL + "/api/v1/admin/kairos/letters",
    withCredentials:true
})

export default axiosLetter