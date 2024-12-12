import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetProfileData } from '../../contexts/ProfileDataContext';
import { logger } from '../../services/loggerService';
import toast from 'react-hot-toast';

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