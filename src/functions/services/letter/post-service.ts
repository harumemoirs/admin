/* eslint-disable @typescript-eslint/no-explicit-any */
 
import axiosLetter from "../../api/letters";

interface AddLetterData{
    title:string,
    date:string
    slug:string,
    content:string
   
}
interface EditLetterData{
    title?:string,
    content?:string,
    slug?:string,
    date?:string,
    
}
 

export const addLetter = async (data: AddLetterData,image:File) => {
  try {
    const form = new FormData();

    form.append("title", data.title);
    form.append("date", data.date);
    form.append("slug", data.slug);
    form.append("content", data.content);
    form.append("image",image)

    const res = await axiosLetter.post("/add-letter", form, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials:true
    });

    if (res.status === 201 || res.status === 200) {
      return {
        success: true,
        message: "Letter created successfully",
        letter: res.data,
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

export const editLetter = async (
  letterId: string,
  data: EditLetterData,
  image?: File,
  replaceImages = false
) => {
  try {
    const form = new FormData();

    if (data.title) form.append("title", data.title);
    if (data.content) form.append("content", data.content);
    if (data.slug) form.append("slug", data.slug);
    if (data.date) form.append("synopsis", data.date);

    if (image) {
      form.append("image", image);
      form.append("replaceImages", replaceImages ? "true" : "false");
    }

    const res = await axiosLetter.put(
      `/edit-letter/${letterId}`,
      form,
      {
        withCredentials: true, // IMPORTANT
        // ❌ NO Content-Type
      }
    );

    if (res.status === 200) {
      return {
        success: true,
        message: "Letter updated successfully",
        letter: res.data,
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


interface RemoveLetterData {
    letterId:string
}
export const removeLetter = async (data:RemoveLetterData) => {
  try {
    const res = await axiosLetter.delete(`/remove-letter`,{
        data
    });

      
    if (res.status === 200 || res.status === 204) {
      return {
        success: true,
        message: "Letter removed successfully",
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
        message: msg || "Invalid Letter ID",
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
        message: "You don't have permission to delete this Letter",
      };
    }

    if (status === 404) {
      return {
        success: false,
        message: "Letter not found",
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

export async function getLetterForEdit(letterId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/kairos/letters/letter-id/${letterId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to fetch letter",
        letter: null,
      };
    }

    const result = await response.json();
   
    return {
      success: result.success,
      letter: result.data, // Map 'data' to 'blog'
      message: result.message,
    };
  } catch (error) {
    console.error("Get letter error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
      blog: null,
    };
  }
}