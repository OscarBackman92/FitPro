import { axiosReq } from './axiosDefaults';

export const authService = {
  async login(credentials) {
    const response = await axiosReq.post('dj-rest-auth/login/', credentials);
    if (response.data.key) {
      localStorage.setItem('token', response.data.key);
    }
    return response.data;
  },

  async register(userData) {
    const response = await axiosReq.post('dj-rest-auth/registration/', userData);
    return response.data;
  },

  async logout() {
    await axiosReq.post('dj-rest-auth/logout/');
    localStorage.removeItem('token');
  },

  async refreshToken() {
    const response = await axiosReq.post('dj-rest-auth/token/refresh/');
    if (response.data.key) {
      localStorage.setItem('token', response.data.key);
    }
    return response.data;
  },

  async getCurrentUser() {
    const response = await axiosReq.get('dj-rest-auth/user/');
    return response.data;
  }
};

export default authService;