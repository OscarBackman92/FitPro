import React, { useRef, useState, useEffect } from 'react';
import { Upload, User, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileImageHandler = ({ 
  src, 
  onChange,
  size = 'md',
  editable = false,
  className = '' 
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32'
  };

  useEffect(() => {
    // Cleanup preview URL on unmount or when preview changes
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

    // Create preview
    setImagePreview(URL.createObjectURL(file));
    
    setIsUploading(true);
    try {
      // Call onChange handler passed from parent
      if (onChange) {
        await onChange(file);
      }
    } catch (error) {
      toast.error('Failed to upload image');
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Profile Image or Preview */}
      <div className="w-full h-full rounded-full overflow-hidden bg-gray-700">
        {imagePreview || src ? (
          <img
            src={imagePreview || src}
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
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={isUploading}
          />
          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {isUploading ? (
              <Loader className="h-6 w-6 text-white animate-spin" />
            ) : (
              <Upload className="h-6 w-6 text-white" />
            )}
          </div>
        </label>
      )}
    </div>
  );
};

export default ProfileImageHandler;