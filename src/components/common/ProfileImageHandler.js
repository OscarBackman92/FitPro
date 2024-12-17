// ProfileImageHandler.js
import React from 'react';
import { Upload, User } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileImageHandler = ({ 
  src, 
  onChange, 
  size = 'md', 
  editable = false,
  disabled = false 
}) => {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32'
  };

  // Function to format Cloudinary URL with transformations
  const getOptimizedImageUrl = (url) => {
    if (!url || url.includes('default_profile')) {
      return url;
    }
    
    // Add Cloudinary transformations
    const transformations = [
      'c_fill',      // Fill mode
      'g_face',      // Focus on face
      'f_auto',      // Auto format
      'q_auto:eco',  // Auto quality
    ];
    
    // Add size based on the component size prop
    const sizes = {
      sm: 'w_40,h_40',
      md: 'w_64,h_64',
      lg: 'w_96,h_96',
      xl: 'w_128,h_128'
    };
    
    const baseUrl = url.split('/upload/')[0] + '/upload/';
    const imageId = url.split('/upload/')[1];
    
    return `${baseUrl}${transformations.join(',')}/${sizes[size]}/${imageId}`;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image must be smaller than 2MB');
      return;
    }

    try {
      await onChange(file);
    } catch (err) {
      toast.error('Failed to update profile image');
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <div className="w-full h-full rounded-full overflow-hidden bg-gray-700">
        {src ? (
          <img
            src={getOptimizedImageUrl(src)}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="h-1/2 w-1/2 text-gray-400" />
          </div>
        )}
      </div>

      {editable && !disabled && (
        <label className="absolute inset-0 rounded-full cursor-pointer group">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={disabled}
          />
          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Upload className="h-6 w-6 text-white" />
          </div>
        </label>
      )}
    </div>
  );
};

export default ProfileImageHandler;