/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosPoem from "../../api/poem";

export const getAllPoems = async (page = 1, limit = 9) => {
  try {
    const res = await axiosPoem.get("/all-poems", {
      params: { page, limit },
    });

    return res.data;
  } catch (error: any) {
    console.error("Error fetching poems:", error?.response?.data || error);
    throw new Error(error?.response?.data?.message || "Failed to get poems");
  }
};

export const getPoemBySlug = async (slug: string) => {
  try {
    const res = await axiosPoem.get(`/poem-slug/${slug}`);
    return res.data;  
  } catch (error) {
    console.error("Error fetching poem ", error);
    throw error;
  }
};

export const getJournalById = async (id:string) => {
  try {
    const res = await axiosPoem.get(`/poem-id/${id}`)
    return res.data
  } catch (error) {
    console.error('Error fetching poem',error)
    throw error
  }
}