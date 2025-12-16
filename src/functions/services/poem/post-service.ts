/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosPoem from "../../api/poem"

interface AddPoemData{
    title:string,
    synopsis:string,
    slug:string,
    content:string
}
interface EditPoemData{
    title?:string,
    synopsis?:string,
    slug?:string,
    content?:string
}
 

export const addPoem = async (data: AddPoemData, image: File) => {
  try {
    const form = new FormData();

    form.append("title", data.title);
    form.append("synopsis", data.synopsis);
    form.append("slug", data.slug);
    form.append("content", data.content);
    form.append("image", image);  

    const res = await axiosPoem.post("/add-poem", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status === 201 || res.status === 200) {
      return {
        success: true,
        message: "Poem created successfully",
        poem: res.data,
      };
    }

    return {
      success: false,
      message: `Unexpected status code: ${res.status}`,
    };
  } catch (err: any) {
    
    const msg = err?.response?.data?.message;

    return {
      success: false,
      message: msg || "Something went wrong",
    };
  }
};

export async function editPoem(
  poemId: string,
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/kairos/poems/edit-poem/${poemId}`,
      {
        method: "PUT",
        body: formData,
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to update poem",
      };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Edit poem error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

export interface RemovePoemData {
    poemId:string
}
export const removePoem = async (data:RemovePoemData) => {
  try {
    const res = await axiosPoem.delete(`/delete-poem`,{
        data
    });

      
    if (res.status === 200 || res.status === 204) {
      return {
        success: true,
        message: "Poem removed successfully",
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
        message: msg || "Invalid Poem ID",
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
        message: "You don't have permission to delete this poem",
      };
    }

    if (status === 404) {
      return {
        success: false,
        message: "Poem not found",
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


export async function getPoemForEdit(poemId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/kairos/poems/poem-id/${poemId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to fetch poem",
        blog: null,
      };
    }

    const result = await response.json();
     
    return {
      success: result.success,
      poem: result.data, // Map 'data' to 'blog'
      message: result.message,
    };
  } catch (error) {
    console.error("Get poem error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
      blog: null,
    };
  }
}