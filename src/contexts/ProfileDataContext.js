import React, { createContext, useState, useCallback, useContext } from 'react';
import { profileService } from '../services/profileService';

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);

  const fetchProfileData = useCallback(async (profileId) => {
    console.log('ProfileDataProvider: Fetching profile data for ID:', profileId);

    try {
      const [profile, workouts, stats] = await Promise.all([
        profileService.getProfile(profileId),
        profileService.getProfileWorkouts(profileId),
        profileService.getProfileStats(profileId),
      ]);

      console.log('ProfileDataProvider: Fetched profile:', profile);
      console.log('ProfileDataProvider: Fetched workouts:', workouts);
      console.log('ProfileDataProvider: Fetched stats:', stats);

      setProfileData({ pageProfile: { results: [profile] }, workouts, stats });
    } catch (err) {
      console.error('ProfileDataProvider: Error fetching profile data:', err);
      throw err;
    }
  }, []);

  const updateProfileData = useCallback((updatedProfile) => {
    console.log('ProfileDataProvider: Updating profile data with:', updatedProfile);
    setProfileData((prev) => ({
      ...prev,
      pageProfile: { results: [updatedProfile] },
    }));
  }, []);

  return (
    <ProfileDataContext.Provider value={profileData}>
      <SetProfileDataContext.Provider value={{ fetchProfileData, updateProfileData }}>
        {children}
      </SetProfileDataContext.Provider>
    </ProfileDataContext.Provider>
  );
};
