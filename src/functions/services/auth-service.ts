/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosLoginAuth } from "../api/auth";

export const loginAdmin = async (email: string, password: string) => {
  try {
    const res = await axiosLoginAuth.post("", {
      email,
      password,
    });
    
    return res.data;
  } catch (error: any) {
    console.error("Error while login", error);

    
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to login";

     
    throw {
      status,
      message,
    };
  }
};
