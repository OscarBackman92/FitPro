import authService, { register, login } from './authService';
import profileService from './profileService';
import workoutService from './workoutService';

/**
 * An object that aggregates various services used in the application.
 * 
 * @property {Object} authService - Service responsible for authentication-related operations.
 * @property {Object} profileService - Service responsible for user profile-related operations.
 * @property {Object} workoutService - Service responsible for workout-related operations.
 */
const apiService = {
  authService,
  profileService,
  workoutService,
};

export { authService, register, login, profileService, workoutService };
export default apiService;