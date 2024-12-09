import { axiosReq } from './axiosDefaults';
import { logger } from './loggerService';

class ProfileService {
  async getProfile(profileId) {
    try {
      const response = await axiosReq.get(`/profiles/${profileId}/`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching profile:', error);
      throw error;
    }
  }

  async updateProfile(profileId, data) {
    try {
      const formData = new FormData();
      
      // Append all profile data to FormData
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          if (key === 'image' && data[key] instanceof File) {
            formData.append('image', data[key]);
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      const response = await axiosReq.put(`/profiles/${profileId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      logger.error('Error updating profile:', error);
      throw error;
    }
  }

  async getProfileWorkouts(profileId, page = 1) {
    try {
      const response = await axiosReq.get(`/workouts/`, {
        params: {
          owner: profileId,
          page,
        },
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching profile workouts:', error);
      throw error;
    }
  }

  async getProfileStats(profileId) {
    try {
      const response = await axiosReq.get(`/profiles/${profileId}/statistics/`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching profile statistics:', error);
      throw error;
    }
  }

  async updateProfileImage(profileId, imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axiosReq.patch(`/profiles/${profileId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      logger.error('Error updating profile image:', error);
      throw error;
    }
  }

  async searchProfiles(query) {
    try {
      const response = await axiosReq.get(`/profiles/`, {
        params: { search: query }
      });
      return response.data;
    } catch (error) {
      logger.error('Error searching profiles:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
export default profileService;