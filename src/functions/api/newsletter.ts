import axios from "axios";
import { API_URL } from "../../config/api";

const axiosNewsLetter = axios.create({
    baseURL: API_URL + "/api/v1/admin/kairos/newsletter",
    withCredentials:true
})

export default axiosNewsLetter
