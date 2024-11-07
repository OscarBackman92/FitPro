// src/utils/validationUtils.js
import logger from '../services/loggerService';

export const workoutValidation = {
  validateWorkoutData: (data) => {
    logger.debug('Validating workout data', { data });
    const errors = {};

    if (!data.workout_type) {
      errors.workout_type = 'Workout type is required';
    }

    if (!data.date_logged) {
      errors.date_logged = 'Date is required';
    }

    if (!data.duration || data.duration <= 0) {
      errors.duration = 'Duration must be greater than 0';
    }

    if (!data.calories || data.calories < 0) {
      errors.calories = 'Calories must be a positive number';
    }

    if (data.duration > 1440) { // 24 hours in minutes
      errors.duration = 'Duration cannot exceed 24 hours';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  validateIntensity: (intensity) => {
    const validIntensities = ['low', 'moderate', 'high'];
    return validIntensities.includes(intensity);
  }
};

export const goalValidation = {
  validateGoalData: (data) => {
    logger.debug('Validating goal data', { data });
    const errors = {};

    if (!data.type) {
      errors.type = 'Goal type is required';
    }

    if (!data.description) {
      errors.description = 'Description is required';
    }

    if (!data.target) {
      errors.target = 'Target is required';
    }

    if (data.deadline) {
      const deadlineDate = new Date(data.deadline);
      const today = new Date();
      if (deadlineDate < today) {
        errors.deadline = 'Deadline cannot be in the past';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export const profileValidation = {
  validateProfileData: (data) => {
    logger.debug('Validating profile data', { data });
    const errors = {};

    if (data.weight && (data.weight < 0 || data.weight > 500)) {
      errors.weight = 'Weight must be between 0 and 500 kg';
    }

    if (data.height && (data.height < 0 || data.height > 300)) {
      errors.height = 'Height must be between 0 and 300 cm';
    }

    if (data.date_of_birth) {
      const birthDate = new Date(data.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age > 120 || age < 13) {
        errors.date_of_birth = 'Age must be between 13 and 120 years';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  validateProfileImage: (file) => {
    logger.debug('Validating profile image', { fileName: file.name });
    const errors = {};

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      errors.type = 'Only JPEG, PNG and WebP images are allowed';
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      errors.size = 'Image size cannot exceed 2MB';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};