import React, { createContext, useState, useCallback, useContext } from 'react';
import { profileService } from '../services/profileService';

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfileData = useCallback(async (profileId) => {
    if (isUpdating) return; // Don't fetch if we're updating
    
    console.log('ProfileDataProvider: Fetching profile data for ID:', profileId);

    try {
      const [profile, workouts, stats] = await Promise.all([
        profileService.getProfile(profileId),
        profileService.getProfileWorkouts(profileId),
        profileService.getProfileStats(profileId),
      ]);

      setProfileData({ pageProfile: { results: [profile] }, workouts, stats });
    } catch (err) {
      console.error('ProfileDataProvider: Error fetching profile data:', err);
      throw err;
    }
  }, [isUpdating]);

  const updateProfileData = useCallback(async (updatedProfile) => {
    setIsUpdating(true);
    try {
      setProfileData(prev => ({
        ...prev,
        pageProfile: { results: [updatedProfile] }
      }));
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider value={{ fetchProfileData, updateProfileData }}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};