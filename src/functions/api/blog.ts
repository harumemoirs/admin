import axios from "axios";
import { API_URL } from "../../config/api";

const axiosBlogs = axios.create({
    baseURL: API_URL + "/api/v1/admin/kairos/blogs",
    withCredentials:true
})

export default axiosBlogs