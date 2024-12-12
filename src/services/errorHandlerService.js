import logger from './loggerService';

class ErrorHandlerService {
  constructor() {
    this.defaultMessage = 'An unexpected error occurred';
  }

  /**
   * Main error handling method for API errors
   */
  handleApiError(error, customMessage = null) {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const message = customMessage || error.message;

    logger.error('API Error:', {
      status,
      message,
      data,
      originalError: error
    });

    // Handle specific status codes
    switch (status) {
      case 400:
        return this.handleValidationError(data);
      case 401:
        return this.handleAuthenticationError(data);
      case 403:
        return this.handlePermissionError(data);
      case 404:
        return this.handleNotFoundError(data);
      case 429:
        return this.handleRateLimitError(data);
      case 500:
        return this.handleServerError(data);
      default:
        return this.handleUnknownError(data);
    }
  }

  /**
   * Handle validation errors (400)
   */
  handleValidationError(data) {
    const formattedErrors = this.formatValidationErrors(data);
    return {
      type: 'VALIDATION_ERROR',
      message: 'Please check your input',
      errors: formattedErrors,
      statusCode: 400
    };
  }

  /**
   * Handle authentication errors (401)
   */
  handleAuthenticationError(data) {
    // Clear auth tokens if present
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    return {
      type: 'AUTH_ERROR',
      message: 'Please sign in to continue',
      errors: data,
      statusCode: 401
    };
  }

  /**
   * Handle permission errors (403)
   */
  handlePermissionError(data) {
    return {
      type: 'PERMISSION_ERROR',
      message: 'You do not have permission to perform this action',
      errors: data,
      statusCode: 403
    };
  }

  /**
   * Handle not found errors (404)
   */
  handleNotFoundError(data) {
    return {
      type: 'NOT_FOUND',
      message: 'The requested resource was not found',
      errors: data,
      statusCode: 404
    };
  }

  /**
   * Handle rate limit errors (429)
   */
  handleRateLimitError(data) {
    return {
      type: 'RATE_LIMIT_ERROR',
      message: 'Too many requests. Please try again later.',
      errors: data,
      statusCode: 429
    };
  }

  /**
   * Handle server errors (500)
   */
  handleServerError(data) {
    return {
      type: 'SERVER_ERROR',
      message: 'A server error occurred. Please try again later.',
      errors: data,
      statusCode: 500
    };
  }

  /**
   * Handle unknown errors
   */
  handleUnknownError(data) {
    return {
      type: 'UNKNOWN_ERROR',
      message: this.defaultMessage,
      errors: data,
      statusCode: 500
    };
  }

  /**
   * Format validation errors into a more usable structure
   */
  formatValidationErrors(errors) {
    if (!errors) return {};
    
    if (typeof errors === 'string') {
      return { general: errors };
    }

    return Object.entries(errors).reduce((acc, [field, messages]) => {
      acc[field] = Array.isArray(messages) ? messages[0] : messages;
      return acc;
    }, {});
  }

  /**
   * Handle application-level (non-API) errors
   */
  handleApplicationError(error, context = '') {
    logger.error(`Application Error${context ? ` (${context})` : ''}:`, error);

    return {
      type: 'APP_ERROR',
      message: error.message || this.defaultMessage,
      errors: { detail: error.toString() },
      context
    };
  }

  /**
   * Create a user-friendly error message
   */
  createUserMessage(error) {
    if (error.type === 'VALIDATION_ERROR') {
      return Object.values(error.errors).join('. ');
    }
    return error.message || this.defaultMessage;
  }

  /**
   * Check if error should be reported to error tracking service
   */
  shouldReportError(error) {
    // Don't report validation or auth errors
    return !['VALIDATION_ERROR', 'AUTH_ERROR'].includes(error.type);
  }

  /**
   * Utility method to determine if an error is a network error
   */
  isNetworkError(error) {
    return !error.response && !error.status && error.message === 'Network Error';
  }

  /**
   * Utility method to determine if an error is a timeout
   */
  isTimeoutError(error) {
    return error.code === 'ECONNABORTED' || error.message.includes('timeout');
  }
}

// Create a singleton instance
export const errorHandler = new ErrorHandlerService();
export default errorHandler;

// You can remove the old errorHandler.js file as it's now consolidated here