import React, { createContext, useContext, useState, useCallback } from 'react';
import { axiosReq } from '../services/axiosDefaults';
import { profileService } from '../services/profileService';
import { logger } from '../services/loggerService';
import toast from 'react-hot-toast';

export const ProfileDataContext = createContext();
export const SetProfileDataContext = createContext();

export const useProfileData = () => {
  const context = useContext(ProfileDataContext);
  if (!context) {
    console.error('ProfileDataContext: Context used outside provider');
    throw new Error('useProfileData must be used within a ProfileDataProvider');
  }
  return context;
};

export const useSetProfileData = () => {
  const context = useContext(SetProfileDataContext);
  if (!context) {
    console.error('SetProfileDataContext: Context used outside provider');
    throw new Error('useSetProfileData must be used within a ProfileDataProvider');
  }
  return context;
};

export const ProfileDataProvider = ({ children }) => {
  console.log('ProfileDataProvider: Initializing provider');

  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    workouts: {
      results: [],
      count: 0,
      next: null
    },
    stats: {
      followers_count: 0,
      following_count: 0,
      total_workouts: 0,
      total_duration: 0,
      workouts_this_week: 0,
      current_streak: 0
    }
  });

  const handleFollow = async (clickedProfile) => {
    console.log('ProfileDataProvider: Following profile', { clickedProfile });
    if (!clickedProfile?.id) {
      console.error('ProfileDataProvider: Invalid profile for follow', { clickedProfile });
      toast.error('Invalid profile');
      return;
    }
    try {
      const { data } = await axiosReq.post('/followers/', {
        followed: clickedProfile.id
      });
      console.log('ProfileDataProvider: Follow successful', { data });

      setProfileData(prevState => {
        console.log('ProfileDataProvider: Updating state after follow', { prevState });
        return {
          ...prevState,
          pageProfile: {
            results: prevState.pageProfile.results.map(profile => ({
              ...profile,
              followers_count: profile.id === clickedProfile.id 
                ? profile.followers_count + 1 
                : profile.followers_count,
              following_id: profile.id === clickedProfile.id 
                ? data.id 
                : profile.following_id
            }))
          }
        };
      });

      toast.success(`Following ${clickedProfile.owner}`);
    } catch (err) {
      console.error('ProfileDataProvider: Follow error', { err });
      toast.error('Failed to follow user');
    }
  };

  const handleUnfollow = async (clickedProfile) => {
    console.log('ProfileDataProvider: Unfollowing profile', { clickedProfile });
    if (!clickedProfile?.following_id) {
      console.error('ProfileDataProvider: Invalid follow relationship', { clickedProfile });
      toast.error('Invalid follow relationship');
      return;
    }
    try {
      await axiosReq.delete(`/followers/${clickedProfile.following_id}/`);
      console.log('ProfileDataProvider: Unfollow successful');

      setProfileData(prevState => {
        console.log('ProfileDataProvider: Updating state after unfollow', { prevState });
        return {
          ...prevState,
          pageProfile: {
            results: prevState.pageProfile.results.map(profile => ({
              ...profile,
              followers_count: profile.id === clickedProfile.id 
                ? profile.followers_count - 1 
                : profile.followers_count,
              following_id: profile.id === clickedProfile.id 
                ? null 
                : profile.following_id
            }))
          }
        };
      });

      toast.success(`Unfollowed ${clickedProfile.owner}`);
    } catch (err) {
      console.error('ProfileDataProvider: Unfollow error', { err });
      toast.error('Failed to unfollow user');
    }
  };

  const fetchProfileData = useCallback(async (profileId) => {
    console.log('ProfileDataProvider: Fetching profile data', { profileId });
    if (!profileId || profileId === 'undefined') {
      console.error('ProfileDataProvider: Invalid profile ID', { profileId });
      throw new Error('Valid Profile ID is required');
    }

    try {
      console.log('ProfileDataProvider: Making API calls');
      const [profileResponse, workoutsResponse, statsResponse] = await Promise.all([
        profileService.getProfile(profileId),
        profileService.getProfileWorkouts(profileId),
        profileService.getProfileStats(profileId)
      ]);

      console.log('ProfileDataProvider: API calls successful', {
        profile: profileResponse,
        workouts: workoutsResponse,
        stats: statsResponse
      });

      setProfileData({
        pageProfile: { results: [profileResponse] },
        workouts: workoutsResponse || { results: [], count: 0, next: null },
        stats: statsResponse || {
          followers_count: 0,
          following_count: 0,
          total_workouts: 0,
          total_duration: 0,
          workouts_this_week: 0,
          current_streak: 0
        }
      });
    } catch (err) {
      console.error('ProfileDataProvider: Error fetching data', { err });
      logger.error('Error fetching profile data:', err);
      throw err;
    }
  }, []);

  const updateProfileData = useCallback(async (profileId, newData) => {
    console.log('ProfileDataProvider: Updating profile data', { profileId, newData });
    if (!profileId || profileId === 'undefined') {
      console.error('ProfileDataProvider: Invalid profile ID for update', { profileId });
      throw new Error('Valid Profile ID is required');
    }
    
    try {
      const response = await profileService.updateProfile(profileId, newData);
      console.log('ProfileDataProvider: Update successful', { response });
      
      setProfileData(prevState => {
        console.log('ProfileDataProvider: Updating state after profile update', { prevState });
        return {
          ...prevState,
          pageProfile: {
            ...prevState.pageProfile,
            results: prevState.pageProfile.results.map(profile =>
              profile.id === profileId ? { ...profile, ...response } : profile
            )
          }
        };
      });

      toast.success('Profile updated successfully');
      return response;
    } catch (err) {
      console.error('ProfileDataProvider: Update error', { err });
      toast.error('Failed to update profile');
      throw err;
    }
  }, []);

  const value = {
    profileData,
    handleFollow,
    handleUnfollow,
    fetchProfileData,
    updateProfileData
  };

  console.log('ProfileDataProvider: Current context value', { value });

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider value={value}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};

export default ProfileDataProvider;