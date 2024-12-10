import { axiosReq } from './axiosDefaults';
import { logger } from './loggerService';

class ProfileService {
  async getProfile(profileId) {
    console.log('ProfileService: Getting profile', { profileId });
    if (!profileId || profileId === 'undefined') {
      console.error('ProfileService: Invalid profile ID', { profileId });
      throw new Error('Valid Profile ID is required');
    }
    try {
      const response = await axiosReq.get(`/profiles/${profileId}/`);
      console.log('ProfileService: Got profile data', { data: response.data });
      return response.data;
    } catch (error) {
      console.error('ProfileService: Error getting profile', { error });
      logger.error('Error fetching profile:', error);
      throw error;
    }
  }

  async updateProfile(profileId, data) {
    console.log('ProfileService: Updating profile', { profileId, data });
    if (!profileId || profileId === 'undefined') {
      console.error('ProfileService: Invalid profile ID for update', { profileId });
      throw new Error('Valid Profile ID is required');
    }
    try {
      const formData = new FormData();
      
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          if (key === 'image' && data[key] instanceof File) {
            formData.append('image', data[key]);
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      console.log('ProfileService: Sending update request');
      const response = await axiosReq.put(`/profiles/${profileId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('ProfileService: Profile updated', { data: response.data });
      return response.data;
    } catch (error) {
      console.error('ProfileService: Update error', { error });
      logger.error('Error updating profile:', error);
      throw error;
    }
  }

  async getProfileWorkouts(profileId, page = 1) {
    console.log('ProfileService: Getting workouts', { profileId, page });
    if (!profileId || profileId === 'undefined') {
      console.error('ProfileService: Invalid profile ID for workouts', { profileId });
      throw new Error('Valid Profile ID is required');
    }
    try {
      const response = await axiosReq.get(`/workouts/`, {
        params: { owner: profileId, page }
      });
      console.log('ProfileService: Got workouts', { data: response.data });
      return response.data;
    } catch (error) {
      console.error('ProfileService: Error getting workouts', { error });
      logger.error('Error fetching profile workouts:', error);
      throw error;
    }
  }

  async getProfileStats(profileId) {
    console.log('ProfileService: Getting stats', { profileId });
    if (!profileId || profileId === 'undefined') {
      console.error('ProfileService: Invalid profile ID for stats', { profileId });
      throw new Error('Valid Profile ID is required');
    }
    try {
      const response = await axiosReq.get(`/profiles/${profileId}/statistics/`);
      console.log('ProfileService: Got stats', { data: response.data });
      return response.data;
    } catch (error) {
      console.error('ProfileService: Error getting stats', { error });
      logger.error('Error fetching profile statistics:', error);
      throw error;
    }
  }

  async updateProfileImage(profileId, imageFile) {
    console.log('ProfileService: Updating profile image', { profileId });
    if (!profileId || profileId === 'undefined') {
      console.error('ProfileService: Invalid profile ID for image update', { profileId });
      throw new Error('Valid Profile ID is required');
    }
    if (!imageFile) {
      console.error('ProfileService: No image file provided');
      throw new Error('Image file is required');
    }
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axiosReq.patch(`/profiles/${profileId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('ProfileService: Image updated', { data: response.data });
      return response.data;
    } catch (error) {
      console.error('ProfileService: Image update error', { error });
      logger.error('Error updating profile image:', error);
      throw error;
    }
  }

  async getCurrentUserProfile() {
    console.log('ProfileService: Getting current user profile');
    try {
      const response = await axiosReq.get('/profiles/current/');
      console.log('ProfileService: Got current user profile', { data: response.data });
      return response.data;
    } catch (error) {
      console.error('ProfileService: Error getting current user profile', { error });
      logger.error('Error fetching current user profile:', error);
      throw error;
    }
  }

  async searchProfiles(query) {
    console.log('ProfileService: Searching profiles', { query });
    if (!query) {
      console.log('ProfileService: Empty search query, returning empty results');
      return { results: [] };
    }
    try {
      const response = await axiosReq.get(`/profiles/`, {
        params: { search: query }
      });
      console.log('ProfileService: Search results', { data: response.data });
      return response.data;
    } catch (error) {
      console.error('ProfileService: Search error', { error });
      logger.error('Error searching profiles:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
export default profileService;