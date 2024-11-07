import React from 'react';

const ErrorMessage = ({ error }) => {
  return (
    <div className="text-red-500 p-4 text-center bg-red-50 rounded-lg">
      {error}
    </div>
  );
};

export default ErrorMessage;