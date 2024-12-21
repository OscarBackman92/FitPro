import React, { createContext, useState, useCallback, useContext } from 'react';
import { profileService } from '../services/profileService';

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

/**
 * ProfileDataProvider component that provides profile data context to its children.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The ProfileDataProvider component.
 *
 * @example
 * <ProfileDataProvider>
 *   <YourComponent />
 * </ProfileDataProvider>
 */

/**
 * Fetches profile data including profile, workouts, and stats.
 *
 * @function
 * @name fetchProfileData
 * @param {string} profileId - The ID of the profile to fetch data for.
 * @returns {Promise<void>} A promise that resolves when the data is fetched.
 * @throws Will throw an error if the data fetching fails.
 *
 * @example
 * fetchProfileData('profileId123');
 */

/**
 * Updates the profile data with the provided updated profile.
 *
 * @function
 * @name updateProfileData
 * @param {Object} updatedProfile - The updated profile data.
 * @returns {Promise<void>} A promise that resolves when the data is updated.
 *
 * @example
 * updateProfileData({ id: 'profileId123', name: 'New Name' });
 */
export const ProfileDataProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfileData = useCallback(async (profileId) => {
    if (isUpdating) return;
    

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