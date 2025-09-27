import { axiosInstance } from "./axios";

export const signUp= async(signupData)=>{
    const response= await axiosInstance.post("/auth/signup",signupData);
    return response.data;
}