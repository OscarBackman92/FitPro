import { axiosReq } from './axiosDefaults';

class ProfileService {
  async getProfile(profileId) {
    if (!profileId) throw new Error('Profile ID is required');

    try {
      const response = await axiosReq.get(`/api/profiles/${profileId}/`);
      return response.data;
    } catch (err) {
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
    try {
      const response = await axiosReq.get(`/api/workouts/`, { params: { owner: profileId } });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  async getProfileStats(profileId) {
    try {
      const response = await axiosReq.get(`/api/profiles/${profileId}/stats/`);
      return response.data;
    } catch (err) {
      throw err;
    }
  }
}

export const profileService = new ProfileService();
export default profileService;
