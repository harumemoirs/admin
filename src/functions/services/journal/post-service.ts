/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosJournals from "../../api/journal"
interface AddJournalData{
    title:string,
    synopsis:string,
    slug:string,
    content:string
}
interface EditJournalData{
    title?:string,
    synopsis?:string,
    slug?:string,
    content?:string
}
 

export const addJournal = async (data: AddJournalData, image: File) => {
  try {
    const form = new FormData();

    form.append("title", data.title);
    form.append("synopsis", data.synopsis);
    form.append("slug", data.slug);
    form.append("content", data.content);
    form.append("image", image);  

    const res = await axiosJournals.post("/add-journal", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status === 201 || res.status === 200) {
      return {
        success: true,
        message: "Journal created successfully",
        journal: res.data,
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

export const editJournal = async (
  journalId: string,
  data:EditJournalData,
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

    const res = await axiosJournals.put(`/edit-journals/${journalId}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status === 200) {
      return {
        success: true,
        message: "Journal updated successfully",
        journal: res.data,
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

interface RemoveJournalData {
    journalId:string
}
export const removeJournal = async (data:RemoveJournalData) => {
  try {
    const res = await axiosJournals.delete(`/delete-journal`,{
        data
    });

      
    if (res.status === 200 || res.status === 204) {
      return {
        success: true,
        message: "Journal removed successfully",
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
        message: msg || "Invalid journal ID",
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
        message: "You don't have permission to delete this journal",
      };
    }

    if (status === 404) {
      return {
        success: false,
        message: "Journal not found",
      };
    }

    if (status === 500) {
      return {
        success: false,
        message: "Server error — try again later",
      };
    }

  
    return {
      success: false,
      message: msg || "Something went wrong",
    };
  }
};