import React, { createContext, useContext, useState, useCallback } from 'react';
import { profileService } from '../services/profileService';
import toast from 'react-hot-toast';

// Create contexts for data and actions
const ProfileDataContext = createContext(null);
const SetProfileDataContext = createContext(null);

export const useProfileData = () => {
  const context = useContext(ProfileDataContext);
  if (!context) {
    console.error('useProfileData used outside of ProfileDataProvider');
    throw new Error('useProfileData must be used within a ProfileDataProvider');
  }
  return context;
};

export const useSetProfileData = () => {
  const context = useContext(SetProfileDataContext);
  if (!context) {
    console.error('useSetProfileData used outside of ProfileDataProvider');
    throw new Error('useSetProfileData must be used within a ProfileDataProvider');
  }
  return context;
};

export const ProfileDataProvider = ({ children }) => {
  console.log('ProfileDataProvider: Initializing');
  
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
    console.log('ProfileDataProvider: fetchProfileData called with ID:', profileId);
    
    if (!profileId) {
      console.error('ProfileDataProvider: No profile ID provided');
      throw new Error('Profile ID is required');
    }

    try {
      console.log('ProfileDataProvider: Starting parallel API requests');
      
      const [profile, workouts, stats] = await Promise.all([
        profileService.getProfile(profileId),
        profileService.getProfileWorkouts(profileId),
        profileService.getProfileStats(profileId)
      ]);

      console.log('ProfileDataProvider: All data received', {
        profile,
        workouts,
        stats
      });

      const newState = {
        pageProfile: { results: [profile] },
        workouts: workouts,
        stats: stats
      };

      console.log('ProfileDataProvider: State update details', {
        newProfile: profile,
        newWorkouts: workouts,
        newStats: stats,
        fullState: newState
      });

      setProfileData(newState);
      
      console.log('ProfileDataProvider: State updated with new data');
      
    } catch (err) {
      console.error('ProfileDataProvider: Error in fetchProfileData:', err);
      throw err;
    }
  }, []);

  const handleFollow = async (profileToFollow) => {
    if (!profileToFollow?.id) {
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
      toast.success(`Following ${profileToFollow.username}`);
    } catch (err) {
      toast.error('Failed to follow user');
    }
  };

  const handleUnfollow = async (profileToUnfollow) => {
    if (!profileToUnfollow?.following_id) {
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
      toast.success(`Unfollowed ${profileToUnfollow.username}`);
    } catch (err) {
      toast.error('Failed to unfollow user');
    }
  };

  const setContextValue = {
    fetchProfileData,
    handleFollow,
    handleUnfollow,
    updateProfileData: setProfileData
  };

  console.log('ProfileDataProvider: Current context value:', { profileData, setContextValue });

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider value={setContextValue}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};

export default ProfileDataProvider;