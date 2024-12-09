import { axiosReq } from './axiosDefaults';

class ProfileService {
  async getProfile(profileId) {
    try {
      if (!profileId) {
        throw new Error('Profile ID is required');
      }
      const response = await axiosReq.get(`/api/profiles/${profileId}/`);
      return response.data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }

  async getCurrentUserProfile() {
    try {
      const response = await axiosReq.get('dj-rest-auth/user/');
      return response.data;
    } catch (error) {
      console.error('Current user profile fetch error:', error);
      throw error;
    }
  }

  async updateProfile(profileId, data) {
    try {
      if (!profileId) {
        throw new Error('Profile ID is required');
      }
      const response = await axiosReq.put(`/api/profiles/${profileId}/`, data);
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();