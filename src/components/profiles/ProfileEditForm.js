import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosReq } from '../../services/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Camera, Save, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    weight: '',
    height: '',
    gender: '',
    date_of_birth: '',
    profile_image: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleMount = async () => {
      if (currentUser?.profile_id?.toString() !== id) {
        navigate('/');
        return;
      }
      try {
        const { data } = await axiosReq.get(`api/profiles/${id}/`);
        const { name, bio, weight, height, gender, date_of_birth, profile_image } = data;
        setProfileData({ name, bio, weight, height, gender, date_of_birth, profile_image });
      } catch (err) {
        toast.error('Failed to load profile data');
        navigate('/');
      }
    };
    handleMount();
  }, [currentUser, navigate, id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    
    Object.keys(profileData).forEach((key) => {
      if (profileData[key] !== null && profileData[key] !== undefined) {
        formData.append(key, profileData[key]);
      }
    });

    try {
      await axiosReq.put(`api/profiles/${id}/`, formData);
      toast.success('Profile updated successfully');
      navigate(`/profiles/${id}`);
    } catch (err) {
      console.error('Profile update error:', err);
      setErrors(err.response?.data || {});
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(profileData.profile_image);
      setProfileData({
        ...profileData,
        profile_image: event.target.files[0],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-6">Edit Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={
                    profileData.profile_image instanceof File
                      ? URL.createObjectURL(profileData.profile_image)
                      : profileData.profile_image || '/default-avatar.png'
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
                />
                <label className="absolute bottom-0 right-0 p-2 bg-green-500 rounded-full 
                  cursor-pointer hover:bg-green-600 transition-colors">
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

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg 
                  py-2 px-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors.name?.map((message, idx) => (
                <p key={idx} className="mt-1 text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {message}
                </p>
              ))}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Bio
              </label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg 
                  py-2 px-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors.bio?.map((message, idx) => (
                <p key={idx} className="mt-1 text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {message}
                </p>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={profileData.weight}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg 
                    py-2 px-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {errors.weight?.map((message, idx) => (
                  <p key={idx} className="mt-1 text-sm text-red-500 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {message}
                  </p>
                ))}
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={profileData.height}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg 
                    py-2 px-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {errors.height?.map((message, idx) => (
                  <p key={idx} className="mt-1 text-sm text-red-500 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {message}
                  </p>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Gender
              </label>
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg 
                  py-2 px-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
              {errors.gender?.map((message, idx) => (
                <p key={idx} className="mt-1 text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {message}
                </p>
              ))}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={profileData.date_of_birth}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg 
                  py-2 px-3 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors.date_of_birth?.map((message, idx) => (
                <p key={idx} className="mt-1 text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {message}
                </p>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <X className="h-5 w-5" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg 
                  hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditForm;