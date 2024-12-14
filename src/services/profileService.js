import { axiosReq } from './axiosDefaults';

const DEBUG = process.env.NODE_ENV === 'development';

class ProfileService {
  /**
   * Fetch a profile by ID
   */
  async getProfile(profileId) {
    if (!profileId) {
      console.error('ProfileService: No profile ID provided');
      throw new Error('Profile ID is required');
    }

    if (DEBUG) console.group(`ProfileService: Fetching profile ${profileId}`);
    try {
      const response = await axiosReq.get(`/api/profiles/${profileId}/`);
      if (DEBUG) console.info('Profile data received:', response.data);
      return response.data;
    } catch (err) {
      console.error('ProfileService: Error fetching profile:', {
        status: err.response?.status,
        data: err.response?.data,
      });
      throw err;
    } finally {
      if (DEBUG) console.groupEnd();
    }
  }

  /**
   * Update a profile by ID with provided data
   */
  async updateProfile(profileId, data) {
    if (!profileId) throw new Error('No profile ID provided');
  
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
  
    if (DEBUG) {
      console.group(`Updating Profile ID: ${profileId}`);
      console.info('FormData contents:', Object.fromEntries(formData.entries()));
      console.groupEnd();
    }
  
    const response = await axiosReq.patch(`/api/profiles/${profileId}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  /**
   * Get workouts associated with a profile
   */
  async getProfileWorkouts(profileId, page = 1) {
    if (!profileId) {
      console.error('ProfileService: No profile ID provided');
      throw new Error('Profile ID is required');
    }

    if (DEBUG) console.group(`ProfileService: Fetching workouts for profile ${profileId}`);
    try {
      const response = await axiosReq.get('/api/workouts/', {
        params: { owner: profileId, page },
      });
      if (DEBUG) console.info('Workouts received:', response.data);
      return response.data;
    } catch (err) {
      console.error('ProfileService: Error fetching workouts:', {
        status: err.response?.status,
        data: err.response?.data,
      });
      throw err;
    } finally {
      if (DEBUG) console.groupEnd();
    }
  }

  /**
   * Get statistics for a profile
   */
  async getProfileStats(profileId) {
    if (!profileId) {
      console.error('ProfileService: No profile ID provided');
      throw new Error('Profile ID is required');
    }

    if (DEBUG) console.group(`ProfileService: Fetching stats for profile ${profileId}`);
    try {
      const response = await axiosReq.get(`/api/profiles/${profileId}/stats/`);
      if (DEBUG) console.info('Stats received:', response.data);
      return response.data;
    } catch (err) {
      console.error('ProfileService: Error fetching stats:', {
        status: err.response?.status,
        data: err.response?.data,
      });
      throw err;
    } finally {
      if (DEBUG) console.groupEnd();
    }
  }
}

export const profileService = new ProfileService();
export default profileService;
