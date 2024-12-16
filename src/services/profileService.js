import { axiosReq } from './axiosDefaults';

class ProfileService {
  async getProfile(profileId) {
    console.log('ProfileService: Fetching profile with ID:', profileId);

    if (!profileId) throw new Error('Profile ID is required');

    try {
      const response = await axiosReq.get(`/api/profiles/${profileId}/`);
      console.log('ProfileService: Profile data received:', response.data);
      return response.data;
    } catch (err) {
      console.error('ProfileService: Error fetching profile:', err);
      throw err;
    }
  }

  async updateProfile(profileId, data) {
    console.log('ProfileService: Updating profile with ID:', profileId);

    if (!profileId) throw new Error('Profile ID is required');
    if (!data || (!(data instanceof FormData) && Object.keys(data).length === 0)) {
      throw new Error('No data provided for update');
    }

    try {
      let headers = {};

      if (data instanceof FormData) {
        console.log('FormData contents before sending:');
        for (let [key, value] of data.entries()) {
          console.log(`${key}: ${value instanceof File ? value.name : value}`);
        }
        headers = { 'Content-Type': 'multipart/form-data' };
      }

      const response = await axiosReq.patch(`/api/profiles/${profileId}/`, data, { headers });
      console.log('ProfileService: Response from backend:', response.data);
      return response.data;
    } catch (err) {
      console.error('ProfileService: Error updating profile:', err.response?.data || err.message);
      throw err;
    }
  }

  async getProfileWorkouts(profileId) {
    console.log('ProfileService: Fetching workouts for profile ID:', profileId);

    try {
      const response = await axiosReq.get(`/api/workouts/`, { params: { owner: profileId } });
      console.log('ProfileService: Workouts received:', response.data);
      return response.data;
    } catch (err) {
      console.error('ProfileService: Error fetching workouts:', err);
      throw err;
    }
  }

  async getProfileStats(profileId) {
    console.log('ProfileService: Fetching stats for profile ID:', profileId);

    try {
      const response = await axiosReq.get(`/api/profiles/${profileId}/stats/`);
      console.log('ProfileService: Stats received:', response.data);
      return response.data;
    } catch (err) {
      console.error('ProfileService: Error fetching stats:', err);
      throw err;
    }
  }
}

export const profileService = new ProfileService();
export default profileService;