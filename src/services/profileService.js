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
      
      // Handle file and text data appropriately
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

  async uploadProfileImage(userId, imageFile) {
    try {
      logger.debug('Uploading profile image', { userId });
      const formData = new FormData();
      formData.append('profile_image', imageFile);

      const response = await axiosInstance.post(`/api/profiles/${userId}/upload_image/`, formData, {
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
      const response = await axiosInstance.get(`/api/profiles/${userId}/stats/`);
      logger.info('Profile stats fetched successfully', { userId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch profile stats');
    }
  }

  async searchProfiles(query) {
    try {
      logger.debug('Searching profiles', { query });
      const response = await axiosInstance.get('/api/profiles/search/', {
        params: { q: query }
      });
      logger.info('Profile search completed', { results: response.data.results.length });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to search profiles');
    }
  }

  async getFollowStats(userId) {
    try {
      logger.debug('Fetching follow stats', { userId });
      const response = await axiosInstance.get(`/api/profiles/${userId}/follow_stats/`);
      logger.info('Follow stats fetched successfully', { userId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch follow stats');
    }
  }

  async getFullProfileInfo(userId) {
    try {
      logger.debug('Fetching full profile info', { userId });
      const response = await axiosInstance.get(`/api/profiles/${userId}/full_info/`);
      logger.info('Full profile info fetched successfully', { userId });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch full profile info');
    }
  }

  async getProfileOverview(userId) {
    try {
      logger.debug('Fetching profile overview', { userId });
      const [profile, stats, followStats] = await Promise.all([
        this.getProfile(userId),
        this.getProfileStats(userId),
        this.getFollowStats(userId)
      ]);

      return {
        ...profile,
        stats,
        followStats
      };
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch profile overview');
    }
  }
}

export const profileService = new ProfileService();
export default profileService;