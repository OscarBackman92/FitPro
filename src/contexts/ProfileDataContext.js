import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosReq } from '../services/axiosDefaults';
import { useCurrentUser } from './CurrentUserContext';
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
  const { currentUser } = useCurrentUser();
  const [profileData, setProfileData] = useState({
    pageProfile: { results: [] },
    popularProfiles: { results: [] },
  });

  const handleFollow = async (clickedProfile) => {
    try {
      const { data } = await axiosReq.post('/api/followers/followers/', {
        followed: clickedProfile.id,
      });

      setProfileData(prevState => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map(profile =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map(profile =>
            followHelper(profile, clickedProfile, data.id)
          ),
        },
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
          results: prevState.pageProfile.results.map(profile =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map(profile =>
            unfollowHelper(profile, clickedProfile)
          ),
        },
      }));
      toast.success(`Unfollowed ${clickedProfile.owner}`);
    } catch (err) {
      toast.error('Failed to unfollow user');
      console.error('Unfollow error:', err);
    }
  };

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(
          "/api/profiles/?ordering=-followers_count"
        );
        setProfileData(prevState => ({
          ...prevState,
          popularProfiles: data,
        }));
      } catch (err) {
        console.error('Error loading popular profiles:', err);
        toast.error('Failed to load popular profiles');
      }
    };

    handleMount();
  }, [currentUser]);

  const contextValue = {
    pageProfile: profileData.pageProfile,
    popularProfiles: profileData.popularProfiles,
  };

  const setContextValue = {
    setProfileData,
    handleFollow,
    handleUnfollow,
  };

  return (
    <ProfileDataContext.Provider value={contextValue}>
      <SetProfileDataContext.Provider value={setContextValue}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};

// Helper functions
const followHelper = (profile, clickedProfile, following_id) => {
  return profile.id === clickedProfile.id
    ? {
        ...profile,
        followers_count: profile.followers_count + 1,
        following_id,
      }
    : profile.is_owner
    ? { ...profile, following_count: profile.following_count + 1 }
    : profile;
};

const unfollowHelper = (profile, clickedProfile) => {
  return profile.id === clickedProfile.id
    ? {
        ...profile,
        followers_count: profile.followers_count - 1,
        following_id: null,
      }
    : profile.is_owner
    ? { ...profile, following_count: profile.following_count - 1 }
    : profile;
};