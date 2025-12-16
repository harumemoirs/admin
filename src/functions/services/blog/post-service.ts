/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosBlogs from "../../api/blog";

interface AddBlogData{
    title:string,
    synopsis:string,
    slug:string,
    content:string
}
interface EditBlogData{
    title?:string,
    synopsis?:string,
    slug?:string,
    content?:string
}
 

export const addBlog = async (data: AddBlogData, image: File) => {
  try {
    const form = new FormData();

    form.append("title", data.title);
    form.append("synopsis", data.synopsis);
    form.append("slug", data.slug);
    form.append("content", data.content);
    form.append("image", image);  

    const res = await axiosBlogs.post("/add-blog", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status === 201 || res.status === 200) {
      return {
        success: true,
        message: "Blog created successfully",
        blog: res.data,
      };
    }

    return {
      success: false,
      message: `Unexpected status code: ${res.status}`,
    };
  } catch (err: any) {
    const status = err?.response?.status;
    const msg = err?.response?.data?.message;

    return {
      success: false,
      message: msg || "Something went wrong",
    };
  }
};

 

export async function editBlog(
  blogId: string,
  data: {
    title: string;
    content: string;
    synopsis: string;
    slug: string;
  },
  image?: File
) {
  try {
    const formData = new FormData();
    
 
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("synopsis", data.synopsis);
    formData.append("slug", data.slug);
    
  
    if (image) {
      formData.append("image", image);
      formData.append("replaceImages", "true");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/kairos/blogs/edit-blog/${blogId}`, {
      method: "PUT",
      body: formData,
      credentials: "include",  
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to update blog",
      };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Edit blog error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}
interface RemoveBlogData {
    blogId:string
}
export const removeBlog = async (data:RemoveBlogData) => {
  try {
    const res = await axiosBlogs.delete(`/delete-blog`,{
        data
    });

      
    if (res.status === 200 || res.status === 204) {
      return {
        success: true,
        message: "Blog removed successfully",
      };
    }

    return {
      success: false,
      message: `Unexpected status code: ${res.status}`,
    };
  } catch (err: any) {
    const status = err?.response?.status;
    const msg = err?.response?.data?.message;

    
    if (status === 400) {
      return {
        success: false,
        message: msg || "Invalid blog ID",
      };
    }

    if (status === 401) {
      return {
        success: false,
        message: "Unauthorized — please login again",
      };
    }

    if (status === 403) {
      return {
        success: false,
        message: "You don't have permission to delete this blog",
      };
    }

    if (status === 404) {
      return {
        success: false,
        message: "Blog not found",
      };
    }

    if (status === 500) {
      return {
        success: false,
        message: "Server error — try again later",
      };
    }

    // FALLBACK
    return {
      success: false,
      message: msg || "Something went wrong",
    };
  }
};

export async function getBlogForEdit(blogId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/kairos/blogs/blog-id/${blogId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to fetch blog",
        blog: null,
      };
    }

    const result = await response.json();
    
    // Backend returns { success: true, data: {...} }
    // But frontend expects { success: true, blog: {...} }
    // So we normalize it here
    return {
      success: result.success,
      blog: result.data, // Map 'data' to 'blog'
      message: result.message,
    };
  } catch (error) {
    console.error("Get blog error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
      blog: null,
    };
  }
}