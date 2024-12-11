// src/contexts/ProfileDataContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { profileService } from '../services/profileService';
import toast from 'react-hot-toast';

export const ProfileDataContext = createContext();
export const SetProfileDataContext = createContext();

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

      setProfileData({
        pageProfile: { results: [profile] },
        workouts: workouts,
        stats: stats
      });
      
      console.log('ProfileDataProvider: State updated with new data');
      
    } catch (err) {
      console.error('ProfileDataProvider: Error in fetchProfileData:', {
        error: err,
        status: err.response?.status,
        data: err.response?.data
      });
      throw err;
    }
  }, []);

  const handleFollow = async (profileToFollow) => {
    console.log('ProfileDataProvider: handleFollow called for profile:', profileToFollow);
    
    if (!profileToFollow?.id) {
      console.error('ProfileDataProvider: Invalid profile for follow', { profileToFollow });
      toast.error('Invalid profile');
      return;
    }

    try {
      const response = await profileService.followUser(profileToFollow.id);
      console.log('ProfileDataProvider: Follow response received:', response);
      
      setProfileData(prev => {
        console.log('ProfileDataProvider: Updating state after follow');
        return {
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
        };
      });

      toast.success(`Following ${profileToFollow.owner}`);
    } catch (err) {
      console.error('ProfileDataProvider: Follow error:', err);
      toast.error('Failed to follow user');
    }
  };

  const handleUnfollow = async (profileToUnfollow) => {
    console.log('ProfileDataProvider: handleUnfollow called for profile:', profileToUnfollow);
    
    if (!profileToUnfollow?.following_id) {
      console.error('ProfileDataProvider: Invalid follow relationship', { profileToUnfollow });
      toast.error('Invalid follow relationship');
      return;
    }

    try {
      await profileService.unfollowUser(profileToUnfollow.following_id);
      console.log('ProfileDataProvider: Unfollow successful');
      
      setProfileData(prev => {
        console.log('ProfileDataProvider: Updating state after unfollow');
        return {
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
        };
      });

      toast.success(`Unfollowed ${profileToUnfollow.owner}`);
    } catch (err) {
      console.error('ProfileDataProvider: Unfollow error:', err);
      toast.error('Failed to unfollow user');
    }
  };

  const value = {
    profileData,
    fetchProfileData,
    handleFollow,
    handleUnfollow
  };

  console.log('ProfileDataProvider: Rendering with context:', { value });

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider value={value}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};

export default ProfileDataProvider;