import React from 'react';
import { Upload, User } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileImageHandler = ({ 
  src, 
  onChange,
  size = 'md',
  editable = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32'
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('ProfileImageHandler: Selected file:', file);

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error('Image must be smaller than 2MB');
      return;
    }

    // Call onChange with the validated file
    if (onChange) {
      onChange(file);
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Profile Image or Placeholder */}
      <div className="w-full h-full rounded-full overflow-hidden bg-gray-700">
        {src ? (
          <img
            src={src}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="h-1/2 w-1/2 text-gray-400" />
          </div>
        )}
      </div>

      {/* Upload Overlay */}
      {editable && (
        <label className="absolute inset-0 rounded-full cursor-pointer group">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
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