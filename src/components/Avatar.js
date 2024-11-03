import React from 'react';

const Avatar = ({ src, height = 45, text }) => {
  return (
    <span>
      <img
        className="rounded-circle me-2"
        src={src}
        height={height}
        width={height}
        alt="avatar"
      />
      {text}
    </span>
  );
};

export default Avatar;