// Main Profile Components
export { default as ProfilePage } from './ProfilePage';
export { default as ProfileHeader } from './ProfileHeader';
export { default as ProfileStats } from './ProfileStats';
export { default as ProfileWorkouts } from './ProfileWorkouts';

// Context
export { 
  useProfileData, 
  useSetProfileData,
  ProfileDataProvider 
} from '../contexts/ProfileDataContext';

// Service
export { default as profileService } from '../services/profileService';

// Hooks and Utilities
export { 
  default as useProfileActions 
} from './hooks/useProfileActions';

// Types
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