// src/services/profileService.js
import { axiosReq } from './axiosDefaults';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

class ProfileService {
  async getProfile(userId) {
    try {
      logger.debug('Fetching profile', { userId });
      const response = await axiosReq.get(`/api/profiles/${userId}/`);
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch profile');
    }
  }

  async updateProfile(userId, profileData) {
    try {
      logger.debug('Updating profile', { userId, profileData });
      const formData = new FormData();
      
      // Handle file and non-file fields
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== null && profileData[key] !== undefined) {
          if (key === 'profile_image' && profileData[key] instanceof File) {
            formData.append(key, profileData[key]);
          } else {
            formData.append(key, profileData[key]);
          }
        }
      });

      const response = await axiosReq.put(`/api/profiles/${userId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to update profile');
    }
  }

  async getProfileStats(userId) {
    try {
      logger.debug('Fetching profile stats', { userId });
      const response = await axiosReq.get(`/api/profiles/${userId}/stats/`);
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch profile stats');
    }
  }

  async updateProfileImage(userId, imageFile) {
    try {
      logger.debug('Updating profile image', { userId });
      const formData = new FormData();
      formData.append('profile_image', imageFile);

      const response = await axiosReq.post(`/api/profiles/${userId}/upload_image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to update profile image');
    }
  }
}

export const profileService = new ProfileService();
export default profileService;