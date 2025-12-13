import axios from "axios";

const axiosBlogs = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL as string +"/api/v1/admin/kairos/blogs",
    withCredentials:true
})

export default axiosBlogs