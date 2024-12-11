// src/components/common/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ color = 'green', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4'
  };

  const colorClasses = {
    green: 'border-green-500',
    white: 'border-white',
    blue: 'border-blue-500'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          animate-spin rounded-full
          border-t-transparent
          ${sizeClasses[size]}
          ${colorClasses[color]}
        `}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;