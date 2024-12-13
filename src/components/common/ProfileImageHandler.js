import React, { useState, useEffect } from 'react';
import { Upload, User, Loader } from 'lucide-react';
import { profileService } from '../../services/profileService';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import toast from 'react-hot-toast';

const ProfileImageHandler = ({ 
  src, 
  size = 128,
  editable = false,
  onImageUpdate = () => {},
  className = ''
}) => {
  const { currentUser } = useCurrentUser();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(src);

  // Update imageUrl when src prop changes
  useEffect(() => {
    setImageUrl(src);
  }, [src]);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
  
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }
  
    try {
      setUploading(true);
      
      const profileId = currentUser?.profile?.id;
      if (!profileId) {
        throw new Error('No profile ID available');
      }
  
      const response = await profileService.updateProfile(profileId, {
        profile_image: file
      });

      // Update the image URL with the new image from response
      const newImageUrl = response.profile_image;
      setImageUrl(newImageUrl);
      onImageUpdate(newImageUrl);
      
      toast.success('Profile image updated successfully');
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Failed to update profile image');
    } finally {
      setUploading(false);
    }
  };

  const displayImage = imageUrl || src;

  return (
    <div className="relative">
      <div 
        className={`
          relative overflow-hidden rounded-full
          ${className}
        `}
        style={{ width: size, height: size }}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <User className="w-1/2 h-1/2 text-gray-400" />
          </div>
        )}

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