// src/services/profileService.js
import { axiosReq } from './axiosDefaults';

class ProfileService {
  async getProfile(profileId) {
    console.log('ProfileService: getProfile called with ID:', profileId);
    
    if (!profileId) {
      console.error('ProfileService: No profile ID provided');
      throw new Error('Profile ID is required');
    }

    try {
      console.log('ProfileService: Making GET request to:', `/api/profiles/${profileId}/`);
      const response = await axiosReq.get(`/api/profiles/${profileId}/`);
      console.log('ProfileService: Profile data received:', response.data);
      return response.data;
    } catch (err) {
      console.error('ProfileService: Error fetching profile:', {
        error: err,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url
      });
      throw err;
    }
  }

  async updateProfile(profileId, data) {
    console.log('ProfileService: updateProfile called', { profileId, data });
    
    if (!profileId) {
      console.error('ProfileService: No profile ID provided for update');
      throw new Error('Profile ID is required');
    }

    try {
      console.log('ProfileService: Preparing form data for update');
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          console.log('ProfileService: Adding form data field:', { key, value });
          formData.append(key, value);
        }
      });

      console.log('ProfileService: Making PATCH request');
      const response = await axiosReq.patch(
        `/api/profiles/${profileId}/`,
        formData
      );
      
      console.log('ProfileService: Profile updated successfully:', response.data);
      return response.data;
    } catch (err) {
      console.error('ProfileService: Error updating profile:', {
        error: err,
        status: err.response?.status,
        data: err.response?.data
      });
      throw err;
    }
  }

  async getProfileWorkouts(profileId, page = 1) {
    console.log('ProfileService: getProfileWorkouts called', { profileId, page });

    try {
      console.log('ProfileService: Making GET request for workouts');
      const response = await axiosReq.get('/api/workouts/', {
        params: { owner: profileId, page }
      });
      console.log('ProfileService: Workouts received:', response.data);
      return response.data;
    } catch (err) {
      console.error('ProfileService: Error fetching workouts:', {
        error: err,
        status: err.response?.status,
        data: err.response?.data
      });
      throw err;
    }
  }

  async getProfileStats(profileId) {
    console.log('ProfileService: getProfileStats called', { profileId });

    try {
      console.log('ProfileService: Making GET request for stats');
      const response = await axiosReq.get(`/api/profiles/${profileId}/stats/`);
      console.log('ProfileService: Stats received:', response.data);
      return response.data;
    } catch (err) {
      console.error('ProfileService: Error fetching stats:', {
        error: err,
        status: err.response?.status,
        data: err.response?.data
      });
      throw err;
    }
  }

  async followUser(userId) {
    console.log('ProfileService: followUser called', { userId });

    try {
      const response = await axiosReq.post('/api/social/follow/', {
        followed: userId
      });
      console.log('ProfileService: Follow successful:', response.data);
      return response.data;
    } catch (err) {
      console.error('ProfileService: Error following user:', {
        error: err,
        status: err.response?.status,
        data: err.response?.data
      });
      throw err;
    }
  }

  async unfollowUser(followId) {
    console.log('ProfileService: unfollowUser called', { followId });

    try {
      await axiosReq.delete(`/api/social/follow/${followId}/`);
      console.log('ProfileService: Unfollow successful');
    } catch (err) {
      console.error('ProfileService: Error unfollowing user:', {
        error: err,
        status: err.response?.status,
        data: err.response?.data
      });
      throw err;
    }
  }
}

export const profileService = new ProfileService();
export default profileService;