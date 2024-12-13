import React from 'react';
import { User } from 'lucide-react';

const Avatar = ({ src, height = 45, text, className = '' }) => {
  // Only show text if there's no image
  const showText = !src && text;

  return (
    <span className={`inline-flex items-center ${className}`}>
      {src ? (
        <img
          className="rounded-full object-cover"
          src={src}
          alt={text || "avatar"}
          style={{ width: `${height}px`, height: `${height}px` }}
        />
      ) : (
        <div 
          className="rounded-full bg-gray-700 flex items-center justify-center"
          style={{ width: `${height}px`, height: `${height}px` }}
        >
          {showText ? (
            <span className="font-medium text-gray-300">
              {text.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className="w-3/4 h-3/4 text-gray-400" />
          )}
        </div>
      )}
      {text && <span className="ml-2 text-gray-300">{text}</span>}
    </span>
  );
};

export default Avatar;