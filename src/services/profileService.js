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
      const formData = new FormData();
      if (data.profile_image instanceof File) {
        console.log('ProfileService: Adding profile image to FormData');
        formData.append('profile_image', data.profile_image, data.profile_image.name);
      }

      const response = await axiosReq.patch(`/api/profiles/${profileId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
