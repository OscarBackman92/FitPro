import React from 'react';

const ProfileImageHandler = ({ src, alt, className = '', size = 40 }) => {
  // Get environment variables
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const defaultImage = process.env.REACT_APP_DEFAULT_PROFILE_IMAGE;

  // Function to generate Cloudinary URL with transformations
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return defaultImage;

    // If it's already a full URL, apply transformations
    if (imageUrl.startsWith('http')) {
      // Extract the public ID from the URL
      const matches = imageUrl.match(/upload\/(?:v\d+\/)?(.+)$/);
      if (!matches) return defaultImage;
      
      const publicId = matches[1];
      return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_face,w_${size},h_${size},f_auto,q_auto/${publicId}`;
    }

    // If it's just a public ID
    return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_face,w_${size},h_${size},f_auto,q_auto/${imageUrl}`;
  };

  // Handle image error by falling back to default image
  const handleImageError = (e) => {
    if (e.target.src !== defaultImage) {
      e.target.src = defaultImage;
    }
  };

  return (
    <img
      src={getImageUrl(src)}
      alt={alt || 'Profile'}
      onError={handleImageError}
      className={`rounded-full object-cover ${className}`}
      width={size}
      height={size}
    />
  );
};

export default ProfileImageHandler;