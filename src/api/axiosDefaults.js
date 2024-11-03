import axios from "axios";

// Use development URL if in development mode
const baseURL = process.env.NODE_ENV === "development" 
  ? process.env.REACT_APP_DEV_API_URL 
  : process.env.REACT_APP_API_URL;

axios.defaults.baseURL = baseURL;
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();