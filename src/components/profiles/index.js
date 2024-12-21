// Main Profile Components
// Exporting main components used in the profile section of the application
export { default as ProfilePage } from './ProfilePage';
export { default as ProfileHeader } from './ProfileHeader';
export { default as ProfileStats } from './ProfileStats';
export { default as ProfileWorkouts } from './ProfileWorkouts';

// Context
// Exporting hooks and provider from ProfileDataContext to manage profile data state
export { 
  useProfileData, 
  useSetProfileData,
  ProfileDataProvider 
} from '../contexts/ProfileDataContext';

// Service
// Exporting profile service for API calls related to profile data
export { default as profileService } from '../services/profileService';

// Hooks and Utilities
// Exporting custom hook for profile actions
export { 
  default as useProfileActions 
} from './hooks/useProfileActions';

// Types
// Defining and exporting constants for profile-related types
export const PROFILE_TYPES = {
  WORKOUT_TYPES: [
    { value: 'cardio', label: 'Cardio' },
    { value: 'strength', label: 'Strength Training' },
    { value: 'flexibility', label: 'Flexibility' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' }
  ],
  INTENSITY_LEVELS: [
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' }
  ]
};