import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://fitnessapi-d773a1148384.herokuapp.com";

// Define defaults
axios.defaults.baseURL = API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

// Create separate instances for requests and responses
export const axiosReq = axios.create();
export const axiosRes = axios.create();