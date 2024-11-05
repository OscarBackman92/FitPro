import authService, { register, login } from './authService';
import profileService from './profileService';
import workoutService from './workoutService';

const apiService = {
  authService,
  profileService,
  workoutService,
};

export { authService, register, login, profileService, workoutService };
export default apiService;