import React from 'react';
import { UserCircle } from 'lucide-react';

const Avatar = ({
  src,
  text,
  size = 'md',
  className = '',
  showStatus = false,
  status = 'offline',
}) => {
  const sizeMap = {
    xs: 'h-8 w-8 text-xs',
    sm: 'h-10 w-10 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-18 w-18 text-xl',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const statusClass = statusColors[status] || statusColors.offline;
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeClass} ${className}`}>
      {src ? (
        <img
          src={`${src}?t=${Date.now()}`}
          alt={text || 'User Avatar'}
          className="rounded-full object-cover w-full h-full bg-gray-700"
        />
      ) : (
        <div
          className="rounded-full bg-gray-700 flex items-center justify-center w-full h-full"
        >
          {text ? (
            <span className="font-medium text-gray-300">
              {text.charAt(0).toUpperCase()}
            </span>
          ) : (
            <UserCircle className="w-3/4 h-3/4 text-gray-400" />
          )}
        </div>
      )}
      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-gray-800 ${statusClass}`}
        />
      )}
    </div>
  );
};

export default Avatar;
