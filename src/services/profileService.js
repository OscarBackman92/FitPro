// src/services/profileService.js
import axiosInstance from './axiosInstance';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

class ProfileService {
  async getProfile(userId) {
    try {
      logger.debug('Fetching profile', { userId });
      const response = await axiosInstance.get(`/api/profiles/${userId}/`);
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
          if (key === 'profile_image' && profileData[key] instanceof File) {
            formData.append(key, profileData[key]);
          } else {
            formData.append(key, profileData[key]);
          }
        }
      });

      const response = await axiosInstance.put(`/api/profiles/${userId}/`, formData, {
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

  async getProfileStats(userId) {
    try {
      logger.debug('Fetching profile stats', { userId });
      const response = await axiosInstance.get(`/api/profiles/${userId}/stats/`);
      logger.info('Profile stats fetched successfully', { userId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch profile stats');
    }
  }

  async getProfileWorkouts(userId, params = {}) {
    try {
      logger.debug('Fetching profile workouts', { userId, params });
      const response = await axiosInstance.get(`/api/profiles/${userId}/workouts/`, { params });
      logger.info('Profile workouts fetched successfully', { userId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch profile workouts');
    }
  }

  async getProfileGoals(userId) {
    try {
      logger.debug('Fetching profile goals', { userId });
      const response = await axiosInstance.get(`/api/profiles/${userId}/goals/`);
      logger.info('Profile goals fetched successfully', { userId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch profile goals');
    }
  }

  async updateProfileImage(userId, imageFile) {
    try {
      logger.debug('Updating profile image', { userId });
      const formData = new FormData();
      formData.append('profile_image', imageFile);

      const response = await axiosInstance.post(`/api/profiles/${userId}/upload_image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      logger.info('Profile image updated successfully', { userId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to update profile image');
    }
  }
}

export const profileService = new ProfileService();
export default profileService;