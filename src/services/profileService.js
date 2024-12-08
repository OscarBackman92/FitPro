import { axiosReq } from './axiosDefaults';

class ProfileService {
  async getProfile(profileId) {
    try {
      if (!profileId) {
        // If no profileId, fetch current user's profile from dj-rest-auth
        const response = await axiosReq.get('dj-rest-auth/user/');
        return response.data;
      }
      // Otherwise fetch specific profile
      const response = await axiosReq.get(`/api/profiles/${profileId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  async getCurrentUserProfile() {
    try {
      const response = await axiosReq.get('dj-rest-auth/user/');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      throw error;
    }
  }

  async updateProfile(profileId, data) {
    try {
      const response = await axiosReq.put(`/api/profiles/${profileId}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();