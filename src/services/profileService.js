import { axiosReq } from './axiosDefaults';
import { logger } from './loggerService';

class ProfileService {
  async getProfile(profileId) {
    logger.debug('Getting profile', { profileId });
    
    if (!profileId) {
      logger.error('No profile ID provided');
      throw new Error('Profile ID is required');
    }

    try {
      const response = await axiosReq.get(`/profiles/${profileId}/`);
      logger.debug('Got profile data', { data: response.data });
      return response.data;
    } catch (error) {
      logger.error('Error fetching profile:', error);
      throw error;
    }
  }

  async updateProfile(profileId, data) {
    logger.debug('Updating profile', { profileId, data });
    
    if (!profileId) {
      logger.error('No profile ID provided for update');
      throw new Error('Profile ID is required');
    }

    try {
      const formData = new FormData();
      
      // Handle file and other data separately
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          if (key === 'image' && data[key] instanceof File) {
            formData.append('image', data[key]);
          } else {
            formData.append(key, String(data[key]));
          }
        }
      });

      const response = await axiosReq.put(
        `/profiles/${profileId}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      logger.debug('Profile updated', { data: response.data });
      return response.data;
    } catch (error) {
      logger.error('Error updating profile:', error);
      throw error;
    }
  }

  async getProfileWorkouts(profileId, page = 1) {
    logger.debug('Getting profile workouts', { profileId, page });
    
    if (!profileId) {
      logger.error('No profile ID provided for workouts');
      throw new Error('Profile ID is required');
    }

    try {
      const response = await axiosReq.get('/workouts/', {
        params: { owner: profileId, page }
      });
      logger.debug('Got workouts', { data: response.data });
      return response.data;
    } catch (error) {
      logger.error('Error fetching workouts:', error);
      throw error;
    }
  }

  async getProfileStats(profileId) {
    logger.debug('Getting profile stats', { profileId });
    
    if (!profileId) {
      logger.error('No profile ID provided for stats');
      throw new Error('Profile ID is required');
    }

    try {
      const response = await axiosReq.get(`/profiles/${profileId}/statistics/`);
      logger.debug('Got stats', { data: response.data });
      return response.data;
    } catch (error) {
      logger.error('Error fetching stats:', error);
      throw error;
    }
  }

  async followUser(userId) {
    logger.debug('Following user', { userId });
    try {
      const response = await axiosReq.post('/followers/', {
        followed: userId
      });
      logger.debug('Follow successful', { data: response.data });
      return response.data;
    } catch (error) {
      logger.error('Error following user:', error);
      throw error;
    }
  }

  async unfollowUser(followId) {
    logger.debug('Unfollowing user', { followId });
    try {
      await axiosReq.delete(`/followers/${followId}/`);
      logger.debug('Unfollow successful');
    } catch (error) {
      logger.error('Error unfollowing user:', error);
      throw error;
    }
  }

  async getCurrentUserProfile() {
    logger.debug('Getting current user profile');
    try {
      const response = await axiosReq.get('/profiles/current/');
      logger.debug('Got current user profile', { data: response.data });
      return response.data;
    } catch (error) {
      logger.error('Error fetching current user profile:', error);
      throw error;
    }
  }

  async searchProfiles(query) {
    logger.debug('Searching profiles', { query });
    if (!query) return { results: [] };
    
    try {
      const response = await axiosReq.get('/profiles/', {
        params: { search: query }
      });
      logger.debug('Search results', { data: response.data });
      return response.data;
    } catch (error) {
      logger.error('Error searching profiles:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
export default profileService;