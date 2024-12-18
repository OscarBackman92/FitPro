// components/common/Avatar.js
import React from 'react';
import styles from '../../styles/Avatar.module.css';
import { User } from 'lucide-react';

const Avatar = ({ src, height = 45, text, className = '' }) => {
  const style = {
    width: `${height}px`,
    height: `${height}px`,
  };

  return (
    <span className={`inline-flex items-center ${className}`}>
      {src ? (
        <img
          className={`rounded-full object-cover ${styles.Avatar}`}
          src={src} 
          style={style}
          alt={text || "avatar"}
        />
      ) : (
        <div 
          className="rounded-full bg-gray-700 flex items-center justify-center"
          style={style}
        >
          {text ? (
            <span className="font-medium text-gray-300">
              {text.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className="w-3/4 h-3/4 text-gray-400" />
          )}
        </div>
      )}
      {text && <span className="ml-2">{text}</span>}
    </span>
  );
};

export default Avatar;