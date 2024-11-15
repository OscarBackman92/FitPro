import { axiosReq } from './axiosDefaults';
import logger from './loggerService';
import errorHandler from './errorHandlerService';

class ProfileService {
  // Base API configuration
  #baseConfig = {
    timeout: 10000,
    retry: 2,
    retryDelay: 1000
  };

  // Validation constants
  #validation = {
    image: {
      maxSize: 2 * 1024 * 1024, // 2MB
      validTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
    profile: {
      weight: { min: 0, max: 500 },
      height: { min: 0, max: 300 },
      age: { min: 13, max: 120 }
    }
  };

  // Generic API request handler
  async #makeRequest(method, endpoint, options = {}) {
    try {
      logger.debug(`Starting ${method} request`, {
        endpoint,
        ...options.logInfo
      });

      const response = await axiosReq({
        method,
        url: endpoint,
        ...this.#baseConfig,
        ...options
      });

      logger.debug(`${method} request successful`, {
        endpoint,
        status: response.status,
        dataReceived: !!response.data
      });

      return response.data;
    } catch (err) {
      this.#handleError(err, options.customErrors);
    }
  }

  // Error handler
  #handleError(err, customErrors = {}) {
    logger.error('Request failed', {
      status: err.response?.status,
      statusText: err.response?.statusText,
      error: err.message,
      url: err.config?.url,
      method: err.config?.method
    });

    const errorMap = {
      404: 'Profile not found',
      403: 'You do not have permission to view this profile',
      401: 'Please sign in to view this profile',
      413: 'File size too large',
      415: 'Unsupported file type',
      ...customErrors
    };

    const errorMessage = errorMap[err.response?.status] || 'Request failed';
    throw errorHandler.handleApiError(err, errorMessage);
  }

  // Image validation
  #validateImage(imageFile) {
    if (!this.#validation.image.validTypes.includes(imageFile.type)) {
      throw new Error('Invalid file type. Please use JPEG, PNG, or WebP images.');
    }
    if (imageFile.size > this.#validation.image.maxSize) {
      throw new Error('File size exceeds 2MB limit');
    }
  }

  // Main API methods
  async getProfile(userId) {
    return this.#makeRequest('GET', `/api/profiles/${userId}/`, {
      logInfo: { userId }
    });
  }

  async updateProfile(userId, profileData) {
    const formData = new FormData();
    let updatedImageUrl = null;

    // Handle image update if present
    if (profileData.profile_image instanceof File) {
      this.#validateImage(profileData.profile_image);
      const imageResponse = await this.updateProfileImage(userId, profileData.profile_image);
      updatedImageUrl = imageResponse.profile_image;
    }

    // Process other profile data
    const { profile_image, ...restProfileData } = profileData;
    Object.entries(restProfileData).forEach(([key, value]) => {
      if (value != null) {
        formData.append(key, value);
      }
    });

    if (updatedImageUrl) {
      formData.append('profile_image', updatedImageUrl);
    }

    return this.#makeRequest('PUT', `/api/profiles/${userId}/`, {
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 15000,
      logInfo: { 
        userId,
        updatedFields: Object.keys(restProfileData),
        hasImage: !!updatedImageUrl
      }
    });
  }

  async updateProfileImage(userId, imageFile) {
    this.#validateImage(imageFile);
    const formData = new FormData();
    formData.append('profile_image', imageFile);
    formData.append('folder', 'profile_images');

    return this.#makeRequest('POST', `/api/profiles/${userId}/upload_image/`, {
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
      logInfo: {
        userId,
        fileName: imageFile.name,
        fileSize: imageFile.size
      }
    });
  }

  async getProfileStats(userId) {
    return this.#makeRequest('GET', `/api/profiles/${userId}/stats/`, {
      logInfo: { userId }
    });
  }

  async getProfileWorkouts(userId, params = {}) {
    return this.#makeRequest('GET', `/api/profiles/${userId}/workouts/`, {
      params,
      logInfo: { userId, params }
    });
  }

  async getProfileFollowers(userId, params = {}) {
    return this.#makeRequest('GET', `/api/profiles/${userId}/followers/`, {
      params,
      logInfo: { userId, params }
    });
  }

  async getProfileFollowing(userId, params = {}) {
    return this.#makeRequest('GET', `/api/profiles/${userId}/following/`, {
      params,
      logInfo: { userId, params }
    });
  }

  async toggleFollowProfile(userId) {
    return this.#makeRequest('POST', `/api/profiles/${userId}/toggle-follow/`, {
      logInfo: { userId }
    });
  }

  // Utility methods
  validateProfileData(data) {
    const { weight, height, date_of_birth } = data;
    const { profile } = this.#validation;

    if (weight && (weight < profile.weight.min || weight > profile.weight.max)) {
      throw new Error(`Weight must be between ${profile.weight.min} and ${profile.weight.max} kg`);
    }

    if (height && (height < profile.height.min || height > profile.height.max)) {
      throw new Error(`Height must be between ${profile.height.min} and ${profile.height.max} cm`);
    }

    if (date_of_birth) {
      const age = this.#calculateAge(new Date(date_of_birth));
      if (age < profile.age.min || age > profile.age.max) {
        throw new Error(`Age must be between ${profile.age.min} and ${profile.age.max} years`);
      }
    }
  }

  #calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}

export const profileService = new ProfileService();
export default profileService;