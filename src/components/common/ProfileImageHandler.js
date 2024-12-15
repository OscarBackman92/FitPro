import React, { useState } from 'react';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { profileService } from '../../services/profileService';
import toast from 'react-hot-toast';

const ProfileImageHandler = ({ src, onImageUpdate }) => {
  const { currentUser } = useCurrentUser();
  const [imageUrl, setImageUrl] = useState(src);
  const [uploading, setUploading] = useState(false); // Retained to show loading state

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('ProfileImageHandler: Selected file:', file);

    try {
      setUploading(true);

      const response = await profileService.updateProfile(currentUser?.profile?.id, {
        profile_image: file,
      });

      console.log('ProfileImageHandler: Updated profile image URL:', response.profile_image);
      setImageUrl(response.profile_image);
      onImageUpdate(response.profile_image);
    } catch (err) {
      console.error('ProfileImageHandler: Error updating profile image:', err);
      toast.error('Failed to update profile image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="relative">
        <img src={imageUrl} alt="Profile" />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="spinner" />
          </div>
        )}
        <input type="file" onChange={handleImageChange} />
      </div>
    </div>
  );
};

export default ProfileImageHandler;
