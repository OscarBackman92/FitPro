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
    console.log('ProfileService: Data for update:', data);

    if (!profileId) throw new Error('Profile ID is required');

    try {
      let requestData;
      let headers = {};

      // Check if we're dealing with FormData (for image uploads)
      if (data instanceof FormData) {
        requestData = data;
        headers = { 'Content-Type': 'multipart/form-data' };
      } else {
        // For regular data, create a new FormData and append all fields
        requestData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            // Convert numbers to strings
            requestData.append(key, value.toString());
          }
        });
      }

      const response = await axiosReq.patch(`/api/profiles/${profileId}/`, requestData, {
        headers: headers
      });

      console.log('ProfileService: Profile updated successfully:', response.data);
      return response.data;
    } catch (err) {
      console.error('ProfileService: Error updating profile:', err);
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