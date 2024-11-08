import React from 'react';

const LoadingSpinner = ({ 
  size = 'md',
  color = 'green',
  centered = false,
  fullScreen = false,
  text = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4'
  };

  const colorClasses = {
    green: 'border-green-500',
    blue: 'border-blue-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };

  const Spinner = () => (
    <div className={`flex flex-col items-center justify-center gap-3`}>
      <div className={`
        animate-spin rounded-full
        border-t-transparent
        ${sizeClasses[size]}
        ${colorClasses[color]}
      `} />
      {text && (
        <span className={`
          text-sm font-medium
          ${color === 'white' ? 'text-white' : 'text-gray-500'}
        `}>
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
        <Spinner />
      </div>
    );
  }

  if (centered) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Spinner />
      </div>
    );
  }

  return <Spinner />;
};

export default LoadingSpinner;