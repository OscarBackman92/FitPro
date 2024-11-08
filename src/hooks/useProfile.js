import { useState, useCallback } from 'react';
import { profileService } from '../services/apiService';
import toast from 'react-hot-toast';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = useCallback(async (userId, profileData) => {
    setLoading(true);
    try {
      const response = await profileService.updateProfile(userId, profileData);
      toast.success('Profile updated successfully');
      return response;
    } catch (error) {
      setError(error);
      toast.error(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfileImage = useCallback(async (userId, imageFile) => {
    setLoading(true);
    try {
      const response = await profileService.updateProfileImage(userId, imageFile);
      toast.success('Profile image updated successfully');
      return response;
    } catch (error) {
      setError(error);
      toast.error(error.message || 'Failed to update profile image');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    updateProfile,
    updateProfileImage,
  };
};