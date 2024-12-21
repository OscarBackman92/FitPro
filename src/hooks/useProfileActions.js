import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetProfileData } from '../../contexts/ProfileDataContext';
import { logger } from '../../services/loggerService';
import toast from 'react-hot-toast';

/**
 * Custom hook that provides profile-related actions such as editing, updating, and viewing profiles.
 *
 * @returns {Object} An object containing the following functions:
 * - editProfile: Navigates to the profile edit page.
 * - updateProfile: Updates the profile data and navigates to the profile view page.
 * - viewProfile: Navigates to the profile view page.
 *
 * @function editProfile
 * @param {string} profileId - The ID of the profile to edit.
 *
 * @function updateProfile
 * @param {string} profileId - The ID of the profile to update.
 * @param {Object} data - The new data for the profile.
 *
 * @function viewProfile
 * @param {string} profileId - The ID of the profile to view.
 */
const useProfileActions = () => {
  const navigate = useNavigate();
  const { updateProfileData } = useSetProfileData();

  const editProfile = useCallback((profileId) => {
    navigate(`/profiles/${profileId}/edit`);
  }, [navigate]);

  const updateProfile = useCallback(async (profileId, data) => {
    try {
      await updateProfileData(profileId, data);
      toast.success('Profile updated successfully');
      navigate(`/profiles/${profileId}`);
    } catch (err) {
      logger.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    }
  }, [updateProfileData, navigate]);

  const viewProfile = useCallback((profileId) => {
    navigate(`/profiles/${profileId}`);
  }, [navigate]);

  return {
    editProfile,
    updateProfile,
    viewProfile
  };
};

export default useProfileActions;