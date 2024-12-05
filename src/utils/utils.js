// utils.js
export const formatErrorMessages = (errors) => {
  if (typeof errors === 'string') return errors;
  
  return Object.entries(errors)
    .map(([key, value]) => {
      const message = Array.isArray(value) ? value[0] : value;
      return `${key}: ${message}`;
    })
    .join('\n');
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes 
    ? `${hours}h ${remainingMinutes}m` 
    : `${hours}h`;
};

export const validateWorkoutData = (data) => {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  }

  if (!data.workout_type) {
    errors.workout_type = 'Workout type is required';
  }

  if (!data.duration || data.duration <= 0 || data.duration > 1440) {
    errors.duration = 'Duration must be between 1 and 1440 minutes';
  }

  if (!data.date_logged) {
    errors.date_logged = 'Date is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};