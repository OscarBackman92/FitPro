import { axiosReq } from './axiosDefaults';

class ProfileService {
 async getProfile(profileId) {
   if (!profileId) {
     throw new Error('Profile ID is required');
   }
   try {
     const response = await axiosReq({
       method: 'GET',
       url: `api/profiles/${profileId}/`,
       timeout: 10000,
     }); 
     return response.data;
   } catch (err) {
     console.error('Profile fetch error:', err);
     throw err; 
   }
 }

 async updateProfile(profileId, data) {
   if (!profileId) {
     throw new Error('Profile ID is required');
   }
   try {
     const response = await axiosReq({
       method: 'PUT',
       url: `api/profiles/${profileId}/`,
       data,
       timeout: 10000,
     });
     return response.data;
   } catch (err) {
     console.error('Profile update error:', err);
     throw err;
   }
 }
}

export const profileService = new ProfileService();