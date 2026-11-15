import axios from "axios";
import { API_URL } from "../../config/api";

const axiosPoem = axios.create({
    baseURL: API_URL + "/api/v1/admin/kairos/poems",
    withCredentials:true
})

export default axiosPoem 