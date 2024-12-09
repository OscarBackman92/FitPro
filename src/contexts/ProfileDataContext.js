import React, { createContext, useContext, useState } from 'react';
import { axiosReq } from '../services/axiosDefaults';
import toast from 'react-hot-toast';

// Initial state for profile data
const initialState = {
  currentProfile: null,
  workoutData: {
    recentWorkouts: [],
    stats: {
      totalWorkouts: 0,
      weeklyWorkouts: 0,
      currentStreak: 0,
      totalMinutes: 0
    }
  },
  pageProfile: { results: [] }
};

export const ProfileDataContext = createContext(initialState);
export const SetProfileDataContext = createContext(() => {});

export const useProfileData = () => {
  const context = useContext(ProfileDataContext);
  if (context === undefined) {
    throw new Error('useProfileData must be used within a ProfileDataProvider');
  }
  return context;
};

export const useSetProfileData = () => {
  const context = useContext(SetProfileDataContext);
  if (context === undefined) {
    throw new Error('useSetProfileData must be used within a ProfileDataProvider');
  }
  return context;
};

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(initialState);

  const handleFollow = async (clickedProfile) => {
    try {
      const { data } = await axiosReq.post('/api/followers/followers/', {
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
            following_id: profile.id === clickedProfile.id ? data.id : profile.following_id
          }))
        }
      }));

      toast.success(`Following ${clickedProfile.owner}`);
    } catch (err) {
      toast.error('Failed to follow user');
      console.error('Follow error:', err);
    }
  };

  const handleUnfollow = async (clickedProfile) => {
    try {
      await axiosReq.delete(`/api/followers/followers/${clickedProfile.following_id}/`);

      setProfileData(prevState => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map(profile => ({
            ...profile,
            followers_count: profile.id === clickedProfile.id 
              ? profile.followers_count - 1 
              : profile.followers_count,
            following_id: profile.id === clickedProfile.id ? null : profile.following_id
          }))
        }
      }));

      toast.success(`Unfollowed ${clickedProfile.owner}`);
    } catch (err) {
      toast.error('Failed to unfollow user');
      console.error('Unfollow error:', err);
    }
  };

  const setWorkoutData = (workouts, stats) => {
    setProfileData(prev => ({
      ...prev,
      workoutData: {
        recentWorkouts: workouts || prev.workoutData.recentWorkouts,
        stats: stats || prev.workoutData.stats
      }
    }));
  };

  const contextValue = {
    ...profileData,
    setProfileData,
    handleFollow,
    handleUnfollow,
    setWorkoutData
  };

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider value={contextValue}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};

export default ProfileDataProvider;