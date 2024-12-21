/**
 * Utility functions for API operations.
 */
export const apiUtils = {
  /**
   * Builds a query string from an object of parameters.
   * 
   * @param {Object} params - The parameters to be converted into a query string.
   * @param {string|number|null} [params.key] - The value of the parameter.
   * @returns {string} The query string.
   */
  buildQueryString: (params = {}) => {
    return Object.entries(params)
      .filter(([_, value]) => value != null && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  },

  /**
   * Handles pagination information from an API response.
   * 
   * @param {Object} response - The API response containing pagination data.
   * @param {number} response.count - The total number of items.
   * @param {string} response.next - The URL for the next page of results.
   * @param {string} response.previous - The URL for the previous page of results.
   * @param {Array} response.results - The array of results for the current page.
   * @returns {Object} An object containing pagination details.
   * @returns {number} [return.count] - The total number of items.
   * @returns {number|null} [return.nextPage] - The next page number, or null if there is no next page.
   * @returns {number|null} [return.prevPage] - The previous page number, or null if there is no previous page.
   * @returns {Array} [return.results] - The array of results for the current page.
   */
  handlePagination: (response) => {
    const { count, next, previous, results } = response;
    const nextPage = next ? parseInt(new URL(next).searchParams.get('page')) : null;
    const prevPage = previous ? parseInt(new URL(previous).searchParams.get('page')) : null;
    return { count, nextPage, prevPage, results };
  },

  /**
   * Handles errors from a Django API response.
   * 
   * @param {Object} error - The error object.
   * @param {Object} error.response - The response object from the error.
   * @param {Object|string} error.response.data - The data from the error response.
   * @returns {Object} An object containing the error message.
   * @returns {string} [return.message] - The error message.
   */
  handleDjangoErrors: (error) => {
    if (!error.response) return { message: 'Network error' };
    
    const { data } = error.response;
    if (typeof data === 'string') return { message: data };

    if (typeof data === 'object') {
      const errors = Object.entries(data)
        .map(([key, value]) => {
          const message = Array.isArray(value) ? value[0] : value;
          return `${key}: ${message}`;
        })
        .join('\n');
      return { message: errors };
    }

    return { message: 'An error occurred' };
  }
};

export default apiUtils;