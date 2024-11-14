import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { profileService } from '../../services/profileService';
import { Camera, Save, X } from 'lucide-react';
import ProfileImageHandler from '../common/ProfileImageHandler';
import toast from 'react-hot-toast';

const ProfileEditForm = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useCurrentUser();
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    weight: '',
    height: '',
    gender: '',
    date_of_birth: '',
    profile_image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.profile) {
      setProfileData({
        name: currentUser.profile.name || '',
        bio: currentUser.profile.bio || '',
        weight: currentUser.profile.weight || '',
        height: currentUser.profile.height || '',
        gender: currentUser.profile.gender || '',
        date_of_birth: currentUser.profile.date_of_birth || '',
        profile_image: null,
      });
    }
  }, [currentUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
      setProfileData(prev => ({
        ...prev,
        profile_image: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const updatedProfile = await profileService.updateProfile(currentUser.profile.id, profileData);
      
      // Update the current user context with new profile data
      setCurrentUser(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...updatedProfile,
        },
      }));

      toast.success('Profile updated successfully');
      navigate(`/profiles/${currentUser.profile.id}`);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser?.profile) {
    return navigate('/');
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>

        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <ProfileImageHandler
              src={previewImage || currentUser.profile.profile_image}
              size={128}
              className="ring-4 ring-gray-700"
            />
            <label className="absolute bottom-0 right-0 p-2 bg-green-500 rounded-full cursor-pointer hover:bg-green-600 transition-colors">
              <Camera className="h-5 w-5 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Profile Form Fields */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white"
              placeholder="Your name"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Bio</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white"
              placeholder="Tell us about yourself"
            />
          </div>

          {/* Physical Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={profileData.weight}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={profileData.height}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Gender</label>
            <select
              name="gender"
              value={profileData.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white"
            >
              <option value="">Prefer not to say</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={profileData.date_of_birth}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg 
              hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;