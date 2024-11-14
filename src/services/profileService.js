import { axiosReq } from './axiosDefaults';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

class ProfileService {
  async getProfile(userId) {
    try {
      logger.debug('Initiating profile fetch', { 
        userId,
        endpoint: `/api/profiles/${userId}/`,
        method: 'GET'
      });

      const response = await axiosReq.get(`/api/profiles/${userId}/`, {
        timeout: 10000,
        retry: 2,
        retryDelay: 1000
      });

      if (!response.data) {
        throw new Error('No data received from profile endpoint');
      }

      logger.debug('Profile fetch successful', {
        userId,
        status: response.status,
        dataReceived: !!response.data
      });

      return response.data;
    } catch (err) {
      logger.error('Profile fetch failed', {
        userId,
        status: err.response?.status,
        statusText: err.response?.statusText,
        error: err.message,
        url: err.config?.url,
        method: err.config?.method,
        headers: err.config?.headers
      });

      if (err.response?.status === 404) {
        throw new Error('Profile not found');
      }
      if (err.response?.status === 403) {
        throw new Error('You do not have permission to view this profile');
      }
      if (err.response?.status === 401) {
        throw new Error('Please sign in to view this profile');
      }

      throw errorHandler.handleApiError(err, 'Failed to fetch profile');
    }
  }

  async updateProfile(userId, profileData) {
    try {
      logger.debug('Starting profile update', {
        userId,
        fields: Object.keys(profileData),
        hasImage: !!profileData.profile_image
      });

      let updatedImageUrl = null;
      if (profileData.profile_image instanceof File) {
        try {
          const imageResponse = await this.updateProfileImage(userId, profileData.profile_image);
          updatedImageUrl = imageResponse.profile_image;
          logger.debug('Profile image updated separately', { 
            userId, 
            newImageUrl: updatedImageUrl 
          });
        } catch (imageError) {
          logger.error('Failed to update profile image', { 
            userId, 
            error: imageError.message 
          });
          throw imageError;
        }
      }

      const { profile_image, ...restProfileData } = profileData;

      const formData = new FormData();
      Object.entries(restProfileData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          logger.debug('Processing field', { field: key, value });
          formData.append(key, value);
        }
      });

      if (updatedImageUrl) {
        formData.append('profile_image', updatedImageUrl);
      }

      logger.debug('Sending profile update request', {
        userId,
        formDataKeys: [...formData.keys()]
      });

      const response = await axiosReq.put(`/api/profiles/${userId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 15000
      });
      
      logger.debug('Profile update successful', {
        userId,
        updatedFields: Object.keys(response.data),
        imageUpdated: !!updatedImageUrl
      });

      return response.data;
    } catch (err) {
      logger.error('Profile update failed', {
        userId,
        error: err.message,
        status: err.response?.status,
        data: err.response?.data
      });

      if (err.response?.status === 413) {
        throw new Error('File size too large');
      }
      if (err.response?.status === 415) {
        throw new Error('Unsupported file type');
      }

      throw errorHandler.handleApiError(err, 'Failed to update profile');
    }
  }

  async getProfileStats(userId) {
    try {
      logger.debug('Fetching profile stats', { userId });
      const response = await axiosReq.get(`/api/profiles/${userId}/stats/`, {
        timeout: 10000
      });
      logger.debug('Profile stats fetched successfully', { stats: response.data });
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch profile stats', {
        userId,
        error: err.message,
        status: err.response?.status
      });
      throw errorHandler.handleApiError(err, 'Failed to fetch profile stats');
    }
  }

  async updateProfileImage(userId, imageFile) {
    try {
      logger.debug('Starting profile image upload', {
        userId,
        fileName: imageFile.name,
        fileSize: imageFile.size,
        fileType: imageFile.type
      });

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(imageFile.type)) {
        throw new Error('Invalid file type. Please use JPEG, PNG, or WebP images.');
      }

      // Validate file size (2MB)
      const maxSize = 2 * 1024 * 1024;
      if (imageFile.size > maxSize) {
        throw new Error('File size exceeds 2MB limit');
      }

      const formData = new FormData();
      formData.append('profile_image', imageFile);
      formData.append('folder', 'profile_images');

      logger.debug('Sending image upload request', {
        userId,
        fileName: imageFile.name,
        folder: 'profile_images'
      });

      const response = await axiosReq.post(`/api/profiles/${userId}/upload_image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000
      });

      logger.debug('Profile image upload successful', {
        userId,
        newImageUrl: response.data.profile_image
      });

      return response.data;
    } catch (err) {
      logger.error('Profile image upload failed', {
        userId,
        fileName: imageFile?.name,
        error: err.message,
        status: err.response?.status
      });
      throw errorHandler.handleApiError(err, 'Failed to upload profile image');
    }
  }

  async getProfileWorkouts(userId, params = {}) {
    try {
      logger.debug('Fetching profile workouts', { userId, params });
      const response = await axiosReq.get(`/api/profiles/${userId}/workouts/`, { 
        params,
        timeout: 10000
      });
      logger.debug('Profile workouts fetched successfully', { 
        count: response.data.results?.length 
      });
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch profile workouts', {
        userId,
        error: err.message
      });
      throw errorHandler.handleApiError(err, 'Failed to fetch profile workouts');
    }
  }

  async getProfileFollowers(userId, params = {}) {
    try {
      logger.debug('Fetching profile followers', { userId, params });
      const response = await axiosReq.get(`/api/profiles/${userId}/followers/`, { 
        params,
        timeout: 10000
      });
      logger.debug('Profile followers fetched successfully', {
        count: response.data.results?.length
      });
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch profile followers', {
        userId,
        error: err.message
      });
      throw errorHandler.handleApiError(err, 'Failed to fetch profile followers');
    }
  }

  async getProfileFollowing(userId, params = {}) {
    try {
      logger.debug('Fetching profile following', { userId, params });
      const response = await axiosReq.get(`/api/profiles/${userId}/following/`, { 
        params,
        timeout: 10000
      });
      logger.debug('Profile following fetched successfully', {
        count: response.data.results?.length
      });
      return response.data;
    } catch (err) {
      logger.error('Failed to fetch profile following', {
        userId,
        error: err.message
      });
      throw errorHandler.handleApiError(err, 'Failed to fetch profile following');
    }
  }

  async toggleFollowProfile(userId) {
    try {
      logger.debug('Toggling profile follow', { userId });
      const response = await axiosReq.post(`/api/profiles/${userId}/toggle-follow/`, null, {
        timeout: 10000
      });
      logger.debug('Profile follow toggled successfully', {
        userId,
        status: response.data.status
      });
      return response.data;
    } catch (err) {
      logger.error('Failed to toggle profile follow', {
        userId,
        error: err.message
      });
      throw errorHandler.handleApiError(err, 'Failed to toggle profile follow');
    }
  }

  validateProfileData(data) {
    if (data.weight && (data.weight < 0 || data.weight > 500)) {
      throw new Error('Weight must be between 0 and 500 kg');
    }
    if (data.height && (data.height < 0 || data.height > 300)) {
      throw new Error('Height must be between 0 and 300 cm');
    }
    if (data.date_of_birth) {
      const birthDate = new Date(data.date_of_birth);
      const age = this.calculateAge(birthDate);
      if (age > 120 || age < 13) {
        throw new Error('Age must be between 13 and 120 years');
      }
    }
  }

  calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}

export const profileService = new ProfileService();
export default profileService;