import axiosInstance from './axiosInstance';
import handleApiError from '../utils/errorHandler';

const profileService = {
  getProfile: async (userId) => {
    try {
      const response = await axiosInstance.get(`/profiles/${userId}/`);
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to fetch profile');
    }
  },

  updateProfile: async (userId, profileData) => {
    try {
      const response = await axiosInstance.put(`/profiles/${userId}/`, profileData);
      return response.data;
    } catch (err) {
      handleApiError(err);
      throw new Error('Failed to update profile');
    }
  },
};

export default profileService;
