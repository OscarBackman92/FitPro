const handleApiError = (err) => {
    console.error('API Error Details', {
      environment: process.env.NODE_ENV,
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });
  };
  
  export default handleApiError;
  