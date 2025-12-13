/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosNewsLetter from "../../api/newsletter";


export const removeSubscriber = async (subscriberId:string) => {
    try {
        const res = await axiosNewsLetter.post('/remove-subscriber',{
            id:subscriberId
            
        })
        
        return res.data
    } catch (error:any) {
    console.error("Error while deleting user", error);

    
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete user";

     
    throw {
      status,
      message,
    };
    }
}