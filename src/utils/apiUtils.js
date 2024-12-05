export const apiUtils = {
  buildQueryString: (params = {}) => {
    return Object.entries(params)
      .filter(([_, value]) => value != null && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  },

  handlePagination: (response) => {
    const { count, next, previous, results } = response;
    const nextPage = next ? parseInt(new URL(next).searchParams.get('page')) : null;
    const prevPage = previous ? parseInt(new URL(previous).searchParams.get('page')) : null;
    return { count, nextPage, prevPage, results };
  },

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