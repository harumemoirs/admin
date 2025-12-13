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

export const editPoem = async (
  poemId: string,
  data: EditPoemData,
  image?: File
) => {
  try {
    const form = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        form.append(key, value as string);
      }
    });

    if (image) {
      form.append("image", image);
    }

    const res = await axiosPoem.put(`/edit-poem/${poemId}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status === 200) {
      return {
        success: true,
        message: "Poem updated successfully",
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

interface RemovePoemData {
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