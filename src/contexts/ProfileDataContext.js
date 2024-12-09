import React, { createContext, useContext, useState } from 'react';
import { axiosReq } from '../services/axiosDefaults';
import toast from 'react-hot-toast';

export const ProfileDataContext = createContext();
export const SetProfileDataContext = createContext();

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
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
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
  });

  const handleFollow = async (clickedProfile) => {
    try {
      setLoading(true);
      if (!clickedProfile?.id) {
        throw new Error('Profile ID is required');
      }

      const { data } = await axiosReq.post('/api/followers/followers/', {
        followed: clickedProfile.id,
      });

      setProfileData(prevState => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map(profile =>
            followHelper(profile, clickedProfile, data.id)
          ),
        }
      }));
      toast.success(`Following ${clickedProfile.owner}`);
    } catch (err) {
      toast.error(err.message || 'Failed to follow user');
      console.error('Follow error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (clickedProfile) => {
    try {
      setLoading(true);
      if (!clickedProfile?.following_id) {
        throw new Error('Following ID is required');
      }

      await axiosReq.delete(`/api/followers/followers/${clickedProfile.following_id}/`);
      
      setProfileData(prevState => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map(profile =>
            unfollowHelper(profile, clickedProfile)
          ),
        }
      }));
      toast.success(`Unfollowed ${clickedProfile.owner}`);
    } catch (err) {
      toast.error(err.message || 'Failed to unfollow user');
      console.error('Unfollow error:', err);
    } finally {
      setLoading(false);
    }
  };

  const setWorkoutStats = (stats) => {
    if (!stats || typeof stats !== 'object') {
      console.error('Invalid stats object');
      return;
    }

    setProfileData(prev => ({
      ...prev,
      workoutData: {
        ...prev.workoutData,
        stats: {
          totalWorkouts: stats.totalWorkouts || 0,
          weeklyWorkouts: stats.weeklyWorkouts || 0,
          currentStreak: stats.currentStreak || 0,
          totalMinutes: stats.totalMinutes || 0
        }
      }
    }));
  };

  const setRecentWorkouts = (workouts) => {
    if (!Array.isArray(workouts)) {
      console.error('Workouts must be an array');
      return;
    }

    setProfileData(prev => ({
      ...prev,
      workoutData: {
        ...prev.workoutData,
        recentWorkouts: workouts
      }
    }));
  };

  const contextValue = {
    ...profileData,
    currentProfile: profileData.pageProfile.results[0],
    loading
  };

  const setContextValue = {
    setProfileData,
    handleFollow,
    handleUnfollow,
    setWorkoutStats,
    setRecentWorkouts,
    setLoading
  };

  return (
    <ProfileDataContext.Provider value={contextValue}>
      <SetProfileDataContext.Provider value={setContextValue}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};

const followHelper = (profile, clickedProfile, following_id) => {
  if (!profile || !clickedProfile) return profile;
  
  return profile.id === clickedProfile.id
    ? {
        ...profile,
        followers_count: (profile.followers_count || 0) + 1,
        following_id,
      }
    : profile;
};

const unfollowHelper = (profile, clickedProfile) => {
  if (!profile || !clickedProfile) return profile;

  return profile.id === clickedProfile.id
    ? {
        ...profile,
        followers_count: Math.max((profile.followers_count || 1) - 1, 0),
        following_id: null,
      }
    : profile;
};

export default ProfileDataProvider;