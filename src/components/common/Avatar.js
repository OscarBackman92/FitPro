import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import ProfileImageHandler from './ProfileImageHandler';

const Avatar = ({ 
  src, 
  text, 
  size = 'md', 
  href = null, 
  onClick = null,
  showStatus = false,
  status = 'offline',
  className = '' 
}) => {
  // Map size names to larger pixel values
  const sizeMap = {
    xs: 32,  // Increased from 24
    sm: 40,  // Increased from 32
    md: 48,  // Increased from 40
    lg: 56,  // Increased from 48
    xl: 72   // Increased from 64
  };

  const pixelSize = sizeMap[size] || sizeMap.md; // Default to 'md'

  const sizeClasses = {
    xs: 'h-8 w-8 text-xs',  // Increased height/width
    sm: 'h-10 w-10 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-18 w-18 text-xl'  // Larger dimensions for 'xl'
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  };

  const resolvedStatusClass = statusClasses[status] || statusClasses.offline;

  const AvatarContent = () => (
    <div className="relative inline-flex items-center justify-center">
      {src ? (
        <ProfileImageHandler
          src={src}
          size={pixelSize}
          className={className}
        />
      ) : (
        <div className={`
          ${sizeClasses[size] || sizeClasses.md}
          rounded-full bg-gray-100
          flex items-center justify-center
          ${className}
        `}>
          {text ? (
            <span className="font-medium text-gray-600">
              {text.charAt(0).toUpperCase()}
            </span>
          ) : (
            <UserCircle className="w-full h-full text-gray-400" />
          )}
        </div>
      )}

      {showStatus && (
        <span className={`
          absolute bottom-0 right-0
          block h-3 w-3 rounded-full
          ring-2 ring-white
          ${resolvedStatusClass}
        `} />
      )}
    </div>
  );

  if (href) {
    return (
      <Link 
        to={href}
        className="inline-block hover:opacity-80 transition-opacity"
      >
        <AvatarContent />
      </Link>
    );
  }

  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className="inline-block hover:opacity-80 transition-opacity"
      >
        <AvatarContent />
      </button>
    );
  }

  return <AvatarContent />;
};

export default Avatar;
