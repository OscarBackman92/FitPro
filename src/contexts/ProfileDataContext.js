import React, { createContext, useContext, useState, useCallback } from 'react';
import { axiosReq } from '../services/axiosDefaults';
import { profileService } from '../services/profileService';
import toast from 'react-hot-toast';

export const ProfileDataContext = createContext();
export const SetProfileDataContext = createContext();

export const useProfileData = () => {
  const context = useContext(ProfileDataContext);
  if (!context) {
    throw new Error('useProfileData must be used within a ProfileDataProvider');
  }
  return context;
};

export const useSetProfileData = () => {
  const context = useContext(SetProfileDataContext);
  if (!context) {
    throw new Error('useSetProfileData must be used within a ProfileDataProvider');
  }
  return context;
};

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    // Profile data
    pageProfile: { results: [] },
    // Workout data
    workouts: {
      results: [],
      count: 0,
      next: null
    },
    // Social stats
    stats: {
      followers_count: 0,
      following_count: 0,
      total_workouts: 0,
      total_duration: 0
    }
  });

  const handleFollow = async (clickedProfile) => {
    try {
      const { data } = await axiosReq.post('/followers/', {
        followed: clickedProfile.id
      });

      setProfileData(prevState => ({
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
      }));

      toast.success(`Following ${clickedProfile.owner}`);
    } catch (err) {
      toast.error('Failed to follow user');
    }
  };

  const handleUnfollow = async (clickedProfile) => {
    try {
      await axiosReq.delete(`/followers/${clickedProfile.following_id}/`);

      setProfileData(prevState => ({
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
      }));

      toast.success(`Unfollowed ${clickedProfile.owner}`);
    } catch (err) {
      toast.error('Failed to unfollow user');
    }
  };

  const fetchProfileData = useCallback(async (profileId) => {
    try {
      const [profileResponse, workoutsResponse, statsResponse] = await Promise.all([
        profileService.getProfile(profileId),
        profileService.getProfileWorkouts(profileId),
        profileService.getProfileStats(profileId)
      ]);

      setProfileData({
        pageProfile: { results: [profileResponse] },
        workouts: workoutsResponse,
        stats: statsResponse
      });
    } catch (err) {
      toast.error('Error loading profile data');
    }
  }, []);

  const updateProfileData = useCallback(async (profileId, newData) => {
    try {
      const response = await profileService.updateProfile(profileId, newData);
      
      setProfileData(prevState => ({
        ...prevState,
        pageProfile: {
          ...prevState.pageProfile,
          results: prevState.pageProfile.results.map(profile =>
            profile.id === profileId ? { ...profile, ...response } : profile
          )
        }
      }));

      toast.success('Profile updated successfully');
      return response;
    } catch (err) {
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

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider value={value}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};

export default ProfileDataProvider;