import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';

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
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl'
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  };

  const AvatarContent = () => (
    <div className="relative inline-flex items-center justify-center">
      {src ? (
        <img
          src={src}
          alt={text || 'Avatar'}
          className={`
            ${sizeClasses[size]}
            rounded-full object-cover
            ring-2 ring-white
            ${className}
          `}
        />
      ) : (
        <div className={`
          ${sizeClasses[size]}
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
          block h-2.5 w-2.5 rounded-full
          ring-2 ring-white
          ${statusClasses[status]}
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