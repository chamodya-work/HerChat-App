import axios from "axios";

//this is simply change url in when in devolopment and deployment
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

export const axiosInstance=axios.create({
    baseURL:BASE_URL,
    withCredentials:true,  //send cookies with the request
});