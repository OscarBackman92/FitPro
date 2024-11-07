export const paginationUtils = {
    getNextPageParams: (currentPage, totalPages) => {
      if (currentPage < totalPages) {
        return { page: currentPage + 1 };
      }
      return null;
    },
  
    getPreviousPageParams: (currentPage) => {
      if (currentPage > 1) {
        return { page: currentPage - 1 };
      }
      return null;
    },
  
    hasMorePages: (currentPage, totalPages) => currentPage < totalPages
  };
  
  export const filterUtils = {
    buildQueryParams: (filters) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });
      return params;
    },
  
    parseQueryString: (queryString) => {
      const params = new URLSearchParams(queryString);
      const filters = {};
      params.forEach((value, key) => {
        filters[key] = value;
      });
      return filters;
    }
  };