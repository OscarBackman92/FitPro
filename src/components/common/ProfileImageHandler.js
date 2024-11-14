import React, { useState } from 'react';
import { Upload, User, Loader } from 'lucide-react';
import { profileService } from '../../services/profileService';
import toast from 'react-hot-toast';

const ProfileImageHandler = ({ 
  src, 
  size = 128,
  editable = false,
  onImageUpdate = () => {},
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    try {
      setUploading(true);

      // Create FormData for upload
      const formData = new FormData();
      formData.append('profile_image', file);

      // Upload image using profile service
      const response = await profileService.updateProfileImage(formData);
      
      // Update UI with new image URL
      onImageUpdate(response.profile_image);
      toast.success('Profile image updated successfully');
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Failed to update profile image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      {/* Profile Image */}
      <div 
        className={`
          relative overflow-hidden rounded-full
          ${className}
        `}
        style={{ width: size, height: size }}
      >
        {src ? (
          <img
            src={src}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <User className="w-1/2 h-1/2 text-gray-400" />
          </div>
        )}

        {/* Upload Overlay */}
        {editable && !uploading && (
          <label 
            className="
              absolute inset-0 bg-black/50 opacity-0 hover:opacity-100
              flex items-center justify-center cursor-pointer
              transition-opacity duration-200
            "
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <Upload className="w-1/4 h-1/4 text-white" />
          </label>
        )}

        {/* Loading Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader className="w-1/4 h-1/4 text-white animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileImageHandler;