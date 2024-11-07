import React from 'react';
import styles from '../../styles/Avatar.module.css';

const Avatar = ({ src, height = 45, text, className }) => {
  return (
    <span className={`${styles.Avatar} ${className || ''}`}>
      <img
        className={styles.AvatarImage}
        src={src || '/default-avatar.png'}
        height={height}
        width={height}
        alt="avatar"
      />
      {text && <span className={styles.AvatarText}>{text}</span>}
    </span>
  );
};

export default Avatar;