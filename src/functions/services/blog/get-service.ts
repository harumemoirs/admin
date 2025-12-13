/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosBlogs from "../../api/blog";
export const getAllBlogs = async (page = 1, limit = 10) => {
  try {
    const res = await axiosBlogs.get("/all-blogs", {
      params: { page, limit },
    });

    return res.data;
  } catch (error:any) {
    console.error("Error fetching blogs:", error?.response?.data || error);
    throw new Error(error?.response?.data?.message || "Failed to get blogs");
  }
};


export const getBlogBySlug = async (slug: string) => {
  try {
    const res = await axiosBlogs.get(`/by-slug/${slug}`);
    return res.data;  
  } catch (error) {
    console.error("Error fetching blog ", error);
    throw error;
  }
};

export const getBlogById = async (id:string) => {
  try {
    const res = await axiosBlogs.get(`/blog-id/${id}`)
    return res.data
  } catch (error) {
    console.error('Error fetching blog',error)
    throw error
  }
}