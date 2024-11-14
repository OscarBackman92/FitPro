import { axiosReq } from './axiosDefaults';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

class ProfileService {
  async getProfile(userId) {
    try {
      logger.debug('Fetching profile', { userId });
      const response = await axiosReq.get(`/api/profiles/${userId}/`);
      logger.debug('Profile fetched successfully', { profile: response.data });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch profile');
    }
  }

  async updateProfile(userId, profileData) {
    try {
      logger.debug('Updating profile', { userId, profileData });
      const formData = this.createFormData(profileData);

      const response = await axiosReq.put(`/api/profiles/${userId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      logger.debug('Profile updated successfully', { updatedProfile: response.data });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to update profile');
    }
  }

  async getProfileStats(userId) {
    try {
      logger.debug('Fetching profile stats', { userId });
      const response = await axiosReq.get(`/api/profiles/${userId}/stats/`);
      logger.debug('Profile stats fetched successfully', { stats: response.data });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch profile stats');
    }
  }

  async updateProfileImage(userId, imageFile) {
    try {
      logger.debug('Validating image file', { fileName: imageFile.name });
      
      // Validate file type
      if (!this.isValidImageType(imageFile)) {
        throw new Error('Invalid file type. Only JPG, PNG, and WebP images are allowed.');
      }

      // Validate file size (2MB limit)
      if (!this.isValidFileSize(imageFile)) {
        throw new Error('File size exceeds 2MB limit.');
      }

      const formData = new FormData();
      formData.append('profile_image', imageFile);

      logger.debug('Uploading profile image', { userId, fileName: imageFile.name });
      const response = await axiosReq.post(`/api/profiles/${userId}/upload_image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      logger.debug('Profile image updated successfully', { 
        newImageUrl: response.data.profile_image 
      });
      
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to update profile image');
    }
  }

  async getProfileWorkouts(userId, params = {}) {
    try {
      logger.debug('Fetching profile workouts', { userId, params });
      const response = await axiosReq.get(`/api/profiles/${userId}/workouts/`, { params });
      logger.debug('Profile workouts fetched successfully', { count: response.data.results.length });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch profile workouts');
    }
  }

  async getProfileFollowers(userId, params = {}) {
    try {
      logger.debug('Fetching profile followers', { userId, params });
      const response = await axiosReq.get(`/api/profiles/${userId}/followers/`, { params });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch profile followers');
    }
  }

  async getProfileFollowing(userId, params = {}) {
    try {
      logger.debug('Fetching profile following', { userId, params });
      const response = await axiosReq.get(`/api/profiles/${userId}/following/`, { params });
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to fetch profile following');
    }
  }

  async toggleFollowProfile(userId) {
    try {
      logger.debug('Toggling profile follow', { userId });
      const response = await axiosReq.post(`/api/profiles/${userId}/toggle-follow/`);
      return response.data;
    } catch (err) {
      throw errorHandler.handleApiError(err, 'Failed to toggle profile follow');
    }
  }

  // Utility methods
  createFormData(data) {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    return formData;
  }

  isValidImageType(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    return allowedTypes.includes(file.type);
  }

  isValidFileSize(file, maxSize = 2 * 1024 * 1024) { // 2MB default limit
    return file.size <= maxSize;
  }
}

export const profileService = new ProfileService();
export default profileService;