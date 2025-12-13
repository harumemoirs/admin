/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosJournals from "../../api/journal";
 

export const getAllJournals = async (page = 1, limit = 9) => {
  try {
    const res = await axiosJournals.get("/all-journals", {
      params: { page, limit },
    });

    return res.data;
  } catch (error: any) {
    console.error("Error fetching journals:", error?.response?.data || error);
    throw new Error(error?.response?.data?.message || "Failed to get journals");
  }
};
 

export const getJournalBySlug = async (slug: string) => {
  try {
    const res = await axiosJournals.get(`/by-slug/${slug}`);
    return res.data;  
  } catch (error) {
    console.error("Error fetching journal ", error);
    throw error;
  }
};

export const getJournalById = async (id:string) => {
  try {
    const res = await axiosJournals.get(`/journal-id/${id}`)
    return res.data
  } catch (error) {
    console.error('Error fetching journal',error)
    throw error
  }
}