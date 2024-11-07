// src/services/profileService.js
import axiosInstance from './axiosInstance';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

class ProfileService {
  async getProfile(userId) {
    try {
      logger.debug('Fetching profile', { userId });
      const response = await axiosInstance.get(`/profiles/${userId}/`);
      logger.info('Profile fetched successfully', { userId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch profile');
    }
  }

  async updateProfile(userId, profileData) {
    try {
      logger.debug('Updating profile', { userId, profileData });
      const formData = new FormData();
      
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== null && profileData[key] !== undefined) {
          formData.append(key, profileData[key]);
        }
      });

      const response = await axiosInstance.put(`/profiles/${userId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      logger.info('Profile updated successfully', { userId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to update profile');
    }
  }

  async uploadProfileImage(userId, imageFile) {
    try {
      logger.debug('Uploading profile image', { userId });
      const formData = new FormData();
      formData.append('profile_image', imageFile);

      const response = await axiosInstance.post(`/profiles/${userId}/upload_image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      logger.info('Profile image uploaded successfully', { userId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to upload profile image');
    }
  }

  async getProfileStats(userId) {
    try {
      logger.debug('Fetching profile stats', { userId });
      const response = await axiosInstance.get(`/profiles/${userId}/stats/`);
      logger.info('Profile stats fetched successfully', { userId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch profile stats');
    }
  }

  async getFullProfileInfo(userId) {
    try {
      logger.debug('Fetching full profile info', { userId });
      const response = await axiosInstance.get(`/profiles/${userId}/full_info/`);
      logger.info('Full profile info fetched successfully', { userId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch full profile info');
    }
  }
}

export const profileService = new ProfileService();
export default profileService;