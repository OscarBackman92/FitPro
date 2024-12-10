import React, { createContext, useContext, useState, useCallback } from 'react';
import { profileService } from '../services/profileService';
import { logger } from '../services/loggerService';
import toast from 'react-hot-toast';

export const ProfileDataContext = createContext();
export const SetProfileDataContext = createContext();

export const useProfileData = () => {
  const context = useContext(ProfileDataContext);
  if (!context) {
    logger.error('useProfileData used outside of ProfileDataProvider');
    throw new Error('useProfileData must be used within a ProfileDataProvider');
  }
  return context;
};

export const useSetProfileData = () => {
  const context = useContext(SetProfileDataContext);
  if (!context) {
    logger.error('useSetProfileData used outside of ProfileDataProvider');
    throw new Error('useSetProfileData must be used within a ProfileDataProvider');
  }
  return context;
};

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    workouts: { results: [], count: 0, next: null },
    stats: {
      followers_count: 0,
      following_count: 0,
      total_workouts: 0,
      total_duration: 0,
      workouts_this_week: 0,
      current_streak: 0
    }
  });

  const fetchProfileData = useCallback(async (profileId) => {
    logger.debug('Fetching profile data', { profileId });
    
    if (!profileId) {
      logger.error('No profile ID provided');
      throw new Error('Profile ID is required');
    }

    try {
      const [profile, workouts, stats] = await Promise.all([
        profileService.getProfile(profileId),
        profileService.getProfileWorkouts(profileId),
        profileService.getProfileStats(profileId)
      ]);

      setProfileData({
        pageProfile: { results: [profile] },
        workouts: workouts,
        stats: stats
      });
    } catch (err) {
      logger.error('Error fetching profile data:', err);
      throw err;
    }
  }, []);

  const handleFollow = async (profileToFollow) => {
    if (!profileToFollow?.id) {
      logger.error('Invalid profile for follow', { profileToFollow });
      toast.error('Invalid profile');
      return;
    }

    try {
      const response = await profileService.followUser(profileToFollow.id);
      
      setProfileData(prev => ({
        ...prev,
        pageProfile: {
          results: prev.pageProfile.results.map(profile => ({
            ...profile,
            followers_count: profile.id === profileToFollow.id 
              ? profile.followers_count + 1 
              : profile.followers_count,
            following_id: profile.id === profileToFollow.id 
              ? response.id 
              : profile.following_id
          }))
        }
      }));

      toast.success(`Following ${profileToFollow.owner}`);
    } catch (err) {
      logger.error('Follow error:', err);
      toast.error('Failed to follow user');
    }
  };

  const handleUnfollow = async (profileToUnfollow) => {
    if (!profileToUnfollow?.following_id) {
      logger.error('Invalid follow relationship', { profileToUnfollow });
      toast.error('Invalid follow relationship');
      return;
    }

    try {
      await profileService.unfollowUser(profileToUnfollow.following_id);
      
      setProfileData(prev => ({
        ...prev,
        pageProfile: {
          results: prev.pageProfile.results.map(profile => ({
            ...profile,
            followers_count: profile.id === profileToUnfollow.id 
              ? profile.followers_count - 1 
              : profile.followers_count,
            following_id: profile.id === profileToUnfollow.id 
              ? null 
              : profile.following_id
          }))
        }
      }));

      toast.success(`Unfollowed ${profileToUnfollow.owner}`);
    } catch (err) {
      logger.error('Unfollow error:', err);
      toast.error('Failed to unfollow user');
    }
  };

  const updateProfileData = useCallback(async (profileId, data) => {
    if (!profileId) {
      logger.error('No profile ID provided for update');
      throw new Error('Profile ID is required');
    }

    try {
      const updatedProfile = await profileService.updateProfile(profileId, data);
      
      setProfileData(prev => ({
        ...prev,
        pageProfile: {
          results: prev.pageProfile.results.map(profile =>
            profile.id === profileId ? updatedProfile : profile
          )
        }
      }));

      toast.success('Profile updated successfully');
      return updatedProfile;
    } catch (err) {
      logger.error('Profile update error:', err);
      toast.error('Failed to update profile');
      throw err;
    }
  }, []);

  const value = {
    profileData,
    fetchProfileData,
    handleFollow,
    handleUnfollow,
    updateProfileData
  };

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider value={value}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};

export default ProfileDataProvider;