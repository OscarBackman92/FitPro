import { axiosReq } from './axiosDefaults';

class ProfileService {
 // Get profile data by ID 
 async getProfile(profileId) {
   if (!profileId) throw new Error('Profile ID is required');
   try {
     const response = await axiosReq.get(`/api/profiles/${profileId}/`);
     return response.data;
   } catch (err) {
     throw err;
   }
 }

 // Update profile data, supports both JSON and FormData
 async updateProfile(profileId, data) {
   if (!profileId) throw new Error('Profile ID is required');
   if (!data || (!(data instanceof FormData) && Object.keys(data).length === 0)) {
     throw new Error('No data provided for update');
   }

   try {
     let headers = {};
     // Set content type for FormData
     if (data instanceof FormData) {
       headers = { 'Content-Type': 'multipart/form-data' };
     }

     const response = await axiosReq.patch(`/api/profiles/${profileId}/`, data, { headers });
     return response.data;
   } catch (err) {
     throw err;
   }
 }

 // Get workouts associated with a profile
 async getProfileWorkouts(profileId) {
   try {
     const response = await axiosReq.get(`/api/workouts/`, { params: { owner: profileId } });
     return response.data;
   } catch (err) {
     throw err;
   }
 }

 // Get profile statistics
 async getProfileStats(profileId) {
   try {
     const response = await axiosReq.get(`/api/profiles/${profileId}/stats/`);
     return response.data;
   } catch (err) {
     throw err;
   }
 }
}

// Export service instance
export const profileService = new ProfileService();
export default profileService;