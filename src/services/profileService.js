import { axiosReq } from './axiosDefaults';

class ProfileService {
  async getProfile(profileId) {
    console.log('ProfileService: getProfile called with ID:', profileId);
    
    if (!profileId) {
      console.error('ProfileService: No profile ID provided');
      throw new Error('Profile ID is required');
    }

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
    console.log('ProfileService: updateProfile called', { profileId, data });
    
    if (!profileId) {
      throw new Error('Profile ID is required');
    }

    try {
      const formData = new FormData();
      
      // Handle profile image - must be added first and with correct field name
      if (data.profile_image instanceof File) {
        console.log('ProfileService: Adding profile image to form data');
        // Use the field name that matches your Django model field
        formData.append('profile_image', data.profile_image, data.profile_image.name);
      }
      
      // Add all other non-file fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'profile_image') {
          console.log('ProfileService: Adding form data field:', { key, value });
          formData.append(key, value);
        }
      });

      // Log FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log('ProfileService: FormData contains:', pair[0], pair[1]);
      }

      const response = await axiosReq.patch(
        `/api/profiles/${profileId}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Remove any content-type headers that might be auto-set
            'X-Requested-With': 'XMLHttpRequest',
          },
          transformRequest: (data, headers) => {
            // Delete any content-type header that axios might add
            delete headers['Content-Type'];
            return data;
          },
        }
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
      const response = await axiosReq.get('/api/workouts/', {
        params: { owner: profileId, page }
      });
      console.log('ProfileService: Workouts received:', response.data);
      return response.data;
    } catch (err) {
      console.error('ProfileService: Error fetching workouts:', err);
      throw err;
    }
  }

  async getProfileStats(profileId) {
    console.log('ProfileService: getProfileStats called', { profileId });

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