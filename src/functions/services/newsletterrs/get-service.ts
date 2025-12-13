/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosNewsLetter from "../../api/newsletter";

export const getPaginatedSubscribers = async (page:number,limit:number) => {
    try{
        const res = await axiosNewsLetter.get("/get-subscribers",{
            params:{page,limit},
        }) 
        return res.data;
    }catch(error:any){
        console.error("Error fetching subscribers",error?.respose?.data || error);
        throw new Error(error?.response?.data?.message || "Failed to fetch subcribers")
    } 
}
