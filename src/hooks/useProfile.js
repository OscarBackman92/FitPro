// src/hooks/useProfile.js
import { useState, useCallback } from 'react';
import { profileService } from '../services/profileService';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import toast from 'react-hot-toast';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useCurrentUser();

  const updateProfile = useCallback(async (userId, profileData) => {
    setLoading(true);
    try {
      const response = await profileService.updateProfile(userId, profileData);
      
      // Update the current user context
      setCurrentUser(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...response,
        },
      }));
      
      toast.success('Profile updated successfully');
      return response;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setCurrentUser]);

  const updateProfileImage = useCallback(async (userId, imageFile) => {
    setLoading(true);
    try {
      const response = await profileService.updateProfileImage(userId, imageFile);
      
      // Update the current user context with new image
      setCurrentUser(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          profile_image: response.profile_image,
        },
      }));
      
      toast.success('Profile image updated successfully');
      return response;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile image');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setCurrentUser]);

  return {
    loading,
    updateProfile,
    updateProfileImage,
  };
};

export default useProfile;