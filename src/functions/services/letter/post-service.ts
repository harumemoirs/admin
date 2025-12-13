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
    date?:string
}
 

export const addLetter = async (data: AddLetterData) => {
  try {
    const form = new FormData();

    form.append("title", data.title);
    form.append("date", data.date);
    form.append("slug", data.slug);
    form.append("content", data.content);
  

    const res = await axiosLetter.post("/add-letter", form, {
      headers: { "Content-Type": "application/json" },
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
) => {
  try {
    const form = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        form.append(key, value as string);
      }
    });
 

    const res = await axiosLetter.put(`/edit-letter/${letterId}`, form, {
      headers: { "Content-Type": "application/json" },
    });

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
    letter:string
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