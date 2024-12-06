import axios from "axios";

axios.defaults.baseURL = 'https://fitpro1-bc76e0450a19.herokuapp.com/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();