import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetProfileData } from '../../contexts/ProfileDataContext';
import { logger } from '../../services/loggerService';
import toast from 'react-hot-toast';

const useProfileActions = () => {
  const navigate = useNavigate();
  const { handleFollow, handleUnfollow, updateProfileData } = useSetProfileData();

  const followProfile = useCallback(async (profile) => {
    try {
      await handleFollow(profile);
    } catch (err) {
      logger.error('Error following profile:', err);
      toast.error('Failed to follow profile');
    }
  }, [handleFollow]);

  const unfollowProfile = useCallback(async (profile) => {
    try {
      await handleUnfollow(profile);
    } catch (err) {
      logger.error('Error unfollowing profile:', err);
      toast.error('Failed to unfollow profile');
    }
  }, [handleUnfollow]);

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
    followProfile,
    unfollowProfile,
    editProfile,
    updateProfile,
    viewProfile
  };
};

export default useProfileActions;