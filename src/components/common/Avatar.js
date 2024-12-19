import React from 'react';
import { User } from 'lucide-react';


const Avatar = ({ src, height = 128, text, className = '' }) => {
  const showInitials = !src && text;

  return (
    <span className={`inline-flex items-center ${className}`}>
      {src ? (
        <img
          className="rounded-full object-cover"
          src={src}
          alt={text || 'avatar'}
          style={{ width: `${height}px`, height: `${height}px` }}
        />
      ) : (
        <div
          className="rounded-full bg-gray-700 flex items-center justify-center"
          style={{ width: `${height}px`, height: `${height}px` }}
        >
          {showInitials ? (
            <span className="font-medium text-gray-300">
              {text.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className="w-3/4 h-3/4 text-gray-400" />
          )}
        </div>
      )}
    </span>
  );
};

export default Avatar;
