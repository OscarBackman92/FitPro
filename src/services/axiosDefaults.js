import axios from 'axios';

const baseURL = 'https://fitpro1-bc76e0450a19.herokuapp.com/';

axios.defaults.baseURL = baseURL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

export const axiosReq = axios.create({
  baseURL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

export const axiosRes = axios.create({
  baseURL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
  withCredentials: true
});